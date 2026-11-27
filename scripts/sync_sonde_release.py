#!/usr/bin/env python3
"""Publish a verified PT2VHF Sonde Finder GitHub Release on the official site.

Usage: sync_sonde_release.py release.json APK-PATH APK-SHA256

Called by .github/workflows/sync-sonde-release.yml only after the APK was downloaded from the
release, its SHA-256 matched the release digest and its signing certificate matched the permanent key.
- copies the APK to downloads/sonde-finder/ (update.php serves only files that exist there);
- writes products.sonde in updates.json (OTA of the site APK);
- points the temporary-APK link of the e-mails (sonde_apk_lib.php) to the new file.
Earlier APKs stay in place, so old links keep working.
"""
import datetime
import json
import pathlib
import re
import shutil
import sys

if len(sys.argv) != 4:
    raise SystemExit("usage: sync_sonde_release.py release.json APK-PATH APK-SHA256")

release = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
apk = pathlib.Path(sys.argv[2])
sha = sys.argv[3].lower().strip()

tag = release.get("tag_name", "")
m = re.fullmatch(r"v(\d+\.\d+\.\d+)", tag)
assert m, "Unexpected tag " + tag
version = m.group(1)
assert release.get("draft") is False and release.get("prerelease") is False
name = f"PT2VHF-Sonde-Finder-v{version}.apk"
assert apk.name == name, "Unexpected APK name"
assert re.fullmatch(r"[a-f0-9]{64}", sha), "Invalid SHA-256"
assets = [a for a in release.get("assets", []) if a.get("name") == name]
assert len(assets) == 1 and assets[0].get("digest") == "sha256:" + sha, "Release digest mismatch"
size = apk.stat().st_size
assert 1_000_000 <= size <= 100_000_000, "Invalid APK size"

dest = pathlib.Path("downloads/sonde-finder") / name
dest.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(apk, dest)
url = "https://www.pt2vhf.com/downloads/sonde-finder/" + name

# Release notes: first paragraph of the release body, as plain text.
body = (release.get("body") or "").strip()
notes = re.sub(r"[#*`>]", "", body.split("\n\n")[0]).replace("\n", " ").strip()[:400] or f"Versão {version}."

manifest = pathlib.Path("updates.json")
doc = json.loads(manifest.read_text(encoding="utf-8"))
assert doc.get("schema") == 1 and isinstance(doc.get("products"), dict)
today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
doc["updated"] = today
doc["products"]["sonde"] = {
    "name": "PT2VHF Sonde Finder",
    "version": version,
    "date": today,
    "page": "https://www.pt2vhf.com/sonde",
    "notes": notes,
    "files": [{
        "category": "android-apk",
        "counterKey": "android-apk",
        "label": "Android — APK",
        "name": name,
        "url": url,
        "size": size,
        "sha256": sha,
        "platform": "android",
        "detail": "Android 8+; APK provisório enquanto o teste fechado do Google Play não é liberado.",
    }],
}
manifest.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

lib = pathlib.Path("sonde_apk_lib.php")
text = lib.read_text(encoding="utf-8")
new, n = re.subn(r"const PT2VHF_SONDE_APK_URL = '[^']*';", f"const PT2VHF_SONDE_APK_URL = '{url}';", text)
assert n == 1, "APK URL constant not found"
lib.write_text(new, encoding="utf-8")
print("Sonde Finder", version, "published:", name, size, sha)
