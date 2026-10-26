#!/usr/bin/env python3
"""Promove release GH validada para os binários oficiais PT2VHF.com.

Utiliza GH só como origem de artefatos de CI; a distribuição/OTA é pelo site.
"""
import hashlib
import json
import os
import re
import time
from urllib.error import HTTPError
from datetime import date
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
MANIFEST=ROOT/"updates.json"
FOLDER=ROOT/"downloads/mesh-analyzer"
API="https://api.github.com/repos/alexpmr/PT2VHF-Mesh-Analyzer"
SITE="https://www.pt2vhf.com"
MAX=100_000_000

def get(url, limit):
    accept = "application/vnd.github+json" if url.startswith(API + "/releases/") else "application/octet-stream"
    req=Request(url,headers={"User-Agent":"PT2VHF-ReleaseSync/1.0","Accept":accept})
    with urlopen(req,timeout=100) as f:
        buf=f.read(limit+1)
    if len(buf)>limit:
        raise RuntimeError("Tamanho excedido: "+url)
    return buf

def run():
    doc=json.loads(MANIFEST.read_text(encoding="utf-8"))
    item=doc["products"]["mesh"]
    version=str(item.get("developmentVersion") or "")
    if not re.fullmatch(r"\d+\.\d+\.\d+",version):
        raise ValueError("developmentVersion invalida")
    cur=item.get("version")
    if cur and tuple(map(int,cur.split(".")))>tuple(map(int,version.split("."))):
        raise ValueError("Nao retroceder versao publicada")
    stem="PT2VHF-Mesh-Analyzer-v"+version+"-"
    entries=[
        ("windows-installer","win-setup-x64","windows-x64","x64",stem+"Setup-Win10-Win11-x64.exe"),
        ("windows-portable","win-portable-x64","windows-x64","x64",stem+"Portable-Win10-Win11-x64.zip"),
        ("linux-targz","linux-tar-x64","linux-x64","x64",stem+"Linux-x64.tar.gz"),
        ("linux-deb","linux-deb-x64","linux-x64","x64",stem+"amd64.deb"),
        ("macos","mac-dmg-arm64","macos-arm64","Apple Silicon",stem+"macOS-arm64.dmg"),
        ("macos","mac-dmg-x64","macos-x64","Intel",stem+"macOS-x64.dmg"),
    ]
    for attempt in range(60):
        try:
            release=json.loads(get(API+"/releases/tags/v"+version,1_000_000))
            break
        except HTTPError as exc:
            if exc.code!=404 or attempt==59:
                raise
            print("Aguardando concluir a compilação da release v"+version+" ("+str(attempt+1)+"/60)",flush=True)
            time.sleep(20)

    if release.get("tag_name")!="v"+version or release.get("draft") or release.get("prerelease"):
        raise ValueError("Release ainda nao publicada")
    assets={a["name"]:a for a in release.get("assets",[]) if "name" in a}
    names=[e[4] for e in entries]
    if any(x not in assets for x in names+["SHA256SUMS.txt"]):
        raise ValueError("Faltam instaladores oficiais; publicacao nao ativada")
    sums={}
    for line in get(assets["SHA256SUMS.txt"]["browser_download_url"],120000).decode("ascii").splitlines():
        m=re.fullmatch(r"([a-fA-F0-9]{64})\s+\*?([A-Za-z0-9_.-]+)",line.strip())
        if m:sums[m.group(2)]=m.group(1).lower()
    if any(x not in sums for x in names):
        raise ValueError("SHA256SUMS incompleto")

    import tempfile
    with tempfile.TemporaryDirectory(prefix="mesh-release-") as tmp:
        stage=Path(tmp)
        published=[]
        for cat,key,platform,architecture,name in entries:
            asset=assets[name]
            url=asset["browser_download_url"]
            if not url.startswith("https://github.com/alexpmr/PT2VHF-Mesh-Analyzer/releases/download/v"+version+"/"):
                raise ValueError("Origem de compilacao desconhecida")
            declared=int(asset.get("size") or 0)
            if declared<=1024 or declared>=MAX:
                raise ValueError("Tamanho nao suportado por Git: "+name)
            content=get(url,MAX)
            digest=hashlib.sha256(content).hexdigest()
            if len(content)!=declared or digest!=sums[name]:
                raise ValueError("Tamanho/checksum incorreto: "+name)
            signatures={".exe":b"MZ",".zip":b"PK",".deb":b"!<arch>\n",".gz":b"\x1f\x8b"}
            suffix=Path(name).suffix
            if suffix in signatures and not content.startswith(signatures[suffix]):
                raise ValueError("Assinatura de arquivo invalida: "+name)
            (stage/name).write_bytes(content)
            published.append({"category":cat,"counterKey":key,"platform":platform,
                "architecture":architecture,"name":name,
                "url":SITE+"/downloads/mesh-analyzer/"+name,
                "size":declared,"sha256":digest,"detail":"PT2VHF Mesh Analyzer "+architecture})
        FOLDER.mkdir(parents=True,exist_ok=True)
        for old in FOLDER.iterdir():
            if old.is_file() and old.name.startswith("PT2VHF-Mesh-Analyzer-v"):
                old.unlink()
        for e in published:
            os.replace(stage/e["name"],FOLDER/e["name"])
    item["version"]=version
    item["date"]=date.today().isoformat()
    item["notes"]="Atualizacao oficial PT2VHF.com com arquivos verificados."
    item["files"]=published
    item["releaseStatus"]="Seis instaladores oficiais validados."
    doc["updated"]=date.today().isoformat()
    dest=MANIFEST.with_suffix(".tmp")
    dest.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    os.replace(dest,MANIFEST)
    print("PUBLICADO NO GITLAB SITE:",version,len(published),"instaladores (OTA ainda depende do deploy Hostinger).")

if __name__=="__main__":
    run()
