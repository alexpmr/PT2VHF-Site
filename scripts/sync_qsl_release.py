#!/usr/bin/env python3
"""Publica uma release do PT2VHF QSL Analyzer no site oficial.

Lê os pacotes baixados da release do GitHub (origem gerada pelo Actions), confere o SHA256SUMS.txt,
divide cada pacote em partes < 100 MiB em downloads/qsl-analyzer/ (remontadas pelo download.php)
e atualiza o produto "qsl" do updates.json com versão, tamanho e SHA-256.

Uso: python3 scripts/sync_qsl_release.py --version 0.2.0 --source /caminho/dos/pacotes [--platforms windows,linux,macos] [--apply]

Só as plataformas indicadas são publicadas; pacotes antigos de outras plataformas são removidos, porque o
updates.json tem uma única versão por produto (evita anunciar versão nova com arquivos de versão antiga).
"""
from __future__ import annotations
import argparse
import hashlib
import json
import math
import os
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.pt2vhf.com"
DIRECTORY = ROOT / "downloads" / "qsl-analyzer"
CATALOG = ROOT / "updates.json"
CHUNK = 48 * 1024 * 1024

def packages(version: str) -> list[dict]:
    v = version
    return [
        {"file": f"PT2VHF-QSL-Analyzer-{v}-win-x64-setup.exe", "category": "windows-installer", "counterKey": "win-setup-x64",
         "kind": "installer", "platform": "windows-x64", "architecture": "x64", "label": "Windows — Instalador",
         "detail": "Windows 10/11 64 bits (recomendado)", "magic": b"MZ"},
        {"file": f"PT2VHF-QSL-Analyzer-{v}-win-x64-portable.exe", "category": "windows-portable", "counterKey": "win-portable-x64",
         "kind": "portable", "platform": "windows-x64", "architecture": "x64", "label": "Windows — Portátil",
         "detail": "Windows 10/11 64 bits, sem instalação", "magic": b"MZ"},
        {"file": f"pt2vhf-qsl-analyzer_{v}_amd64.deb", "category": "linux-deb", "counterKey": "linux-deb-x64",
         "kind": "deb", "platform": "linux-x64", "architecture": "x64", "label": "Linux — .deb (Debian/Ubuntu)",
         "detail": "Ubuntu 22.04+, Debian 12+, Mint 21+", "magic": b"!<arch>"},
        {"file": f"PT2VHF-QSL-Analyzer-{v}-linux-x86_64.AppImage", "category": "linux-appimage", "counterKey": "linux-appimage-x64",
         "kind": "appimage", "platform": "linux-x64", "architecture": "x64", "label": "Linux — AppImage",
         "detail": "Qualquer distribuição x64 (torne executável e abra)", "magic": b"\x7fELF"},
        {"file": f"PT2VHF-QSL-Analyzer-{v}-linux-x64.tar.gz", "category": "linux-targz", "counterKey": "linux-tar-x64",
         "kind": "tar.gz", "platform": "linux-x64", "architecture": "x64", "label": "Linux — .tar.gz",
         "detail": "Outras distribuições x64", "magic": b"\x1f\x8b"},
        {"file": f"PT2VHF-QSL-Analyzer-{v}-mac-arm64.dmg", "category": "macos", "counterKey": "mac-dmg-arm64",
         "kind": "dmg", "platform": "macos-arm64", "architecture": "arm64", "label": "macOS",
         "detail": "Apple Silicon (M1 ou mais novo), macOS 12+", "magic": None},
        {"file": f"PT2VHF-QSL-Analyzer-{v}-mac-x64.dmg", "category": "macos", "counterKey": "mac-dmg-x64",
         "kind": "dmg", "platform": "macos-x64", "architecture": "x64", "label": "macOS",
         "detail": "Mac com processador Intel, macOS 12+", "magic": None},
    ]

