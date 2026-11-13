#!/usr/bin/env python3
"""Gera stations_prefixes.php (prefixo de indicativo -> país) a partir do dxcc.json.

Fonte: https://github.com/k0swe/dxcc-json (Apache-2.0), arquivo dxcc.json.
Uso: python3 scripts/build_station_prefixes.py caminho/para/dxcc.json
Em prefixo compartilhado vence a entidade com mais prefixos.
Entidades DXCC excluídas (deleted) são ignoradas. O prefixo mais longo que
casar com o indicativo vence (ex.: PY0F = Fernando de Noronha, PY = Brasil).
"""
import json
import pathlib
import sys

src = pathlib.Path(sys.argv[1])
data = json.loads(src.read_text(encoding="utf-8"))
table = {}
size = {}
for e in data["dxcc"]:
    if e.get("deleted"):
        continue
    cc = (e.get("countryCode") or "").upper()
    name = e["name"]
    for prefix in e["prefix"].split(","):
        prefix = prefix.strip().upper()
        if not prefix or not prefix.isalnum():
            continue
        # Prefixo compartilhado (ilhas DXCC especiais): fica a entidade principal,
        # a que tem mais prefixos (ex.: LU = Argentina, não South Georgia).
        n = len(e["prefix"].split(","))
        if prefix in table and size[prefix] >= n:
            continue
        table[prefix] = (cc, name)
        size[prefix] = n

# Ajustes manuais: prefixos que o dxcc.json não lista (licenças britânicas
# "2x") e prefixos compartilhados cuja entidade principal é outra.
EXTRA = {
    "2E": "England", "2D": "Isle of Man", "2I": "Northern Ireland", "2J": "Jersey",
    "2M": "Scotland", "2U": "Guernsey", "2W": "Wales",
    "TO": "Guadeloupe", "VP8": "Falkland Islands", "TX": "New Caledonia", "FO": "French Polynesia",
}
by_name = {e["name"]: ((e.get("countryCode") or "").upper(), e["name"]) for e in data["dxcc"] if not e.get("deleted")}
for prefix, name in EXTRA.items():
    table[prefix] = by_name[name]

def q(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

lines = [
    "<?php",
    "// GERADO por scripts/build_station_prefixes.py — não editar à mão.",
    "// Fonte: github.com/k0swe/dxcc-json (Apache-2.0). Prefixo => [ISO 3166-1, entidade DXCC].",
    "return array(",
]
for prefix in sorted(table):
    cc, name = table[prefix]
    lines.append(f"  {q(prefix)}=>array({q(cc)},{q(name)}),")
lines.append(");")
out = pathlib.Path(__file__).resolve().parent.parent / "stations_prefixes.php"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"{len(table)} prefixos gravados em {out}")
