#!/usr/bin/env python3
"""Publica somente um APK real e assinado da release Android 0.1.2 no site.

A origem é o artefato do GitHub Actions da release de produção do aplicativo.
O script somente atualiza updates.json depois de gravar e validar o APK.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
VERSION = "0.1.2"
EXPECTED = f"PT2VHF_APRS_Client_Android_v{VERSION}.apk"
OUT = ROOT / "downloads" / "aprs-android" / EXPECTED
MANIFEST = ROOT / "updates.json"

def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: publish_android_012.py <signed-release-artifact.zip>")
    archive = Path(sys.argv[1])
    if not archive.is_file() or archive.stat().st_size < 1_000_000:
        raise RuntimeError("Artefato ZIP inexistente ou pequeno demais")
    with zipfile.ZipFile(archive) as z:
        candidates = [n for n in z.namelist() if Path(n).name == EXPECTED and not n.endswith("/")]
        if len(candidates) != 1:
            raise RuntimeError(f"APK {EXPECTED} não encontrado exatamente uma vez no artefato")
        entry = z.getinfo(candidates[0])
        if not 1_000_000 < entry.file_size < 50_000_000:
            raise RuntimeError("Tamanho do APK fora do intervalo esperado")
        content = z.read(candidates[0])
    if not content.startswith(bytes((0x50, 0x4b, 0x03, 0x04))):
        raise RuntimeError("APK não é ZIP Android válido")
    sha = hashlib.sha256(content).hexdigest()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(content)

    with zipfile.ZipFile(OUT) as apk:
        if "AndroidManifest.xml" not in apk.namelist() or "classes.dex" not in apk.namelist():
            raise RuntimeError("Faltam componentes Android obrigatórios no APK")

    data = json.loads(MANIFEST.read_text("utf-8"))
    if data.get("schema") != 1 or "aprs-android" not in data.get("products", {}):
        raise RuntimeError("updates.json fora do contrato")
    record = data["products"]["aprs-android"]
    record.update({
        "version": VERSION,
        "date": "2026-10-31",
        "page": "https://www.pt2vhf.com/aprs-android",
        "notes": "Versão 0.1.2: melhorias de persistência local, filtros e ordenação, indicadores APRS-IS/TNC/GPS, conexão APRS-IS configurável, tracklog, acompanhamento de estações, favoritos e diagnóstico. Funcionalidades avançadas do backlog continuam em desenvolvimento.",
        "files": [{
            "category": "android-apk",
            "counterKey": "android-apk",
            "architecture": "universal",
            "platform": "android",
            "name": EXPECTED,
            "url": f"https://www.pt2vhf.com/downloads/aprs-android/{EXPECTED}",
            "size": len(content),
            "sha256": sha,
            "detail": "Android 8 ou superior",
            "label": "Android — APK"
        }],
    })
    data["updated"] = "2026-10-31"
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"VALIDATED_APK={OUT.relative_to(ROOT)}")
    print(f"APK_SIZE={len(content)}")
    print(f"APK_SHA256={sha}")
    print("MANIFEST_UPDATED=1")

if __name__ == "__main__":
    main()
