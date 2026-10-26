#!/usr/bin/env python3
"""Importa capturas ORIGINAIS PNG do Mesh Analyzer para o site.

Uso: python scripts/import_mesh_originals.py PT2VHF-Mesh-Analyzer-0658-screenshots-originais.zip
Verifica nomes, dimensões e cabeçalhos PNG. Nenhuma recompressão ou resize.
Depois, git add assets/screenshots/mesh/original e git push origin main.
"""
import argparse
import os
import struct
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "assets/screenshots/mesh/original/"
DEST = ROOT / BASE
FILES = (
    "map-v0658.png",
    "messages-v0658.png",
    "nodes-v0658.png",
    "connections-v0658.png",
    "rf-ranking-v0658.png",
    "chat-v0658.png",
)
PNG = b"\x89PNG\r\n\x1a\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip_file", type=Path)
    args = parser.parse_args()
    if not args.zip_file.is_file():
        parser.error("O ZIP com os originais não foi encontrado")
    DEST.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.zip_file) as source:
        found = set(source.namelist())
        expected = {BASE + f for f in FILES}
        if found != expected:
            raise ValueError("O ZIP deve conter exatamente as seis capturas originais: "
                             + str(sorted(expected.symmetric_difference(found))))
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            staged = []
            for filename in FILES:
                raw = source.read(BASE + filename)
                if len(raw) < 1024 or len(raw) > 9_000_000:
                    raise ValueError("Arquivo inválido: " + filename)
                if raw[:8] != PNG or raw[12:16] != b"IHDR":
                    raise ValueError("Assinatura PNG inválida: " + filename)
                w, h = struct.unpack(">II", raw[16:24])
                if w < 1000 or h < 500:
                    raise ValueError("Arquivo não tem resolução original: " + filename)
                target = Path(tmp) / filename
                target.write_bytes(raw)
                staged.append((target, DEST / filename))
                print(f"OK: {filename} — {w}x{h}, {len(raw):,} bytes")
            for src, target in staged:
                os.replace(src, target)
    print("Pronto: 6 PNGs originais, sem perda de qualidade.")
    print("Execute: git add assets/screenshots/mesh/original && git commit -m 'assets(mesh): screenshots PNG originais' && git push origin main")


if __name__ == "__main__":
    main()
