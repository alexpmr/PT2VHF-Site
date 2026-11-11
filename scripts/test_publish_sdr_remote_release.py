#!/usr/bin/env python3
"""Deterministic offline QA for publishing SDR metadata from a GitHub Release."""
import hashlib
import importlib.util
import json
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location(
    "publish_sdr_remote_release", HERE / "publish_sdr_remote_release.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with tempfile.TemporaryDirectory(prefix="sdr_site_qa_") as temp:
    root = Path(temp)
    manifest_path = root / "updates.json"
    release_path = root / "release.json"
    sums_path = root / "SHA256SUMS.txt"
    manifest_path.write_text(json.dumps({
        "schema": 1, "updated": "2026-11-09",
        "products": {"sdr": {"version": "0.13.0", "files": []}},
    }), encoding="utf-8")
    version = "0.13.1"
    setup = f"PT2VHF-SDR-Tool-v{version}-Win11-x64-Setup.exe"
    portable = f"PT2VHF-SDR-Tool-v{version}-Win11-x64-Portable.exe"
    sums_raw = (f"{'a'*64}  52000000  {setup}\n"
                f"{'b'*64}  74000000  {portable}\n").encode("utf-8")
    sums_path.write_bytes(sums_raw)
    release = {
        "tag_name": "v" + version, "draft": False, "prerelease": False,
        "assets": [
            {"name": "SHA256SUMS.txt", "digest": "sha256:" + hashlib.sha256(sums_raw).hexdigest()},
            {"name": setup, "size": 52000000, "digest": "sha256:" + "a"*64, "state": "uploaded"},
            {"name": portable, "size": 74000000, "digest": "sha256:" + "b"*64, "state": "uploaded"},
        ],
    }
    release_path.write_text(json.dumps(release), encoding="utf-8")
    args = ["publish_sdr_remote_release.py", version, str(release_path),
            str(sums_path), "Stable maintenance"]
    with patch.object(module, "MANIFEST", manifest_path), patch.object(sys, "argv", args):
        module.main()
    updated = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert updated["products"]["sdr"]["version"] == version
    files = updated["products"]["sdr"]["files"]
    assert {x["kind"] for x in files} == {"installer", "portable"}
    assert all(x["delivery"] == "github-release" and x["url"].startswith(
        "https://www.pt2vhf.com/downloads/sdr-tool/") for x in files)
    assert all(len(x["sha256"]) == 64 for x in files)

    # A release não pode publicar pacote com digest adulterado.
    release["assets"][1]["digest"] = "sha256:" + "0"*64
    release_path.write_text(json.dumps(release), encoding="utf-8")
    try:
        with patch.object(module, "MANIFEST", manifest_path), patch.object(sys, "argv", args):
            module.main()
        raise AssertionError("Digest divergente foi aceito")
    except SystemExit as e:
        assert "Hash/tamanho divergente" in str(e)

print("SDR_SITE_PUBLISHER_OFFLINE_QA=PASS")
