#!/usr/bin/env python3
"""Gera geo/country-ipv4.bin e geo/country-ipv6.bin a partir do DB-IP Lite (CC BY 4.0).

Origem: pacote npm @ip-location-db/dbip-country (dbip-country-ipv4.csv e dbip-country-ipv6.csv).
Uso:    npm pack @ip-location-db/dbip-country && tar -xzf ip-location-db-dbip-country-*.tgz
        python3 scripts/build_country_db.py package/ <versão>

Formato: registros ordenados de [início do intervalo, big-endian (4 ou 16 bytes)][país, 2 bytes ASCII].
Lacunas entre intervalos viram "--" (desconhecido) e intervalos vizinhos do mesmo país são unidos,
assim o país de um IP é o do último registro com início <= IP (busca binária em visits_lib.php).
"""
import csv
import ipaddress
import os
import sys


def build(src, dst, version, width):
    rows = []
    with open(src, newline="") as fh:
        for start, end, cc in csv.reader(fh):
            a = int(ipaddress.ip_address(start))
            b = int(ipaddress.ip_address(end))
            cc = cc.strip().upper()
            if len(cc) != 2 or not cc.isalpha() or cc in ("ZZ", "XX"):
                cc = "--"
            rows.append((a, b, cc))
    rows.sort()
    out = []
    nxt = 0
    for a, b, cc in rows:
        if a > nxt:
            out.append((nxt, "--"))
        if not out or out[-1][1] != cc:
            out.append((a, cc))
        nxt = max(nxt, b + 1)
    if nxt < 1 << (8 * width):
        out.append((nxt, "--"))
    with open(dst, "wb") as fh:
        for a, cc in out:
            fh.write(a.to_bytes(width, "big") + cc.encode("ascii"))
    print(f"{dst}: {len(out)} intervalos, {os.path.getsize(dst)} bytes")


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    pkg, version = sys.argv[1], sys.argv[2]
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "geo")
    os.makedirs(root, exist_ok=True)
    build(os.path.join(pkg, "dbip-country-ipv4.csv"), os.path.join(root, "country-ipv4.bin"), version, 4)
    build(os.path.join(pkg, "dbip-country-ipv6.csv"), os.path.join(root, "country-ipv6.bin"), version, 16)
    with open(os.path.join(root, "VERSION"), "w") as fh:
        fh.write(f"DB-IP Lite country (CC BY 4.0, https://db-ip.com/) via @ip-location-db/dbip-country {version}\n")


if __name__ == "__main__":
    main()
