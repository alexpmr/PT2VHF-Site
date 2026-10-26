#!/usr/bin/env python3
"""Split verified Prop Tool release .exe artifacts into safe Git-sized pieces."""
from __future__ import annotations
import hashlib
import json
import re
import sys
from pathlib import Path

def main():
    if len(sys.argv) != 2 or re.fullmatch(r"\d+\.\d+\.\d+", sys.argv[1]) is None:
        raise SystemExit("Usage: python3 scripts/segment_prop_packages.py X.Y.Z")
    version = sys.argv[1]
    destination = Path("downloads/prop-tool")
    directory = destination.resolve(strict=True)
    chunk_size = 48 * 1024 * 1024
    for package_kind in ("setup", "portable"):
        name = f"PT2VHF-Prop-Tool-{version}-x64-{package_kind}.exe"
        original = destination / name
        if original.is_symlink() or original.resolve(strict=True).parent != directory:
            raise SystemExit(f"Unsafe input {name}")
        size = original.stat().st_size
        if size < 50_000_000 or size > 700_000_000:
            raise SystemExit(f"Invalid Windows package size: {name}")
        pieces = []
        hasher = hashlib.sha256()
        try:
            with original.open("rb") as source:
                if source.read(2) != b"MZ":
                    raise SystemExit(f"Invalid executable signature: {name}")
                source.seek(0)
                index = 0
                for block in iter(lambda: source.read(chunk_size), b""):
                    part_name = f"{name}.part{index:02d}"
                    target = directory / part_name
                    target.write_bytes(block)
                    piece_hash = hashlib.sha256(block).hexdigest()
                    pieces.append({"name": part_name, "size": len(block), "sha256": piece_hash})
                    hasher.update(block)
                    index += 1
            if not 2 <= len(pieces) <= 16:
                raise SystemExit(f"Invalid number of parts: {name}")
            meta = {"name": name, "size": size, "sha256": hasher.hexdigest(), "parts": pieces}
            (directory / f"{name}.parts.json").write_text(
                json.dumps(meta, indent=2) + "\n", encoding="utf-8"
            )
        finally:
            pass
        original.unlink()
        print(f"Segmented {name}: {size} bytes across {len(pieces)} parts, sha256={hasher.hexdigest()}")

if __name__ == "__main__":
    main()
