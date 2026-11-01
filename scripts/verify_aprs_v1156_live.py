"""Verify v1.15.6 on Hostinger against the exact committed file hashes."""
import argparse
import hashlib
import json
from pathlib import Path
import time
import urllib.request

BASE = "https://www.pt2vhf.com"
VERSION = "1.15.6"
ROOT = Path(__file__).resolve().parents[1]
HEADERS = {"User-Agent": "PT2VHF-GitHub-Release-Verification/1.15.6", "Cache-Control": "no-cache"}


def fetch_json(path):
    req = urllib.request.Request(BASE + path, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as response:
        assert response.status == 200
        return json.load(response)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--wait", action="store_true")
    args = parser.parse_args()
    expected = json.loads((ROOT / "updates.json").read_text(encoding="utf-8"))["products"]["aprs"]
    assert expected["version"] == VERSION and len(expected["files"]) == 9, "Expected committed release is not ready"
    for attempt in range(18 if args.wait else 1):
        try:
            live = fetch_json(f"/updates.json?verify=aprs1156-{time.time_ns()}")["products"]["aprs"]
            ota = fetch_json("/update.php?product=aprs")
            assert live["version"] == VERSION and len(live["files"]) == 9
            assert ota["version"] == VERSION and ota["status"] == "available"
            assert len(ota["files"]) == 9, "OTA is missing a platform/file"
            actual = {item["name"]: item for item in live["files"]}
            ota_files = {item["name"]: item for item in ota["files"]}
            for item in expected["files"]:
                remote = actual[item["name"]]
                for key in ("size", "sha256", "version", "url", "platform"):
                    assert remote[key] == item[key], (item["name"], key)
                for key in ("size", "sha256", "url", "platform"):
                    assert ota_files[item["name"]][key] == item[key], ("OTA", item["name"], key)
            break
        except Exception as error:
            if not args.wait or attempt == 17:
                raise RuntimeError("Hostinger release/OTA did not match committed v1.15.6") from error
            print(f"Waiting for Hostinger ({attempt + 1}/18): {error}", flush=True)
            time.sleep(15)
    for item in expected["files"]:
        assert item["url"].startswith(BASE + "/downloads/aprs-client/")
        # Test the static response directly without inflating download counters.
        req = urllib.request.Request(item["url"] + "?pt2vhf_raw=1", headers=HEADERS)
        digest, size = hashlib.sha256(), 0
        with urllib.request.urlopen(req, timeout=90) as response:
            assert response.status == 200
            assert response.url.startswith(BASE + "/downloads/aprs-client/")
            while chunk := response.read(1024 * 1024):
                digest.update(chunk)
                size += len(chunk)
        assert size == item["size"], (item["name"], "size", size)
        assert digest.hexdigest() == item["sha256"], (item["name"], "SHA-256")
        print("LIVE_BINARY_SHA256_OK", item["name"], size, flush=True)
    print("HOSTINGER_VERIFIED version=1.15.6 binaries=9 OTA=available SHA256=matched", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        chain = []
        current = error
        while current is not None:
            chain.append(f"{type(current).__name__}: {current}")
            current = current.__cause__
        message = " <- ".join(chain).replace("%", "%25").replace("\n", "%0A").replace("\r", "%0D")
        print("::error::" + message, flush=True)
        raise
