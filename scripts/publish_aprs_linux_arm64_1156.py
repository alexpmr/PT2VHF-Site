#!/usr/bin/env python3
"""Append verified Linux ARM64 release artifacts, preserving all existing downloads."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import re
import subprocess
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION = "1.15.6"
PACKAGES = (
    ("PT2VHF_APRS_Client_arm64_v1.15.6.AppImage", "linux-appimage", "linux-appimage-arm64", "Linux ARM64 — AppImage (Raspberry Pi)"),
    ("pt2vhf-aprs-client_1.15.6_arm64.deb", "linux-deb", "linux-deb-arm64", "Linux ARM64 — DEB (Raspberry Pi OS 64-bit)"),
    ("PT2VHF_APRS_Client_Linux_arm64_v1.15.6.tar.gz", "linux-targz", "linux-tar-arm64", "Linux ARM64 — TAR.GZ (Raspberry Pi)"),
)

def ensure_aarch64(path: Path) -> None:
    info = subprocess.check_output(["readelf", "-h", str(path)], text=True)
    if not re.search(r"Machine:\s*AArch64\b", info):
        raise ValueError(f"Expected native AArch64 ELF, got {path.name}: {info[:300]}")

def check_binary(path: Path) -> tuple[int, str]:
    size = path.stat().st_size
    if size < 1_000_000 or size > 99_000_000 or path.is_symlink():
        raise ValueError(f"Unexpected binary size or symlink: {path.name} ({size})")
    if path.name.endswith(".AppImage"):
        ensure_aarch64(path)
    elif path.name.endswith(".deb"):
        arch = subprocess.check_output(["dpkg-deb", "-f", str(path), "Architecture"], text=True).strip()
        if arch != "arm64":
            raise ValueError(f"DEB has architecture {arch}, expected arm64")
        with tempfile.TemporaryDirectory() as temp:
            subprocess.run(["dpkg-deb", "-x", str(path), temp], check=True)
            ensure_aarch64(Path(temp) / "usr/local/bin/pt2vhf-aprs-client")
    elif path.name.endswith(".tar.gz"):
        with tarfile.open(path, "r:gz") as archive, tempfile.TemporaryDirectory() as temp:
            expected = f"PT2VHF_APRS_Client_Linux_arm64_v{VERSION}"
            choices = [m for m in archive.getmembers() if Path(m.name).name == expected]
            if len(choices) != 1 or not choices[0].isfile():
                raise ValueError("TAR missing unique ARM64 executable")
            target = Path(temp) / expected
            inp = archive.extractfile(choices[0])
            if inp is None:
                raise ValueError("TAR executable unavailable")
            with inp, target.open("wb") as dest:
                import shutil
                shutil.copyfileobj(inp, dest)
            ensure_aarch64(target)
    else:
        raise ValueError("Unexpected extension: " + path.name)
    with path.open("rb") as h:
        digest = hashlib.file_digest(h, "sha256").hexdigest()
    return size, digest

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifacts", type=Path)
    args = parser.parse_args()
    source = args.artifacts.resolve()
    manifest_path = ROOT / "updates.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    aprs = manifest.get("products", {}).get("aprs")
    if manifest.get("schema") != 1 or not isinstance(aprs, dict) or aprs.get("version") != VERSION:
        raise ValueError("Official APRS site is not at version 1.15.6")
    current = list(aprs.get("files") or [])
    if len(current) < 9:
        raise ValueError("Cannot publish if current nine platform downloads are missing")
    validated = []
    for name, category, key, label in PACKAGES:
        matches = list(source.rglob(name))
        if len(matches) != 1 or not matches[0].is_file():
            raise ValueError(f"Expected one ARM64 artifact {name}, got {len(matches)}")
        size, sha = check_binary(matches[0])
        validated.append((matches[0], dict(
            name=name, category=category, counterKey=key, architecture="ARM64 / aarch64",
            platform="linux-arm64", size=size, sha256=sha, detail=label,
            url=f"https://www.pt2vhf.com/downloads/aprs-client/{name}",
            version=VERSION,
        )))
    dest = ROOT / "downloads/aprs-client"
    dest.mkdir(parents=True, exist_ok=True)
    for src, meta in validated:
        target = dest / meta["name"]
        if target.exists():
            if check_binary(target) != (meta["size"], meta["sha256"]):
                raise ValueError("Existing filename has different bytes: " + target.name)
            continue
        temp = target.with_suffix(target.suffix + ".tmp")
        try:
            with src.open("rb") as r, temp.open("wb") as w:
                import shutil
                shutil.copyfileobj(r, w, length=1024 * 1024)
            os.replace(temp, target)
        finally:
            temp.unlink(missing_ok=True)

    # Never modify existing platform entries, download counter keys or their history.
    by_name = {entry["name"]: entry for entry in current}
    for _, meta in validated:
        by_name[meta["name"]] = meta
    aprs["files"] = list(by_name.values())
    planned = list(aprs.get("plannedFiles") or [])
    names = {entry.get("name") for entry in planned}
    for _, meta in validated:
        if meta["name"] not in names:
            planned.append({k: meta[k] for k in ("category", "counterKey", "architecture", "name")})
    aprs["plannedFiles"] = planned
    aprs["notes"] = str(aprs.get("notes") or "").rstrip() + (
        " Linux ARM64/Raspberry Pi OS 64-bit: AppImage, .deb e .tar.gz nativos."
    )
    manifest["updated"] = "2026-11-01"
    staged = manifest_path.with_suffix(".json.tmp")
    staged.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    os.replace(staged, manifest_path)
    assert len(aprs["files"]) == len(current) + sum(x[1]["name"] not in {y["name"] for y in current} for x in validated)
    print(f"READY_FOR_SITE_COMMIT version={VERSION} linux-arm64={len(validated)} total={len(aprs['files'])}")
    for _, meta in validated:
        print(f"VERIFIED {meta['name']} {meta['size']} SHA256={meta['sha256']}")

if __name__ == "__main__":
    main()
