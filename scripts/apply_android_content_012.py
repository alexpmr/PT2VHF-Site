#!/usr/bin/env python3
"""Integra somente o conteúdo Android preparado, preservando os demais produtos."""
from __future__ import annotations
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = "origin/release/android-0.1.2-content"

def revision(path: str) -> str:
    return subprocess.check_output(["git", "show", f"{REF}:{path}"], cwd=ROOT, text=True)

def rewrite_android_changelog(text: str, source: str) -> str:
    def section(s: str) -> tuple[int, int]:
        log = s.index("var LOG")
        i = s.index('    "aprs-android": {', log)
        j = s.index("    prog: {", i)
        return i, j
    a, b = section(text)
    x, y = section(source)
    change = source[x:y]
    if 'e("0.1.2"' not in change:
        raise RuntimeError("Changelog 0.1.2 ausente da branch de conteúdo")
    return text[:a] + change + text[b:]

def rewrite_product(text: str, source: str) -> str:
    pat = re.compile(r'  \{\n    id: "aprs-android",.*?\n  \},\n(?=  \{\n    id: "prop")', re.S)
    result = pat.search(source)
    if not result or not pat.search(text):
        raise RuntimeError("Bloco APRS Android não encontrado no catálogo")
    return pat.sub(lambda _: result.group(), text, count=1)

def main() -> None:
    if not (ROOT / "downloads/aprs-android/PT2VHF_APRS_Client_Android_v0.1.2.apk").is_file():
        raise RuntimeError("Não publicar os textos sem o APK de produção no repositório")
    for filename, fn in (
        ("assets/js/changelog-data.js", rewrite_android_changelog),
        ("assets/js/products.js", rewrite_product),
    ):
        target = ROOT / filename
        old = target.read_text("utf-8")
        new = fn(old, revision(filename))
        target.write_text(new, encoding="utf-8")
        print("UPDATED", filename)
    page = ROOT / "android.html"
    html = page.read_text("utf-8")
    html = re.sub(r'(/assets/js/(?:products|changelog-data)\.js\?v=)[^"]+',
                  r'\g<1>20261031-android012', html)
    page.write_text(html, encoding="utf-8")
    print("UPDATED", page.name)

if __name__ == "__main__":
    main()
