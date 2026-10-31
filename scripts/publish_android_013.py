#!/usr/bin/env python3
"""Publish the exact v0.1.3 production-signed APK after it exists in the site tree.

Never advertise an APK that is not checked into downloads/ and validated.
The expected SHA-256 is the GitHub release asset digest for
alexpmr/PT2VHF-APRS-Android tag v0.1.3 (published 2026-10-31).
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
VERSION = "0.1.3"
APK_NAME = f"PT2VHF_APRS_Client_Android_v{VERSION}.apk"
EXPECTED_SHA256 = "f2d2b765aeaa5fa906d60f7644d5c2e1a835633e42c990f8a8906d8ecea7d711"
EXPECTED_SIZE = 7_428_195
APK_PATH = ROOT / "downloads" / "aprs-android" / APK_NAME
MANIFEST = ROOT / "updates.json"

def publish() -> None:
    if len(sys.argv) != 1:
        raise SystemExit("Usage: python3 scripts/publish_android_013.py")
    if not APK_PATH.is_file() or APK_PATH.is_symlink():
        raise RuntimeError(f"Signed APK missing: {APK_PATH.relative_to(ROOT)}")
    if APK_PATH.stat().st_size != EXPECTED_SIZE:
        raise RuntimeError("Size mismatch: APK must match the v0.1.3 signed release")
    digest = hashlib.sha256(APK_PATH.read_bytes()).hexdigest()
    if digest != EXPECTED_SHA256:
        raise RuntimeError("SHA-256 mismatch: APK is not the official v0.1.3 signed artifact")
    with zipfile.ZipFile(APK_PATH) as apk:
        names = set(apk.namelist())
        if not {"AndroidManifest.xml", "classes.dex"}.issubset(names):
            raise RuntimeError("Invalid APK structure")

    data = json.loads(MANIFEST.read_text("utf-8"))
    if data.get("schema") != 1 or "aprs-android" not in data.get("products", {}):
        raise RuntimeError("Unexpected OTA manifest schema")
    record = data["products"]["aprs-android"]
    current = record.get("version", "0.0.0")
    # Do not let older workflows silently downgrade an already newer version.
    if tuple(map(int, current.split(".")[:3])) > (0, 1, 3):
        raise RuntimeError(f"Refusing to downgrade {current} to {VERSION}")
    record.update({
        "version": VERSION,
        "date": "2026-10-31",
        "page": "https://www.pt2vhf.com/aprs-android",
        "notes": (
            "v0.1.3: símbolos APRS no mapa, filtros avançados por indicativo, "
            "tipo, data e distância, ordenação ascendente/descendente, "
            "restauração de centro/zoom, confirmação de saída e versão instalada "
            "no aviso inicial. Demais recursos avançados do backlog permanecem pendentes."
        ),
        "files": [{
            "category": "android-apk",
            "counterKey": "android-apk",
            "architecture": "universal",
            "platform": "android",
            "name": APK_NAME,
            "url": f"https://www.pt2vhf.com/downloads/aprs-android/{APK_NAME}",
            "size": EXPECTED_SIZE,
            "sha256": EXPECTED_SHA256,
            "detail": "Android 8 ou superior",
            "label": "Android — APK"
        }]
    })
    data["updated"] = "2026-10-31"
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"VERIFIED_APK={APK_NAME}")
    print(f"SIZE={EXPECTED_SIZE}")
    print(f"SHA256={digest}")
    print("COUNTER_KEY=android-apk")
    print("OTA_VERSION=0.1.3")

if __name__ == "__main__":
    publish()
