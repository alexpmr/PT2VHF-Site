#!/usr/bin/env python3
"""Synchronize an existing, verified v1.0.6 stable APK to the official PT2VHF site.

Called only after confirming the exact public GitHub Release and its asset SHA-256.
Does not copy APK binaries into the website repository. download.php counts each
request and securely redirects to the validated immutable release asset.
"""
import datetime
import json
import pathlib
import re
import sys

if len(sys.argv) != 3:
    raise SystemExit("usage: sync_speed_stable_release.py release.json APK-SHA256")

release = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
assert release.get("tag_name") == "v1.0.6", "Unexpected tag"
assert release.get("draft") is False and release.get("prerelease") is False
assert release.get("html_url") == "https://github.com/alexpmr/speed-alert/releases/tag/v1.0.6"
filename = "PT2VHF-Speed-Alert-v1.0.6.apk"
matching = [x for x in release.get("assets", []) if x.get("name") == filename]
assert len(matching) == 1, "Missing or duplicate official stable APK"
asset = matching[0]
sha = sys.argv[2].lower().strip()
assert re.fullmatch(r"[a-f0-9]{64}", sha), "Invalid local SHA256"
assert asset.get("digest") == "sha256:" + sha, "Release digest mismatch"
assert asset.get("browser_download_url") == (
    "https://github.com/alexpmr/speed-alert/releases/download/v1.0.6/" + filename
), "Unexpected asset redirect URL"
size = int(asset.get("size") or 0)
assert 1_000_000 <= size <= 100_000_000, "Invalid APK size"

manifest_file = pathlib.Path("updates.json")
doc = json.loads(manifest_file.read_text(encoding="utf-8"))
assert doc.get("schema") == 1 and isinstance(doc.get("products"), dict)
today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
doc["updated"] = today
doc["products"]["speed"] = {
    "name": "PT2VHF Speed Alert",
    "version": "1.0.6",
    "date": today,
    "page": "https://www.pt2vhf.com/speed",
    "notes": (
        "Versão 1.0 estável: nova tela de velocidade, seis alarmes, "
        "base de vias e radares offline, atualização pelo site. "
        "Instalações das betas anteriores podem exigir desinstalação "
        "devido à mudança de assinatura digital."
    ),
    "files": [{
        "category": "android-apk",
        "counterKey": "android-apk",
        "label": "Android — versão 1.0",
        "name": filename,
        "url": "https://www.pt2vhf.com/downloads/speed-alert/" + filename,
        "size": size,
        "sha256": sha,
        "platform": "android",
        "delivery": "github-release",
        "detail": (
            "Android 8+; instalação direta. A migração de betas anteriores "
            "pode exigir desinstalação por causa da assinatura."
        ),
    }],
}
manifest_file.write_text(
    json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

# A página /speed não oferece mais o APK (distribuição pelo Google Play, teste fechado). Só o manifesto é
# atualizado, para o OTA de quem já tem o APK instalado; a página não é alterada.
print("Speed 1.0.6 OTA/site manifest updated:", filename, size, sha)
