#!/usr/bin/env python3
"""Publish a VERIFIED signed Android 0.1.10 QA APK on the PT2VHF site.

Never advertise a missing binary. Run only after the official QA build archive
has been unpacked and the source artifact's checksum has been verified.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NAME = "PT2VHF_APRS_Client_Android_v0.1.10_QA.apk"
APK = ROOT / "downloads" / "aprs-android" / NAME
EXPECTED_SIZE = 7992699
EXPECTED_SHA = "0a656898f98b354ff460c962089ccabb46ab63e76d15c78adaa9f6f905b8ac07"
DATE = "2026-11-08"

ENTRIES = {
    "pt": ("Beta QA: mensagens e telemetria WX", [
        "APRS-IS: filtro do próprio indicativo, leitura de mensagens via iGate e reply-ack; aprimorada a resposta do envio.",
        "Lixeira na lista de estações, campo de mensagens mais legível e confirmações de envio/ACK.",
        "Leitura inicial de WX com gráficos da sessão e validação sintática básica de indicativos. Beta: testes RF/APRS-IS e itens do backlog ainda pendentes."
    ]),
    "en": ("QA beta: messaging and WX telemetry", [
        "APRS-IS direct-message filter, iGate third-party messages, reply-ack decoding and send-result handling.",
        "Delete-stations button, improved message editor visibility and distinct sent/ACK indicators.",
        "Initial WX readings and in-session charts, plus basic callsign syntax checks. Beta: RF/APRS-IS field tests and backlog remain open."
    ]),
    "es": ("Beta QA: mensajes y telemetría WX", [
        "Filtro APRS-IS para el indicativo propio, paquetes vía iGate, reply-ack y resultado de envío.",
        "Papelera de estaciones, campo de mensajes más legible e indicadores de enviado/ACK.",
        "Lecturas WX y gráficos de la sesión, con validación básica de indicativos. Beta: faltan pruebas RF/APRS-IS."
    ]),
    "fr": ("Bêta QA : messages et télémétrie WX", [
        "Filtre APRS-IS pour l'indicatif, paquets via iGate, reply-ack et retour d'envoi.",
        "Suppression des stations, saisie des messages plus lisible et indicateurs d'envoi/ACK.",
        "Mesures météo et graphiques de session, validation initiale des indicatifs. Bêta : tests RF/APRS-IS à réaliser."
    ]),
    "de": ("QA-Beta: Nachrichten und WX-Telemetrie", [
        "APRS-IS-Filter für das eigene Rufzeichen, iGate-Pakete, Reply-ACK und Versandstatus.",
        "Stationslöschung, besser lesbare Nachrichten und getrennte Versand-/ACK-Anzeigen.",
        "Erste Wetterdaten und Sitzungsdiagramme, grundlegende Rufzeichenprüfung. Beta: RF/APRS-IS-Feldtests ausstehend."
    ]),
    "it": ("Beta QA: messaggi e telemetria WX", [
        "Filtro APRS-IS per il nominativo, pacchetti via iGate, reply-ack e stato di invio.",
        "Cancellazione stazioni, testo dei messaggi più leggibile e indicatori invio/ACK.",
        "Prime misure meteo e grafici della sessione, verifica di base dei nominativi. Beta: test RF/APRS-IS ancora necessari."
    ]),
    "zh": ("QA 测试版：消息与气象遥测", [
        "APRS-IS 本台呼号过滤、iGate 封装消息、reply-ack 与发送状态处理。",
        "电台列表清除按钮、消息输入改善，以及发送和 ACK 的不同指示。",
        "初步气象观测与会话图表、呼号格式验证。测试版：仍需 RF/APRS-IS 实机验证。"
    ]),
}


def main() -> None:
    if not APK.is_file() or APK.is_symlink():
        raise SystemExit("Refusing site update: verified APK missing")
    if APK.stat().st_size != EXPECTED_SIZE:
        raise SystemExit("QA APK size does not match source artifact")
    digest = hashlib.sha256(APK.read_bytes()).hexdigest()
    if digest != EXPECTED_SHA:
        raise SystemExit("QA APK SHA256 mismatch")
    with zipfile.ZipFile(APK) as archive:
        if not {"AndroidManifest.xml", "classes.dex"}.issubset(archive.namelist()):
            raise SystemExit("Invalid Android APK ZIP contents")

    manifest_path = ROOT / "updates.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest.get("schema") == 1
    product = manifest["products"]["aprs-android"]
    if product.get("version") not in ("0.1.9", "0.1.10"):
        raise SystemExit("Unexpected current Android version: " + str(product.get("version")))
    product.update({
        "version": "0.1.10",
        "date": DATE,
        "page": "https://www.pt2vhf.com/aprs-android",
        "notes": (
            "v0.1.10 beta QA: filtro APRS-IS de mensagens diretas, pacotes via iGate, "
            "reply-ack, envio mais robusto, lixeira de estações, contraste de digitação, "
            "telemetria WX e gráficos da sessão, validação básica de indicativos. "
            "Versão experimental: testes de RF/APRS-IS e backlog completo ainda pendentes."
        ),
        "releaseStatus": "Beta QA: compilação e assinatura validadas; testes reais RF/APRS-IS pendentes.",
        "files": [{
            "category": "android-apk",
            "counterKey": "android-apk",
            "architecture": "universal",
            "platform": "android",
            "name": NAME,
            "url": f"https://www.pt2vhf.com/downloads/aprs-android/{NAME}",
            "size": EXPECTED_SIZE,
            "sha256": digest,
            "detail": "Android 8 ou superior · BETA QA (não homologado em RF)",
            "label": "Android — APK Beta QA",
        }],
    })
    manifest["updated"] = DATE

    changelog_path = ROOT / "assets/js/changelog-data.js"
    changelog = changelog_path.read_text(encoding="utf-8")
    log_start = changelog.index('var LOG = {')
    start = changelog.index('    "aprs-android": {', log_start)
    end = changelog.index('\n    },', start)
    block = changelog[start:end]
    if 'e("0.1.10"' not in block:
        for lang, (title, notes) in ENTRIES.items():
            anchor = f'{lang}: [e("0.1.9"'
            if block.count(anchor) != 1:
                raise SystemExit(f"Unexpected changelog structure: {lang}")
            entry = f'e("0.1.10", {json.dumps(title, ensure_ascii=False)}, {json.dumps(notes, ensure_ascii=False)})'
            block = block.replace(anchor, f'{lang}: [{entry}, e("0.1.9"', 1)
        block, removed = re.subn(r', e\("0\.1\.2", "[^"]+", \[[^\]]*\]\)', "", block)
        if removed != len(ENTRIES):
            raise SystemExit(f"Expected to remove 7 old changelog entries, got {removed}")
    changelog = changelog[:start] + block + changelog[end:]

    products_path = ROOT / "assets/js/products.js"
    products = products_path.read_text(encoding="utf-8")
    start = products.index('    id: "aprs-android",')
    feat = products.index('    features: [', start) + len('    features: [')
    if "Beta 0.1.10" not in products[start:]:
        new_features = (
            '\n      "Beta 0.1.10: tratamento de mensagens direcionadas via APRS-IS/iGate, '
            'reply-ack e feedback de envio (testes RF/IS ainda necessários)",'
            '\n      "Beta 0.1.10: lixeira na aba Estações, dados WX convencionais '
            'e gráficos das medições da sessão (histórico persistente ainda pendente)",'
        )
        products = products[:feat] + new_features + products[feat:]

    page_path = ROOT / "android.html"
    page = page_path.read_text(encoding="utf-8")
    page = re.sub(
        r'(assets/js/(?:products|changelog-data)\.js\?v=)[^"]+',
        r'\g<1>20261108-aprsandroid0110qa', page
    )
    if "20261108-aprsandroid0110qa" not in page:
        raise SystemExit("Failed to update cache buster")

    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    changelog_path.write_text(changelog, encoding="utf-8")
    products_path.write_text(products, encoding="utf-8")
    page_path.write_text(page, encoding="utf-8")
    print(f"ANDROID_0110_QA_VERIFIED=1 size={EXPECTED_SIZE} sha256={digest}")
    print("OTA_COUNTER_KEY=android-apk")
    print("QA_BETA_NOT_PRODUCTION_HOMOLOGATED=1")


if __name__ == "__main__":
    main()