def read_sums(source: Path) -> dict[str, str]:
    sums = {}
    for line in (source / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines():
        m = re.fullmatch(r"([a-f0-9]{64})\s+\*?(\S+)", line.strip())
        if m:
            sums[m.group(2)] = m.group(1)
    return sums

def segment(src: Path, name: str, expected: str) -> tuple[int, str]:
    size = src.stat().st_size
    parts = max(2, math.ceil(size / CHUNK))
    if parts > 16:
        raise SystemExit(f"Pacote grande demais: {name}")
    chunk = math.ceil(size / parts)
    digest, pieces = hashlib.sha256(), []
    with src.open("rb") as handle:
        for index in range(parts):
            block = handle.read(chunk)
            if not block or len(block) >= 100 * 1024 * 1024:
                raise SystemExit(f"Parte inválida em {name}")
            part = f"{name}.part{index:02d}"
            (DIRECTORY / part).write_bytes(block)
            digest.update(block)
            pieces.append({"name": part, "size": len(block), "sha256": hashlib.sha256(block).hexdigest()})
        if handle.read(1):
            raise SystemExit(f"Sobrou conteúdo ao dividir {name}")
    sha = digest.hexdigest()
    if sha != expected:
        raise SystemExit(f"SHA-256 divergente de SHA256SUMS.txt: {name}")
    meta = {"name": name, "size": size, "sha256": sha, "parts": pieces}
    (DIRECTORY / f"{name}.parts.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    return size, sha

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--version", required=True)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--notes", default="")
    parser.add_argument("--platforms", default="windows,linux,macos")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    if re.fullmatch(r"\d+\.\d+\.\d+", args.version) is None:
        parser.error("Versão deve ser X.Y.Z")
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    previous = (catalog["products"].get("qsl") or {}).get("version")
    if previous and tuple(map(int, previous.split("."))) > tuple(map(int, args.version.split("."))):
        raise SystemExit(f"Recusando rebaixar de {previous} para {args.version}")
    sums = read_sums(args.source)
    wanted = {p.strip() for p in args.platforms.split(",") if p.strip()}
    items = [i for i in packages(args.version) if i["platform"].split("-")[0] in wanted]
    if not items:
        parser.error("Nenhuma plataforma selecionada")
    for item in items:
        src = args.source / item["file"]
        if not src.is_file() or item["file"] not in sums:
            raise SystemExit(f"Pacote ausente na release: {item['file']}")
        if src.stat().st_size < 20_000_000:
            raise SystemExit(f"Pacote pequeno demais: {item['file']}")
        if item["magic"] and src.open("rb").read(len(item["magic"])) != item["magic"]:
            raise SystemExit(f"Assinatura de arquivo inesperada: {item['file']}")
    if not args.apply:
        print("\n".join(f"{i['file']}  {sums[i['file']]}" for i in items))
        return
    DIRECTORY.mkdir(parents=True, exist_ok=True)
    for old in DIRECTORY.iterdir():
        if old.is_file():
            old.unlink()
    entries = []
    for item in items:
        size, sha = segment(args.source / item["file"], item["file"], sums[item["file"]])
        entries.append({
            "category": item["category"], "counterKey": item["counterKey"], "kind": item["kind"],
            "architecture": item["architecture"], "platform": item["platform"], "label": item["label"],
            "name": item["file"], "url": f"{SITE}/downloads/qsl-analyzer/{item['file']}",
            "size": size, "sha256": sha, "detail": item["detail"],
        })
    today = date.today().isoformat()
    catalog["products"]["qsl"] = {
        "name": "PT2VHF QSL Analyzer",
        "version": args.version,
        "date": today,
        "page": f"{SITE}/qsl",
        "notes": args.notes,
        "files": entries,
        "updateEndpoint": f"{SITE}/update.php?product=qsl",
    }
    catalog["updated"] = today
    temp = CATALOG.with_name("updates.json.tmp")
    try:
        temp.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temp, CATALOG)
    finally:
        temp.unlink(missing_ok=True)
    print(f"QSL Analyzer v{args.version} publicado: {len(entries)} pacotes em partes verificadas.")

if __name__ == "__main__":
    main()
