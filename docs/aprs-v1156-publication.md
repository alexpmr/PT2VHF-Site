# APRS Client v1.15.6 publication

Source commit: `92e633714f43856c4929e27f25423da8b6a543e3` (tag `v1.15.6`).
Full build: https://github.com/alexpmr/PT2VHF-APRS-Client/actions/runs/41261573176
Six-language UI regression: https://github.com/alexpmr/PT2VHF-APRS-Client/actions/runs/41261573154
Release: https://github.com/alexpmr/PT2VHF-APRS-Client/releases/tag/v1.15.6
Site binaries/manifest commit: `d19c91a183bd2b1c9fec4e27ca77a2fab959df94`.

On 2026-11-01 the public Hostinger domain returned v1.15.6 in both
`updates.json` and `update.php?product=aprs`, with nine expected files.
All nine files were downloaded from the real domain, and their complete
SHA-256 hashes and sizes matched the committed manifest and OTA metadata.
Verification used `pt2vhf_raw=1` to avoid inflating download counters.

The initial publication workflow timed out waiting for Hostinger propagation;
that early failure must not be treated as successful deployment. The later
full verification confirmed the actual served binaries after propagation.

Issue #157 remains open: dynamic translation fixes, the six reference flags,
30 keyed translations and browser regressions are delivered; comprehensive
review of all visible static/dynamic strings and modals is still pending.
