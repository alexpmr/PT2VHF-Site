#!/usr/bin/env python3
"""Publica exclusivamente um DMG Legacy real, testado em macOS Catalina nativo.

Uso (no checkout do site):
 python3 scripts/publish_aprs_macos_legacy.py --dmg /path/file.dmg --evidence /path/catalina-verification.json
Executar apenas após job GitHub Actions em runner real Catalina. Não altera versão
global, nem apaga instaladores existentes, nem reinicia contadores acumulativos.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/"downloads"/"aprs-client"
MANIFEST=ROOT/"updates.json"
BASE="https://www.pt2vhf.com/downloads/aprs-client/"
COUNTER="mac-dmg-intel-legacy"

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--dmg",type=Path,required=True)
    parser.add_argument("--evidence",type=Path,required=True)
    args=parser.parse_args()
    data=json.loads(MANIFEST.read_text(encoding="utf-8"))
    evidence=json.loads(args.evidence.read_text(encoding="utf-8"))
    product=data["products"]["aprs"]
    version=product["version"]
    name=f"PT2VHF_APRS_Client_macOS_Intel_Legacy_v{version}.dmg"
    if args.dmg.name!=name or evidence.get("filename")!=name or evidence.get("version")!=version:
        raise SystemExit("Versão/arquivo divergente; não publicar")
    if evidence.get("source")!="native-catalina-self-hosted" or evidence.get("architecture")!="x86_64" or not str(evidence.get("build_os","")).startswith("10.15.") or evidence.get("gui_smoke")!="passed" or evidence.get("bundle_min_os")!="10.15.0":
        raise SystemExit("Sem evidência válida de compilação e abertura em Catalina real; não publicar")
    if not args.dmg.is_file() or args.dmg.is_symlink():
        raise SystemExit("DMG ausente ou simbólico")
    size=args.dmg.stat().st_size
    if not 1_000_000 < size < 100_000_000 or size!=evidence.get("size"):
        raise SystemExit("Tamanho do DMG inesperado")
    with args.dmg.open("rb") as f:
        sha=hashlib.file_digest(f,"sha256").hexdigest()
        f.seek(-512,os.SEEK_END)
        if f.read(4)!=b"koly":
            raise SystemExit("DMG sem trailer UDIF")
    if sha!=evidence.get("sha256"):
        raise SystemExit("SHA-256 do DMG não confere")
    for entry in product["files"]:
        if entry.get("counterKey")==COUNTER and entry.get("name")!=name:
            raise SystemExit("Outra versão Legacy presente; revisão manual obrigatória")
    entry=dict(category="macos",counterKey=COUNTER,architecture="Intel Legacy",
        platform="macos-x64-legacy",name=name,url=BASE+name,
        size=size,sha256=sha,version=version,
        detail="Mac Intel — macOS Catalina 10.15.x (build e abertura testados)")
    # Materializa o arquivo antes de anunciar no manifesto.
    DEST.mkdir(parents=True,exist_ok=True)
    target=DEST/name
    if target.exists():
        with target.open("rb") as f:
            if hashlib.file_digest(f,"sha256").hexdigest()!=sha:
                raise SystemExit("DMG já publicado possui SHA-256 diferente")
    else:
        tmp=target.with_suffix(".dmg.tmp")
        try:
            shutil.copy2(args.dmg,tmp)
            os.replace(tmp,target)
        finally:
            tmp.unlink(missing_ok=True)
    product["files"]=[e for e in product["files"] if e.get("counterKey")!=COUNTER]+[entry]
    # Preserva downloads de todas as plataformas e contadores históricos.
    planned=product.get("plannedFiles")
    if isinstance(planned,list):
        product["plannedFiles"]=[e for e in planned if e.get("counterKey")!=COUNTER]+[
            {k:entry[k] for k in ("category","counterKey","architecture","name")}]
    data["updated"]=datetime.now(timezone.utc).date().isoformat()
    tmp=MANIFEST.with_suffix(".json.tmp")
    try:
        tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        os.replace(tmp,MANIFEST)
    finally:
        tmp.unlink(missing_ok=True)
    print(f"CATALINA_LEGACY_READY={name} size={size} sha256={sha}")

if __name__=="__main__":
    main()
