#!/usr/bin/env python3
"""Publish the verified APRS desktop release from GitHub Actions, never GitLab."""
import argparse, hashlib, json, os, shutil, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VER="1.15.6"
CHANGELOG = {
    "pt": ("Tradução dinâmica e bandeiras", "Textos dinâmicos, bandeiras e persistência de idioma testados em seis idiomas; dez idiomas preservados.", "A revisão integral das traduções (#157) continua aberta."),
    "en": ("Live translations and flags", "Dynamic text, flags and saved language tested in six languages; all ten languages retained.", "The full translation review (#157) remains open."),
    "es": ("Traducción dinámica y banderas", "Textos dinámicos, banderas e idioma guardado probados en seis idiomas; diez idiomas conservados.", "La revisión completa de las traducciones (#157) sigue abierta."),
    "fr": ("Traduction dynamique et drapeaux", "Textes dynamiques, drapeaux et langue enregistrée testés dans six langues ; dix langues conservées.", "La révision complète des traductions (#157) reste ouverte."),
    "de": ("Dynamische Übersetzungen und Flaggen", "Dynamische Texte, Flaggen und gespeicherte Sprache in sechs Sprachen getestet; alle zehn Sprachen bleiben erhalten.", "Die vollständige Überprüfung der Übersetzungen (#157) bleibt offen."),
    "it": ("Traduzione dinamica e bandiere", "Testi dinamici, bandiere e lingua salvata verificati in sei lingue; dieci lingue mantenute.", "La revisione completa delle traduzioni (#157) rimane aperta."),
    "zh": ("动态翻译和国旗", "已在六种语言中测试动态文本、国旗和语言保存；保留全部十种语言。", "完整翻译审查（#157）仍未完成。"),
}

def patch_changelog(text):
    start=text.index("    aprs: {", text.index("  var LOG ="))
    end=text.index('    "aprs-android": {', start)
    block=text[start:end]
    for locale,(title,first,second) in CHANGELOG.items():
        marker=f"      {locale}: [\n"
        assert marker in block, f"Changelog locale missing: {locale}"
        locale_start=block.index(marker)+len(marker)
        if block[locale_start:].lstrip().startswith('e("1.15.6"'):
            continue
        entry='        e('+json.dumps(VER)+', '+json.dumps(title,ensure_ascii=False)+', '+json.dumps([first,second],ensure_ascii=False)+'),\n'
        block=block[:locale_start]+entry+block[locale_start:]
    return text[:start]+block+text[end:]
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
        if p.name.endswith(".dmg"):
            f.seek(-512, 2)
            if f.read(4) != b"koly": raise ValueError(f"Trailer DMG inválido: {p.name}")
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
        notes="Tradução dinâmica, bandeiras corretas, 30 textos revisados e regressão de interface em seis idiomas. Revisão integral de traduções (#157) continua aberta.",
        files=[meta for _,meta in found])
    entry["plannedFiles"]=[{k:meta[k] for k in ("category","counterKey","architecture","name")} for _,meta in found]
    data["updated"]="2026-10-31"
    temp=manifest_path.with_suffix(".json.tmp")
    temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    os.replace(temp,manifest_path)
    changelog=ROOT/"assets/js/changelog-data.js"
    changelog.write_text(patch_changelog(changelog.read_text(encoding="utf-8")),encoding="utf-8")
    page=ROOT/"aprs.html"
    page.write_text(re.sub(r'changelog-data\.js\?v=[^"\s]+', 'changelog-data.js?v=aprs1156', page.read_text(encoding="utf-8")),encoding="utf-8")
    print(f"PUBLICACAO_GITHUB_APRS={VER}; binários={len(found)}")
if __name__=="__main__": main()
