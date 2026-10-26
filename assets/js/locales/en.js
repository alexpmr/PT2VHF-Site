window.PT2VHF_I18N = window.PT2VHF_I18N || {};
window.PT2VHF_I18N["en"] = {
  "ui": {
    "navInstallation": "Installation",
    "navContact": "Contact",
    "language": "Language",
    "homeEyebrow": "PT2VHF · APRS · HF/VHF/UHF · MESH · SAT · CAT",
    "homeTitle": "Amateur radio software. Five projects, one station.",
    "homeLead": "Real-time APRS, propagation analysis, Meshtastic topology, satellite tracking and radio programming. Explore the tools and available installers.",
    "homeExplore": "Explore projects",
    "homeKnow": "Discover the software",
    "catalogTitle": "PT2VHF projects",
    "catalogIntro": "A quick introduction to each application. Open its dedicated page for features, screenshots, requirements and downloads.",
    "catalogUpdated": "Catalog checked on",
    "installationTitle": "Install in 3 steps",
    "step1Title": "Download the installer",
    "step1Desc": "Open the project page, choose an available package and save it to your computer.",
    "step2Title": "Run the setup wizard",
    "step2Desc": "If Windows shows a security warning, verify the source of the installer before running it.",
    "step3Title": "Connect your equipment",
    "step3Desc": "Use a compatible cable, TNC or radio and select the correct interface in the application.",
    "downloadWarning": "Download official files only. Do not run installers received from unknown sources.",
    "aboutTitle": "About PT2VHF",
    "aboutText1": "PT2VHF is a Brazilian amateur radio callsign focused on VHF/UHF, digital communications and mesh networks. These tools were created to solve real operating needs and shared with the community.",
    "aboutText2": "Suggestions, bug reports and improvement ideas are welcome.",
    "contactTitle": "Contact",
    "contactIntro": "Get in touch with PT2VHF.",
    "contactButton": "Send email",
    "footerRights": "All rights reserved.",
    "detailHome": "Home",
    "downloadsButton": "View downloads",
    "featuresButton": "Explore features",
    "relatedTitle": "Other PT2VHF projects",
    "relatedDesc": "Discover more tools for your station and the amateur radio community.",
    "allProjects": "Back to all projects",
    "helpTitle": "Need help or have a suggestion?",
    "helpDesc": "Contact the PT2VHF developer.",
    "helpButton": "Contact us",
    "screenshots": "Screenshots",
    "screenshotsPending": "Real screenshots of this project have not been published yet.",
    "screenshotsIntro": "Actual application screenshots.",
    "visualIdentityOnly": "Project branding only. Screenshots are not published yet.",
    "downloadsTitle": "Downloads",
    "featuresTitle": "Features",
    "supportedTitle": "Supported radios and equipment",
    "requirementsTitle": "Requirements",
    "releasePending": "Release pending",
    "unreleased": "Installer pending",
    "versionCode": "Version identified in source code:",
    "notReleased": "not a published download on this site.",
    "cardOpen": "View project",
    "launchDate": "Released on",
    "catCategory": "Category",
    "catFile": "File",
    "catVersion": "Version",
    "catSize": "Size",
    "download": "Download",
    "downloadsCount": "cumulative downloads",
    "counterUnavailable": "Counter unavailable",
    "loadError": "Unable to load downloads. Refresh the page.",
    "winInstaller": "Windows — Installer",
    "winPortable": "Windows — Portable",
    "linuxDeb": "Linux — .deb",
    "linuxTar": "Linux — .tar.gz",
    "macOS": "macOS",
    "statProg": "Official Windows and Linux installers are available.",
    "statProp": "Windows packages were built, but automated validation failed. No approved public installer yet.",
    "statMesh": "No public installer or matching repository has been confirmed in this GitLab account.",
    "statAprs": "Windows and Linux packages were built on GitLab. Artifacts are private and temporary; public distribution is pending.",
    "statSat": "Windows build blocked by a Qt WebEngine dependency. Awaiting a verified installer.",
    "ciLink": "Build details (GitLab access may be required)",
    "detailsProgInstaller": "Windows 10/11 64-bit (recommended)",
    "detailsProgPortable": "Windows 10/11 64-bit, no installation",
    "detailsProgDeb": "Ubuntu 22.04+, Debian 12+, Mint 21+",
    "detailsProgTar": "Other distributions and macOS (Python 3.10+ with Tkinter)"
  },
  "captions": {
    "propOverview": "Main dashboard — dark theme",
    "propBands": "Band analysis",
    "propMap": "Propagation map — light theme",
    "progHome": "Radio selection",
    "progMemories": "TS-2000 memory programming",
    "progDisplay": "Live TS-2000 display",
    "progIcom": "Icom radio programming",
    "aprsBrand": "APRS Client branding",
    "satBrand": "SAT Tool branding"
  },
  "products": {
    "prog": {
      "summary": "Program, back up and manage memories and settings on Kenwood and Icom radios.",
      "tagline": "Kenwood TS-2000 and Icom ID-51A Plus2 / ID-880H",
      "description": [
        "PT2VHF Prog Tool is a desktop application for programming radios over a serial interface. Select Kenwood TS-2000 or Icom ID-51A Plus2 / ID-880H from its opening screen.",
        "Read, edit, back up and write radio memories and settings on your computer instead of programming each channel from the front panel.",
        "The TS-2000 is programmed live over CAT: read/write memories 000–299 and menu options, write only modified items and verify changes by reading them back. A separate LCD-style display shows frequency, signal strength and status about five times per second.",
        "Icom radios use cloning: read the whole radio image, edit channels and write it back. Fields not edited by the software are preserved. The .icf files are compatible with Icom software and CHIRP.",
        "Icom formats were cross-checked against CHIRP code, but have not yet been tested with physical radios. Save an .icf backup before the first write. The application is free software licensed under GPLv3."
      ],
      "features": [
        "TS-2000: memories 000–299, RX/TX frequency, split, mode, shift/offset, tone/CTCSS/DCS, step, group, lockout and name",
        "TS-2000: described menu values and EX000–EX099 discovery scan with no writes",
        "Read/write all settings, only memories, menus, selections or modified entries, with verification",
        "Live display: seven-segment frequency, S-meter (power on TX), VFO B, RIT/XIT, SPLIT, themes and fullscreen",
        "Icom: frequency, duplex/offset, FM/NFM/AM/NAM/DV, tones, DTCS, tuning step, skip, banks A–Z and names",
        "D-STAR: UR, RPT1, RPT2, digital code and ID-51 DSQL/CSQL squelch",
        "Files: .ts2k projects, CSV import/export and .icf images (CS-51PLUS2, CS-80/880 and CHIRP)",
        "SIMULATOR serial port for tests without a radio, plus CAT diagnostic logs"
      ],
      "supported": [
        {
          "name": "Kenwood TS-2000",
          "detail": "Live CAT programming over a serial port"
        },
        {
          "name": "Icom ID-51A Plus2",
          "detail": "Cloning using CS-51PLUS2/CHIRP .icf files"
        },
        {
          "name": "Icom ID-880H",
          "detail": "Cloning using CS-80/880/CHIRP .icf files"
        }
      ],
      "requirements": [
        "64-bit Windows 10/11: installer or portable edition, no Python installation required",
        "Linux: .deb for Ubuntu 22.04+, Debian 12+ or Mint 21+ (python3-tk and python3-serial); other systems and macOS through .tar.gz with Python 3.10+ and Tkinter",
        "TS-2000: straight DB-9 serial cable or FTDI/Prolific USB adapter, matching radio menu 56 (default 9600, 8N1) and RTS/CTS flow control",
        "Icom ID-51A Plus2 / ID-880H: suitable cloning/data cable (e.g. OPC-2218LU for ID-51) and the radio in clone mode",
        "Manufacturer's USB-serial driver (FTDI, Prolific, Silicon Labs or Icom)"
      ]
    },
    "prop": {
      "summary": "Analyze HF/VHF/UHF propagation and estimate link and coverage conditions.",
      "tagline": "Propagation and links on HF/VHF/UHF",
      "description": "Plan radio paths and estimate station/repeater coverage using terrain profiles, Fresnel clearance and path-loss calculations.",
      "features": [
        "Terrain profiles between two points",
        "Fresnel zone and line-of-sight analysis",
        "Link budget and path loss",
        "Estimated coverage map"
      ]
    },
    "mesh": {
      "summary": "Inspect Meshtastic nodes, RF links, traffic and network telemetry.",
      "tagline": "Understand your mesh network",
      "description": "Track mesh nodes, radio link quality and message routes. Locate potential bottlenecks and weak links.",
      "features": [
        "Node list with SNR, RSSI and last activity",
        "Network map and topology",
        "Traffic history and telemetry",
        "Report export"
      ]
    },
    "aprs": {
      "summary": "Monitor APRS stations, messages and paths over RF and APRS-IS.",
      "tagline": "APRS maps over RF and the Internet",
      "description": "See live APRS stations, objects and messages. Connect to TNC/KISS or APRS-IS, transmit beacons and exchange messages.",
      "features": [
        "Live station map and tracks",
        "Serial/TCP KISS and APRS-IS connections",
        "Position beacon transmission",
        "Acknowledged APRS messages"
      ]
    },
    "sat": {
      "summary": "Track amateur satellites, predict passes and control the TS-2000 over CAT.",
      "tagline": "Amateur satellites, passes and Kenwood TS-2000 CAT",
      "description": [
        "Track amateur satellites with orbital maps, TLE/OMM data, pass predictions and operating frequencies.",
        "Kenwood TS-2000 CAT control compensates Doppler shift on receive and transmit. Automatic tracking requires a serial connection and physical-radio validation."
      ],
      "features": [
        "Orbital map, positions, favorite satellites and AOS/TCA/LOS pass calendar",
        "Frequency and transponder profiles for amateur satellites",
        "Kenwood TS-2000 CAT and Doppler tracking",
        "Station coordinates and Maidenhead Grid Locator",
        "Predicted-versus-actual radio frequency diagnostics",
        "Orbital and frequency data updates"
      ],
      "supported": [
        {
          "name": "Kenwood TS-2000",
          "detail": "CAT control over serial"
        },
        {
          "name": "Amateur radio satellites",
          "detail": "Orbit catalog and operating frequencies"
        }
      ],
      "requirements": [
        "64-bit Windows 10 (1809+) or Windows 11",
        "CAT requires a compatible TS-2000 serial cable and settings",
        "Verify automatic tuning on the actual radio before operational use"
      ]
    }
  }
};
