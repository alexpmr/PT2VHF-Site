#!/usr/bin/env python3
"""Verify the official Hostinger manifest/OTA and three native Pi files."""
from __future__ import annotations
import argparse
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.pt2vhf.com"
NAMES = {
    "appimage": "PT2VHF_APRS_Client_arm64_v1.15.6.AppImage",
    "deb": "pt2vhf-aprs-client_1.15.6_arm64.deb",
    "tar.gz": "PT2VHF_APRS_Client_Linux_arm64_v1.15.6.tar.gz",
}
HEADERS = {"User-Agent": "PT2VHF-ARM64-Publish-Verification/1.15.6", "Cache-Control": "no-cache"}

def request(url: str, method: str="GET"):
    req = urllib.request.Request(url, headers=HEADERS, method=method)
    with urllib.request.urlopen(req, timeout=25) as res:
        body = res.read() if method == "GET" else b""
        return res.status, res.headers, body

def verify() -> None:
    committed = json.loads((ROOT / "updates.json").read_text(encoding="utf-8"))["products"]["aprs"]
    expected = {x["name"]: x for x in committed["files"] if x["name"] in NAMES.values()}
    if len(expected) != 3:
        raise ValueError("Repository manifest does not contain all three ARM64 formats")
    live = json.loads(request(ORIGIN + "/updates.json?arm64-check=" + str(time.time_ns()))[2])["products"]["aprs"]
    if live.get("version") != "1.15.6" or len(live.get("files", [])) < 12:
        raise ValueError("Hostinger has not deployed the 12-file APRS manifest")
    available = {x["name"]: x for x in live["files"]}
    for kind, name in NAMES.items():
        published = available.get(name)
        if not published:
            raise ValueError("Live ARM64 download missing: " + name)
        for field in ("size", "sha256", "version", "platform", "counterKey", "url"):
            if published.get(field) != expected[name].get(field):
                raise ValueError(f"Live mismatch {name}: {field}")
        status, headers, _ = request(ORIGIN + "/downloads/aprs-client/" + name, method="HEAD")
        length = headers.get("Content-Length")
        if status != 200 or (length is not None and int(length) != expected[name]["size"]):
            raise ValueError(f"File not ready on Hostinger: {name}, HTTP={status}, size={length}")
        url = ORIGIN + "/update.php?product=aprs&platform=linux-arm64&kind=" + urllib.parse.quote(kind)
        payload = json.loads(request(url)[2])
        if not any(x.get("name") == name for x in payload.get("files", [])):
            raise ValueError(f"OTA does not expose {kind}: {name}")
        print("PUBLIC_CONFIRMED", name, expected[name]["size"], expected[name]["sha256"], flush=True)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--wait", action="store_true")
    args = parser.parse_args()
    for attempt in range(1, 21 if args.wait else 2):
        try:
            verify()
            print("PT2VHF_SITE_ARM64_VERIFIED=1", flush=True)
            return
        except Exception as exc:
            print(f"Public verification {attempt}: {exc}", flush=True)
            if not args.wait or attempt == 20:
                raise
            time.sleep(15)

if __name__ == "__main__":
    main()
