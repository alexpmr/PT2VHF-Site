#!/usr/bin/env python3
"""Validate Android v0.1.4 signed GitHub release, then update site OTA.

Called from GitHub Actions after downloading the APK and release metadata.
Never advertise an absent, mismatched or unsigned release artifact.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.1.4"
NAME = f"PT2VHF_APRS_Client_Android_v{VERSION}.apk"
SOURCE_REPO = "alexpmr/PT2VHF-APRS-Android"
DEST = ROOT / "downloads" / "aprs-android" / NAME
MANIFEST = ROOT / "updates.json"


def version_tuple(text: str) -> tuple[int, int, int]:
    parts = str(text).strip().lstrip("v").split(".")
    if len(parts) != 3 or not all(part.isdigit() for part in parts):
        raise ValueError(f"Unsupported version: {text}")
    return tuple(int(part) for part in parts)


def main(release_json_path: str) -> None:
    release = json.loads(Path(release_json_path).read_text(encoding="utf-8"))
    if release.get("tag_name") != "v" + VERSION or release.get("draft"):
        raise ValueError("GitHub release version/draft did not match")
    if release.get("html_url", "").split("/releases/")[0] != (
        "https://github.com/" + SOURCE_REPO
    ):
        raise ValueError("Release provenance is not official Android repository")

    candidates = [asset for asset in release.get("assets", []) if asset.get("name") == NAME]
    if len(candidates) != 1:
        raise ValueError("The signed release must contain exactly one named APK")
    asset = candidates[0]
    digest = str(asset.get("digest", ""))
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", digest):
        raise ValueError("Official release has no usable SHA-256 digest")
    if not DEST.is_file() or DEST.is_symlink():
        raise ValueError(f"APK not present at {DEST}")
    if DEST.stat().st_size != asset.get("size") or DEST.stat().st_size < 1_000_000:
        raise ValueError("APK size mismatch")
    sha = hashlib.sha256(DEST.read_bytes()).hexdigest()
    if sha != digest.removeprefix("sha256:"):
        raise ValueError("APK SHA-256 mismatch with official release")
    with zipfile.ZipFile(DEST) as apk:
        if not {"AndroidManifest.xml", "classes.dex"}.issubset(set(apk.namelist())):
            raise ValueError("Required APK entries missing")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if manifest.get("schema") != 1 or "aprs-android" not in manifest.get("products", {}):
        raise ValueError("Unexpected OTA manifest schema")
    current = manifest["products"]["aprs-android"]
    if version_tuple(current.get("version", "0.0.0")) > version_tuple(VERSION):
        raise ValueError("Refusing OTA version rollback")
    current.update({
        "version": VERSION,
        "date": "2026-10-31",
        "page": "https://www.pt2vhf.com/aprs-android",
        "notes": (
            "v0.1.4: comentário de posição APRS anuncia sempre "
            "www.PT2VHF.com por APRS-IS e RF/TNC, sem duplicar "
            "o endereço ou sobrescrever o comentário personalizado. "
            "Demais itens do backlog permanecem pendentes."
        ),
        "files": [{
            "category": "android-apk",
            "counterKey": "android-apk",
            "architecture": "universal",
            "platform": "android",
            "name": NAME,
            "url": f"https://www.pt2vhf.com/downloads/aprs-android/{NAME}",
            "size": DEST.stat().st_size,
            "sha256": sha,
            "detail": "Android 8 ou superior",
            "label": "Android — APK",
        }],
    })
    manifest["updated"] = "2026-10-31"
    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"VERIFIED_VERSION={VERSION}")
    print(f"APK_SIZE={DEST.stat().st_size}")
    print(f"APK_SHA256={sha}")
    print("COUNTER_KEY=android-apk")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: publish_android_014.py /path/to/official-release.json")
    main(sys.argv[1])
