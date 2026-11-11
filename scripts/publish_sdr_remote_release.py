#!/usr/bin/env python3
"""Publish SDR metadata from a verified GitHub Release, without large Git binaries.

Usage: python3 scripts/publish_sdr_remote_release.py VERSION release.json SHA256SUMS.txt NOTES

The site serves the official download.php endpoint and redirects only to the
matching, pinned PT2VHF-SDR-Tool GitHub release. The client independently
verifies size and SHA-256 before installing.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "updates.json"
HOST = "https://www.pt2vhf.com"
KINDS = {
    "Setup": {
        "category": "windows-installer", "counterKey": "win-setup-x64",
        "kind": "installer", "label": "Windows — Instalador",
        "detail": "Windows 10/11 x64; instalação por usuário",
    },
    "Portable": {
        "category": "windows-portable", "counterKey": "win-portable-x64",
        "kind": "portable", "label": "Windows — Portátil",
        "detail": "Windows 10/11 x64; executável portátil",
    },
}


def parse_sums(raw: bytes) -> dict[str, tuple[str, int]]:
    result = {}
    for line in raw.decode("utf-8-sig").splitlines():
        words = line.split()
        if len(words) != 3 or not re.fullmatch(r"[a-fA-F0-9]{64}", words[0]):
            raise ValueError(f"Formato SHA256SUMS inválido: {line[:120]!r}")
        digest, size, name = words
        if not size.isdecimal() or int(size) <= 0 or name in result:
            raise ValueError(f"Tamanho duplicado ou inválido: {name}")
        result[name] = (digest.lower(), int(size))
    if not result:
        raise ValueError("SHA256SUMS vazio")
    return result


def main():
    if len(sys.argv) != 5:
        raise SystemExit(__doc__)
    version, release_path, sums_path, notes = sys.argv[1:]
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise SystemExit("Versão inválida")
    release = json.loads(Path(release_path).read_text(encoding="utf-8"))
    if release.get("tag_name") != "v" + version or release.get("draft") or release.get("prerelease"):
        raise SystemExit("Release inexistente, draft, prerelease ou versão divergente")
    assets = {a["name"]: a for a in release.get("assets", [])}
    sums_raw = Path(sums_path).read_bytes()
    sums = parse_sums(sums_raw)
    checksums_asset = assets.get("SHA256SUMS.txt")
    if not checksums_asset or checksums_asset.get("digest") != "sha256:" + hashlib.sha256(sums_raw).hexdigest():
        raise SystemExit("SHA256SUMS.txt não confere com o digest do GitHub")
    files = []
    for flavor, meta in KINDS.items():
        name = f"PT2VHF-SDR-Tool-v{version}-Win11-x64-{flavor}.exe"
        if name not in sums or name not in assets:
            raise SystemExit(f"Asset obrigatório ausente: {name}")
        digest, size = sums[name]
        asset = assets[name]
        if not 20_000_000 <= size <= 700_000_000:
            raise SystemExit(f"Tamanho suspeito para {name}: {size}")
        if asset.get("size") != size or asset.get("digest") != "sha256:" + digest:
            raise SystemExit(f"Hash/tamanho divergente da Release para {name}")
        if asset.get("state") != "uploaded":
            raise SystemExit(f"Asset não disponível: {name}")
        files.append({
            **meta, "architecture": "x64", "platform": "windows-x64",
            "name": name,
            "url": f"{HOST}/downloads/sdr-tool/{name}",
            "size": size, "sha256": digest, "delivery": "github-release",
        })
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if manifest.get("schema") != 1 or "sdr" not in manifest.get("products", {}):
        raise SystemExit("Contrato updates.json inválido")
    today = dt.datetime.now(dt.timezone.utc).date().isoformat()
    entry = manifest["products"]["sdr"]
    entry.pop("developmentVersion", None)
    entry.update({
        "name": "PT2VHF SDR Tool", "version": version, "date": today,
        "page": f"{HOST}/sdr", "notes": notes, "files": files,
        "updateEndpoint": f"{HOST}/update.php?product=sdr",
        "releaseStatus": "Build Windows e hashes verificados na origem GitHub Release; distribuição via site oficial.",
    })
    manifest["updated"] = today
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for item in files:
        print(f"SDR_SITE_MANIFEST_OK={item['name']} bytes={item['size']} sha256={item['sha256']}")


if __name__ == "__main__":
    main()
