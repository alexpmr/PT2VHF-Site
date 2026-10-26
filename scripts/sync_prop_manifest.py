#!/usr/bin/env python3
"""Promote byte-verified, segmented Prop Tool packages into the official site catalog."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.pt2vhf.com"
DIRECTORY = ROOT / "downloads" / "prop-tool"
CATALOG = ROOT / "updates.json"
MIN_SIZE = 50_000_000
MAX_SIZE = 700_000_000

def validate_package(directory: Path, version: str, suffix: str) -> tuple[str, int, str]:
    name = f"PT2VHF-Prop-Tool-{version}-x64-{suffix}.exe"
    sidecar = directory / (name + ".parts.json")
    if sidecar.is_symlink() or sidecar.resolve(strict=True).parent != directory:
        raise ValueError(f"Unsafe sidecar {name}")
    meta = json.loads(sidecar.read_text(encoding="utf-8"))
    size = meta.get("size")
    pieces = meta.get("parts")
    if (meta.get("name") != name or type(size) is not int or not MIN_SIZE <= size <= MAX_SIZE
        or not isinstance(pieces, list) or not 2 <= len(pieces) <= 16):
        raise ValueError(f"Invalid package metadata {name}")
    digest = hashlib.sha256()
    total = 0
    for index, item in enumerate(pieces):
        part_name = f"{name}.part{index:02d}"
        part = directory / part_name
        if item.get("name") != part_name or part.is_symlink() or part.resolve(strict=True).parent != directory:
            raise ValueError(f"Invalid package chunk {part_name}")
        length = part.stat().st_size
        if length <= 0 or length >= 100 * 1024 * 1024 or length != item.get("size"):
            raise ValueError(f"Invalid chunk size {part_name}")
        chunk_hash = hashlib.sha256()
        with part.open("rb") as handle:
            if index == 0 and handle.read(2) != b"MZ":
                raise ValueError(f"Not a Windows executable: {name}")
            handle.seek(0)
            for buffer in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(buffer)
                chunk_hash.update(buffer)
        if chunk_hash.hexdigest() != item.get("sha256"):
            raise ValueError(f"Chunk digest mismatch {part_name}")
        total += length
    if total != size or digest.hexdigest() != meta.get("sha256"):
        raise ValueError(f"Reconstructed package digest mismatch {name}")
    return name, size, digest.hexdigest()

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    version = args.version
    if re.fullmatch(r"\d+\.\d+\.\d+", version) is None:
        parser.error("Version must match X.Y.Z")
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    if catalog.get("schema") != 1:
        raise SystemExit("Invalid catalog schema")
    prop = catalog["products"]["prop"]
    previous = prop.get("version")
    if previous and tuple(map(int, previous.split("."))) > tuple(map(int, version.split("."))):
        raise SystemExit(f"Refusing downgrade from {previous} to {version}")
    directory = DIRECTORY.resolve(strict=True)
    entries = []
    for category, kind, suffix in (
        ("windows-installer", "installer", "setup"),
        ("windows-portable", "portable", "portable"),
    ):
        name, size, sha = validate_package(directory, version, suffix)
        entries.append({
            "category": category,
            "counterKey": "win-setup-x64" if kind == "installer" else "win-portable-x64",
            "kind": kind, "architecture": "x64", "platform": "windows-x64",
            "name": name, "url": f"{SITE}/downloads/prop-tool/{name}",
            "size": size, "sha256": sha, "detail": "Windows 10/11 x64",
        })
    prop.update({
        "version": version,
        "developmentVersion": version,
        "date": date.today().isoformat(),
        "notes": "Atualizador OTA servido por pt2vhf.com; instalador e portatil Windows validados.",
        "files": entries,
        "releaseStatus": "Instaladores validados e servidos pelo site oficial.",
        "updateEndpoint": f"{SITE}/update.php?product=prop&platform=windows-x64",
    })
    catalog["updated"] = date.today().isoformat()
    if not args.apply:
        print(json.dumps(entries, ensure_ascii=False, indent=2))
        return
    temp = CATALOG.with_name("updates.json.tmp")
    try:
        temp.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temp, CATALOG)
    finally:
        temp.unlink(missing_ok=True)
    print(f"Promoted Prop Tool v{version}: two byte-verified installers in safe Git chunks.")

if __name__ == "__main__":
    main()
