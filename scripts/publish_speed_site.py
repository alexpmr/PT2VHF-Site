#!/usr/bin/env python3
"""Publish one verified PT2VHF Speed Alert APK into site updates.json and /speed.
Usage: python scripts/publish_speed_site.py <apk_path> <version> <sha256>
"""
import sys,json,hashlib,re,datetime
from pathlib import Path
p=Path(sys.argv[1])
version=sys.argv[2]
expected=sys.argv[3].lower()
if not re.fullmatch(r"\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?",version):
    raise SystemExit("Invalid release version")
name="PT2VHF-Speed-Alert-v"+version+".apk"
if p.name!=name or not p.is_file():
    raise SystemExit("APK filename/path does not match intended version")
actual=hashlib.sha256(p.read_bytes()).hexdigest()
if not re.fullmatch("[a-f0-9]{64}",expected) or actual!=expected:
    raise SystemExit("APK SHA-256 mismatch")
size=p.stat().st_size
if not 100_000<size<100_000_000:raise SystemExit("Unexpected APK size")
manifest=Path("updates.json")
j=json.loads(manifest.read_text(encoding="utf-8"))
assert j.get("schema")==1 and isinstance(j.get("products"),dict)
j["updated"]=datetime.datetime.now(datetime.timezone.utc).date().isoformat()
j["products"]["speed"]={
 "name":"PT2VHF Speed Alert",
 "version":version,
 "date":j["updated"],
 "page":"https://www.pt2vhf.com/speed",
 "notes":"Nova interface de velocidade, GPS e base offline, botão silenciar, OTA e consulta opcional de instalações. Beta não homologada; dados de vias e radares podem estar incompletos.",
 "files":[{
  "category":"android-apk",
  "label":"Android — APK beta",
  "name":name,
  "url":"https://www.pt2vhf.com/downloads/speed-alert/"+name,
  "size":size,
  "sha256":actual,
  "platform":"android",
  "counterKey":"speed-apk",
  "detail":"Android 8+; APK beta. A atualização pode exigir reinstalação por diferença de assinatura de debug."
 }]
}
manifest.write_text(json.dumps(j,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
# A página /speed não oferece mais o APK (distribuição pelo Google Play, teste fechado). Só o manifesto é
# atualizado, para o OTA de quem já tem o APK instalado; a página não é alterada.
print("PUBLISHED SPEED SITE METADATA:",version,size,actual)
