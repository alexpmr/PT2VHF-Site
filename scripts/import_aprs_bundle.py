#!/usr/bin/env python3
"""Importa o pacote CI do APRS para o repositório pt2vhf-site.

Uso:
    python scripts/import_aprs_bundle.py caminho/PT2VHF-APRS-1.14.59-Hostinger.zip

Este script NÃO faz upload diretamente: os cinco binários entram no Git da
pasta downloads/aprs-client, e o git push para a main aciona a Hostinger.
Preserva os outros produtos do updates.json e valida todos os hashes.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile
import zipfile
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "updates.json"
DOWNLOADS = ROOT / "downloads" / "aprs-client"
PREFIX = "downloads/aprs-client/"
OFFICIAL_URL = "https://www.pt2vhf.com/downloads/aprs-client/"
EXPECTED_CATEGORIES = {
    "win-setup-x64", "win-portable-x64", "linux-appimage-x64",
    "linux-deb-x64", "linux-tar-x64",
}
EXPECTED_NAMES = {
    "PT2VHF_APRS_Client_Setup_x64_v1.14.59.exe",
    "PT2VHF_APRS_Client_Portable_x64_v1.14.59.exe",
    "PT2VHF_APRS_Client_x86_64_v1.14.59.AppImage",
    "pt2vhf-aprs-client_1.14.59_amd64.deb",
    "PT2VHF_APRS_Client_Linux_x86_64_v1.14.59.tar.gz",
}

def _check_signature(name: str, beginning: bytes) -> None:
    required = (b"MZ" if name.endswith(".exe")
                else b"\x7fELF" if name.endswith(".AppImage")
                else b"!<arch>\n" if name.endswith(".deb")
                else b"\x1f\x8b" if name.endswith(".tar.gz") else None)
    if required is None or not beginning.startswith(required):
        raise ValueError(f"Cabeçalho de binário incorreto: {name}")

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("zip", type=Path, help="ZIP interno disponibilizado pelo job package_for_hostinger_11459")
    args = ap.parse_args()
    if not args.zip.is_file():
        ap.error(f"Arquivo não localizado: {args.zip}")

    with zipfile.ZipFile(args.zip) as z:
        names = set(z.namelist())
        if "updates.json" not in names:
            raise ValueError("ZIP sem updates.json")
        packaged = json.loads(z.read("updates.json"))
        entry = packaged["products"]["aprs"]
        files = entry["files"]
        if entry["version"] != "1.14.59" or len(files) != 5:
            raise ValueError("O pacote não contém os cinco binários da v1.14.59")
        if {f["name"] for f in files} != EXPECTED_NAMES:
            raise ValueError("Nomes dos instaladores inesperados")
        if {f["counterKey"] for f in files} != EXPECTED_CATEGORIES:
            raise ValueError("Categorias/contadores inesperados")
        if any(f["category"] in ("source", "checksums") for f in files):
            raise ValueError("Downloads públicos não podem incluir fonte ou checksum")
        if names != {"updates.json"} | {PREFIX + f["name"] for f in files} | {n for n in names if n.endswith("/")}:
            raise ValueError("Arquivos extras no pacote de publicação")

        current = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        if packaged["schema"] != current["schema"] or current["schema"] != 1:
            raise ValueError("Schema do manifesto incompatível")
        with tempfile.TemporaryDirectory() as tempdir:
            tmp = Path(tempdir)
            for f in files:
                filename = f["name"]
                if not re.fullmatch(r"[A-Za-z0-9_.-]+", filename):
                    raise ValueError("Nome inválido")
                if f["url"] != OFFICIAL_URL + filename:
                    raise ValueError(f"URL incorreta: {filename}")
                digest = hashlib.sha256()
                target = tmp / filename
                size = 0
                with z.open(PREFIX + filename) as source, target.open("wb") as dest:
                    first = source.read(16)
                    _check_signature(filename, first)
                    digest.update(first)
                    size += len(first)
                    dest.write(first)
                    while chunk := source.read(1048576):
                        digest.update(chunk)
                        size += len(chunk)
                        if size >= 100_000_000:
                            raise ValueError(f"Binário muito grande para Git normal: {filename}")
                        dest.write(chunk)
                if size != f["size"] or digest.hexdigest() != f["sha256"]:
                    raise ValueError(f"Tamanho ou SHA-256 divergente: {filename}")

            DOWNLOADS.mkdir(parents=True, exist_ok=True)
            for f in files:
                filename = f["name"]
                os.replace(tmp / filename, DOWNLOADS / filename)

        current["products"]["aprs"] = entry
        current["updated"] = date.today().isoformat()
        MANIFEST_PATH.write_text(
            json.dumps(current, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print("Importação validada: v1.14.59, cinco binários, checksums internos OK.")
    print("Revise, faça commit e push para pt2vhf-site/main:")
    print("git add updates.json downloads/aprs-client")
    print('git commit -m "release(aprs): publicar instaladores v1.14.59"')
    print("git push origin main")

if __name__ == "__main__":
    main()
