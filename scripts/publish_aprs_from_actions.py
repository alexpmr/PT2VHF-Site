#!/usr/bin/env python3
"""Publish the verified APRS desktop release from GitHub Actions, never GitLab."""
import argparse, hashlib, json, os, shutil
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VER="1.15.5"
FILES=[
("windows-installer","win-setup-x64","x64","windows-x64",f"PT2VHF_APRS_Client_Setup_x64_v{VER}.exe"),
("windows-portable","win-portable-x64","x64","windows-x64",f"PT2VHF_APRS_Client_Portable_x64_v{VER}.exe"),
("windows-installer","win-setup-arm64","ARM64","windows-arm64",f"PT2VHF_APRS_Client_Setup_ARM64_v{VER}.exe"),
("windows-portable","win-portable-arm64","ARM64","windows-arm64",f"PT2VHF_APRS_Client_Portable_ARM64_v{VER}.exe"),
("linux-appimage","linux-appimage-x64","x64","linux-x64",f"PT2VHF_APRS_Client_x86_64_v{VER}.AppImage"),
("linux-deb","linux-deb-x64","x64","linux-x64",f"pt2vhf-aprs-client_{VER}_amd64.deb"),
("linux-targz","linux-tar-x64","x64","linux-x64",f"PT2VHF_APRS_Client_Linux_x86_64_v{VER}.tar.gz"),
("macos","mac-dmg-x64","Intel","macos-x64",f"PT2VHF_APRS_Client_macOS_x86_64_v{VER}.dmg"),
("macos","mac-dmg-arm64","Apple Silicon","macos-arm64",f"PT2VHF_APRS_Client_macOS_arm64_v{VER}.dmg"),
]
def signature_ok(name,header):
    return (header.startswith(b"MZ") if name.endswith(".exe") else
            header.startswith(b"\x7fELF") if name.endswith(".AppImage") else
            header.startswith(b"!<arch>\n") if name.endswith(".deb") else
            header.startswith(b"\x1f\x8b") if name.endswith(".tar.gz") else True)
def inspect(p):
    if not p.is_file() or p.is_symlink(): raise ValueError(f"Arquivo ausente/inseguro: {p.name}")
    n=p.stat().st_size
    if n<1_000_000 or n>=100_000_000: raise ValueError(f"Tamanho inesperado: {p.name} ({n})")
    with p.open("rb") as f:
        if not signature_ok(p.name,f.read(8)): raise ValueError(f"Assinatura inválida: {p.name}")
        f.seek(0)
        sha=hashlib.file_digest(f,"sha256").hexdigest()
    return n,sha
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("src",type=Path)
    opts=ap.parse_args()
    source=opts.src.resolve()
    manifest_path=ROOT/"updates.json"
    data=json.loads(manifest_path.read_text(encoding="utf-8"))
    if data.get("schema")!=1 or "aprs" not in data.get("products",{}):
        raise ValueError("Manifesto do site incompatível")
    if data["products"]["aprs"].get("version")==VER:
        print("Versão já publicada, não alterar.")
        return
    found=[]
    for category,counter,arch,platform,name in FILES:
        paths=list(source.rglob(name))
        if len(paths)!=1: raise ValueError(f"Binário não único ou ausente: {name}")
        path=paths[0]
        size,digest=inspect(path)
        found.append((path,dict(category=category,counterKey=counter,architecture=arch,
            platform=platform,name=name,url="https://www.pt2vhf.com/downloads/aprs-client/"+name,
            size=size,sha256=digest,detail="PT2VHF APRS Client "+arch,version=VER)))
    dest=ROOT/"downloads/aprs-client"
    dest.mkdir(parents=True,exist_ok=True)
    for path,meta in found:
        target=dest/meta["name"]
        if target.exists():
            if inspect(target)!=(meta["size"],meta["sha256"]): raise ValueError(f"Conflito: {target.name}")
            continue
        tmp=target.with_suffix(target.suffix+".tmp")
        try:
            with path.open("rb") as f, tmp.open("wb") as g: shutil.copyfileobj(f,g,1024*1024)
            os.replace(tmp,target)
        finally: tmp.unlink(missing_ok=True)
    entry=data["products"]["aprs"]
    entry.update(version=VER,developmentVersion=VER,date="2026-10-31",
        releaseStatus="Instaladores oficiais validados e hospedados em pt2vhf.com",
        notes="Cobertura RF direta sem digipeater, trajetos RF observados e recuperação de histórico sem contagem duplicada.",
        files=[meta for _,meta in found])
    entry["plannedFiles"]=[{k:meta[k] for k in ("category","counterKey","architecture","name")} for _,meta in found]
    data["updated"]="2026-10-31"
    temp=manifest_path.with_suffix(".json.tmp")
    temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    os.replace(temp,manifest_path)
    print(f"PUBLICACAO_GITHUB_APRS={VER}; binários={len(found)}")
if __name__=="__main__": main()
