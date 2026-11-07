#!/usr/bin/env python3
"""Publica uma versão do PT2VHF SDR Tool no site.

Uso: python3 scripts/publish_sdr_release.py X.Y.Z <pasta-do-artefato> "notas da versão"

- confere os dois .exe (assinatura MZ e SHA-256 do SHA256SUMS.txt gerado no GitHub Actions);
- grava cada pacote em partes < 100 MiB (limite do GitHub) + <nome>.parts.json, como Sat/QSL;
- remove partes de versões anteriores do SDR Tool;
- atualiza updates.json (produto "sdr": versão, data, notas e arquivos com tamanho e SHA-256).
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "downloads" / "sdr-tool"
MAX_PART = 48 * 1024 * 1024
KINDS = {
    "setup": dict(category="windows-installer", counterKey="win-setup-x64", kind="installer",
                  label="Windows — Instalador", detail="Windows 10/11 64 bits (recomendado)"),
    "portable": dict(category="windows-portable", counterKey="win-portable-x64", kind="portable",
                     label="Windows — Portátil", detail="Windows 10/11 64 bits, EXE único sem instalar"),
}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def main():
    if len(sys.argv) != 4 or not re.fullmatch(r"\d+\.\d+\.\d+", sys.argv[1]):
        raise SystemExit(__doc__)
    version, src, notes = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    sums = {}
    sums_file = src / "SHA256SUMS.txt"
    if sums_file.exists():
        for line in sums_file.read_text(encoding="utf-8-sig").splitlines():
            parts = line.split()
            if len(parts) >= 3:
                sums[parts[-1]] = parts[0].lower()
    DEST.mkdir(parents=True, exist_ok=True)
    for old in DEST.glob("PT2VHF-SDR-Tool-*"):
        if f"-{version}-" not in old.name:
            old.unlink()
    files = []
    for kind, meta in KINDS.items():
        name = f"PT2VHF-SDR-Tool-{version}-win-x64-{kind}.exe"
        original = src / name
        data = original.read_bytes()
        if data[:2] != b"MZ":
            raise SystemExit(f"{name}: não é um executável Windows")
        size, digest = len(data), hashlib.sha256(data).hexdigest()
        if name in sums and sums[name] != digest:
            raise SystemExit(f"{name}: SHA-256 diferente do gerado no CI")
        if not 20_000_000 <= size <= 700_000_000:
            raise SystemExit(f"{name}: tamanho inesperado ({size})")
        n = max(2, math.ceil(size / MAX_PART))
        chunk = math.ceil(size / n)
        pieces = []
        for i in range(n):
            block = data[i * chunk:(i + 1) * chunk]
            part = f"{name}.part{i:02d}"
            (DEST / part).write_bytes(block)
            pieces.append({"name": part, "size": len(block), "sha256": hashlib.sha256(block).hexdigest()})
        (DEST / f"{name}.parts.json").write_text(json.dumps(
            {"name": name, "size": size, "sha256": digest, "parts": pieces}, indent=2) + "\n", encoding="utf-8")
        files.append({**meta, "architecture": "x64", "platform": "windows-x64", "name": name,
                      "url": f"https://www.pt2vhf.com/downloads/sdr-tool/{name}", "size": size, "sha256": digest})
        print(f"{name}: {size} bytes, {n} partes, sha256={digest}")
    manifest_path = ROOT / "updates.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    today = dt.date.today().isoformat()
    entry = manifest["products"].get("sdr", {})
    entry.pop("developmentVersion", None)
    entry.update({"name": "PT2VHF SDR Tool", "version": version, "date": today,
                  "page": "https://www.pt2vhf.com/sdr", "notes": notes, "files": files,
                  "updateEndpoint": "https://www.pt2vhf.com/update.php?product=sdr"})
    manifest["products"]["sdr"] = entry
    manifest["updated"] = today
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
