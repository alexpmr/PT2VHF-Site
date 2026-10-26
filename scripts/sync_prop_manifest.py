#!/usr/bin/env python3
"""Promote verified PT2VHF Prop Tool Windows packages to the official site's OTA catalog."""
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

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    version = args.version
    if re.fullmatch(r"\d+\.\d+\.\d+", version) is None:
        parser.error("Version must match X.Y.Z")
    manifest = json.loads(CATALOG.read_text(encoding="utf-8"))
    if manifest.get("schema") != 1:
        raise SystemExit("Invalid catalog schema")
    prop = manifest["products"]["prop"]
    previous = prop.get("version")
    if previous and tuple(map(int, previous.split("."))) > tuple(map(int, version.split("."))):
        raise SystemExit(f"Refusing downgrade from {previous} to {version}")

    entries = []
    root = DIRECTORY.resolve(strict=True)
    for category, kind, suffix in (
        ("windows-installer", "installer", "setup"),
        ("windows-portable", "portable", "portable"),
    ):
        name = f"PT2VHF-Prop-Tool-{version}-x64-{suffix}.exe"
        target = DIRECTORY / name
        if target.is_symlink() or target.resolve(strict=True).parent != root:
            raise SystemExit(f"Unsafe package path: {name}")
        size = target.stat().st_size
        if not 50_000_000 <= size <= 700_000_000:
            raise SystemExit(f"Invalid package size: {name}")
        digest = hashlib.sha256()
        with target.open("rb") as fp:
            if fp.read(2) != b"MZ":
                raise SystemExit(f"Not a PE executable: {name}")
            fp.seek(0)
            for piece in iter(lambda: fp.read(1024 * 1024), b""):
                digest.update(piece)
        entries.append({
            "category": category,
            "counterKey": "win-setup-x64" if kind == "installer" else "win-portable-x64",
            "kind": kind,
            "architecture": "x64",
            "platform": "windows-x64",
            "name": name,
            "url": f"{SITE}/downloads/prop-tool/{name}",
            "size": size,
            "sha256": digest.hexdigest(),
            "detail": "Windows 10/11 x64",
        })
    prop.update({
        "version": version,
        "developmentVersion": version,
        "date": date.today().isoformat(),
        "notes": "Atualizador OTA migrado para pt2vhf.com; instalador e portatil Windows verificados.",
        "files": entries,
        "releaseStatus": "Pacotes Windows verificados e publicados no site oficial.",
        "updateEndpoint": f"{SITE}/update.php?product=prop&platform=windows-x64",
    })
    manifest["updated"] = date.today().isoformat()
    if not args.apply:
        print(json.dumps(entries, ensure_ascii=False, indent=2))
        print("Dry run: no release was published.")
        return
    temp = CATALOG.with_name("updates.json.tmp")
    try:
        temp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temp, CATALOG)
    finally:
        temp.unlink(missing_ok=True)
    print(f"Promoted Prop Tool v{version}: setup + portable, SHA-256 verified.")

if __name__ == "__main__":
    main()
