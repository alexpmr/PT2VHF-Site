#!/usr/bin/env python3
"""Publica uma versão do PT2VHF APRS Client (desktop) a partir dos assets da GitHub Release.

Uso: python3 scripts/publish_aprs_release.py <versão> <pasta-com-os-assets> --date AAAA-MM-DD --notes "..." [--only windows]

Com --only windows (ex.: v2.0.2), só os binários Windows são da versão nova; os de Linux/macOS
continuam no manifesto com a versão anterior (campo `version` de cada arquivo) e não são apagados.

Confere assinatura, tamanho e SHA-256 de cada binário, copia para downloads/aprs-client/,
atualiza o produto `aprs` do updates.json (mesmos counterKey de sempre) e mantém só a versão
anterior além da nova na pasta de downloads. O push na main publica na Hostinger.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "downloads" / "aprs-client"
URL = "https://www.pt2vhf.com/downloads/aprs-client/"


def files_for(v: str):
    mac_arm = "Mac Apple Silicon (M1/M2/M3/M4 etc.), macOS 11 ou superior. Não funciona em Macs Intel."
    # Raspberry Pi (Linux ARM64) e Mac Intel saíram dos downloads em 22/11/2026.
    return [
        ("windows-installer", "win-setup-x64", "x64", "windows-x64", f"PT2VHF_APRS_Client_Setup_x64_v{v}.exe", "PT2VHF APRS Client x64"),
        ("windows-portable", "win-portable-x64", "x64", "windows-x64", f"PT2VHF_APRS_Client_Portable_x64_v{v}.exe", "PT2VHF APRS Client x64"),
        ("windows-installer", "win-setup-arm64", "ARM64", "windows-arm64", f"PT2VHF_APRS_Client_Setup_ARM64_v{v}.exe", "PT2VHF APRS Client ARM64"),
        ("windows-portable", "win-portable-arm64", "ARM64", "windows-arm64", f"PT2VHF_APRS_Client_Portable_ARM64_v{v}.exe", "PT2VHF APRS Client ARM64"),
        ("linux-appimage", "linux-appimage-x64", "x64", "linux-x64", f"PT2VHF_APRS_Client_x86_64_v{v}.AppImage", "PT2VHF APRS Client x64"),
        ("linux-deb", "linux-deb-x64", "x64", "linux-x64", f"pt2vhf-aprs-client_{v}_amd64.deb", "PT2VHF APRS Client x64"),
        ("linux-targz", "linux-tar-x64", "x64", "linux-x64", f"PT2VHF_APRS_Client_Linux_x86_64_v{v}.tar.gz", "PT2VHF APRS Client x64"),
        ("macos", "mac-dmg-arm64", "Apple Silicon", "macos-arm64", f"PT2VHF_APRS_Client_macOS_arm64_v{v}.dmg", mac_arm),
    ]


def signature_ok(name: str, header: bytes) -> bool:
    if name.endswith(".exe"):
        return header.startswith(b"MZ")
    if name.endswith(".AppImage"):
        return header.startswith(b"\x7fELF")
    if name.endswith(".deb"):
        return header.startswith(b"!<arch>\n")
    if name.endswith(".tar.gz"):
        return header.startswith(b"\x1f\x8b")
    return True  # .dmg não tem assinatura fixa no início


def inspect(path: Path):
    if not path.is_file() or path.is_symlink():
        raise ValueError(f"Arquivo ausente/inseguro: {path.name}")
    size = path.stat().st_size
    if size < 1_000_000 or size >= 100_000_000:
        raise ValueError(f"Tamanho inesperado: {path.name} ({size})")
    with path.open("rb") as fh:
        if not signature_ok(path.name, fh.read(8)):
            raise ValueError(f"Assinatura inválida: {path.name}")
        fh.seek(0)
        digest = hashlib.file_digest(fh, "sha256").hexdigest()
    return size, digest


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("version")
    ap.add_argument("src", type=Path)
    ap.add_argument("--date", required=True)
    ap.add_argument("--notes", required=True)
    ap.add_argument("--only", choices=["windows"], default=None)
    opts = ap.parse_args()
    ver = opts.version
    if not re.fullmatch(r"\d+\.\d+\.\d+", ver):
        raise ValueError("Versão inválida")

    manifest = ROOT / "updates.json"
    data = json.loads(manifest.read_text(encoding="utf-8"))
    entry = data["products"]["aprs"]
    previous = entry.get("version")

    old_files = {f.get("counterKey"): f for f in entry.get("files") or [] if isinstance(f, dict)}
    found = []
    kept = []  # (counterKey, meta) de plataformas que ficam na versão anterior
    for category, counter, arch, platform, name, detail in files_for(ver):
        if opts.only and not platform.startswith(opts.only):
            meta = old_files.get(counter)
            if not meta:
                raise ValueError(f"Sem arquivo anterior para manter: {counter}")
            target = DEST / meta["name"]
            if inspect(target) != (meta["size"], meta["sha256"]):
                raise ValueError(f"Arquivo anterior divergente: {meta['name']}")
            meta.setdefault("version", previous)
            kept.append((None, meta))
            continue
        matches = list(opts.src.resolve().rglob(name))
        if len(matches) != 1:
            raise ValueError(f"Binário não único ou ausente: {name}")
        size, digest = inspect(matches[0])
        found.append((matches[0], dict(category=category, counterKey=counter, architecture=arch, platform=platform,
                                       name=name, url=URL + name, size=size, sha256=digest, detail=detail, version=ver)))

    DEST.mkdir(parents=True, exist_ok=True)
    for path, meta in found:
        target = DEST / meta["name"]
        tmp = target.with_suffix(target.suffix + ".tmp")
        try:
            shutil.copyfile(path, tmp)
            os.replace(tmp, target)
        finally:
            tmp.unlink(missing_ok=True)
        if inspect(target) != (meta["size"], meta["sha256"]):
            raise ValueError(f"Cópia divergente: {target.name}")

    # Mantém só a versão anterior além da nova (e as versões dos arquivos mantidos).
    keep = {ver, previous} | {meta.get("version") for _, meta in kept}
    removed = []
    for item in DEST.iterdir():
        m = re.search(r"(?:_v|_)(\d+\.\d+\.\d+)(?:_amd64|_arm64)?\.(?:exe|AppImage|deb|tar\.gz|dmg)$", item.name)
        if m and m.group(1) not in keep:
            item.unlink()
            removed.append(item.name)

    order = [counter for _, counter, *_ in files_for(ver)]
    metas = sorted([meta for _, meta in found + kept], key=lambda m: order.index(m["counterKey"]))
    entry.update(version=ver, developmentVersion=ver, date=opts.date,
                 releaseStatus="Instaladores oficiais validados e hospedados em pt2vhf.com",
                 notes=opts.notes, files=metas)
    entry["plannedFiles"] = [{k: meta[k] for k in ("category", "counterKey", "architecture", "name")} for meta in metas]
    data["updated"] = opts.date
    tmp = manifest.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, manifest)
    print(f"PUBLICACAO_APRS={ver}; binários={len(found)}; mantidos={len(kept)}; anterior={previous}; removidos={len(removed)}")
    for name in removed:
        print("  removido:", name)


if __name__ == "__main__":
    main()
