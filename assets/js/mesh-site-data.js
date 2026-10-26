/* PT2VHF Mesh Analyzer: apresentação e últimas cinco versões, 7 idiomas. */
window.PT2VHF_MESH_SITE = {
  "pt": {
    "summary": "Analise nós Meshtastic e MeshCore, enlaces RF, mensagens, tráfego e telemetria.",
    "tagline": "Entenda sua rede mesh, do rádio ao mapa",
    "description": [
      "PT2VHF Mesh Analyzer é um aplicativo independente para monitorar e analisar redes mesh. Mantém um banco de dados SQLite próprio para reunir informações de rádios Meshtastic e integrações MeshCore, sem depender do MeshMonitor.",
      "Conecte um rádio por USB/serial, Bluetooth LE ou Wi-Fi/TCP. MQTT pode ser usado para recepção de dados. O mapa permite observar nós, atividade e enlaces de rádio, diferenciando comunicação RF comprovada de rotas inferidas.",
      "Além do monitoramento, dispõe de mensagens, consultas a nós, Ping, Traceroute, telemetria, automações, estatísticas e relatórios para Windows, Linux e macOS."
    ],
    "features": [
      "Conexões USB/serial, Bluetooth LE e Wi-Fi/TCP; MQTT somente para recepção",
      "Mapa de nós, enlaces RF, topologia, relevo e camadas meteorológicas",
      "Lista de nós, favoritos, RSSI, SNR e última atividade",
      "Mensagens privadas e de canais com indicadores conforme os retornos do rádio",
      "Node Info, posição, telemetria, Ping e Traceroute, individualmente ou em lote",
      "Histórico de tráfego, estatísticas, exportação e relatórios PDF",
      "Automações periódicas para consultas e diagnóstico da rede",
      "Recursos Meshtastic e MeshCore com perfis por conexão",
      "Banco SQLite próprio, backup, diagnóstico e atualizações pelo site oficial"
    ],
    "historyTitle": "Histórico de versões — últimas 5",
    "historyIntro": "Novidades e correções documentadas no changelog oficial do projeto.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Downloads e atualização no site oficial",
        "changes": [
          "Atualizador e pacotes passam a usar www.PT2VHF.com, com verificação SHA-256.",
          "Popup inicial no idioma configurado e integração com o contador por instalador."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Contagem histórica de downloads",
        "changes": [
          "Implementado histórico acumulado por tipo de pacote nas releases do GitHub.",
          "Indicadores específicos para Windows, macOS e Linux."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Favoritos sem reenvio contínuo",
        "changes": [
          "Eliminados comandos de favoritos repetidos a cada minuto.",
          "Nova tentativa de sincronização apenas após reconexão."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Apelidos nos nós",
        "changes": [
          "Nome local amigável passou a ser chamado de Apelido na lista e no painel.",
          "Exibição do apelido junto do nome real do nó."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Cores das conexões",
        "changes": [
          "USB verde, Bluetooth azul, Wi-Fi laranja e MQTT violeta.",
          "Melhoria dos indicadores no menu de rádio e nos temas."
        ]
      }
    ]
  },
  "en": {
    "summary": "Analyze Meshtastic and MeshCore nodes, RF links, traffic, messages and telemetry.",
    "tagline": "Understand your mesh network, from radio to map",
    "description": [
      "PT2VHF Mesh Analyzer is a standalone mesh-network monitoring and analysis application. It uses its own SQLite database for data collected from Meshtastic radios and MeshCore integrations, independently of MeshMonitor.",
      "Connect a radio via USB/serial, Bluetooth LE or Wi-Fi/TCP. MQTT supports receive-only monitoring. See nodes, activity and observed radio links on the map, distinguishing confirmed RF observations from inferred routes.",
      "Additional features include messages, node queries, Ping, Traceroute, telemetry, automation, statistics and reports on Windows, Linux and macOS."
    ],
    "features": [
      "USB/serial, Bluetooth LE and Wi-Fi/TCP; receive-only MQTT",
      "Node maps, RF links, network topology, terrain and weather overlays",
      "Node lists, favorites, RSSI, SNR and last activity",
      "Channel and private messages with radio-dependent delivery indicators",
      "Node Info, position, telemetry, Ping and Traceroute, individually or in batches",
      "Traffic history, statistics, data exports and PDF reports",
      "Scheduled automations for queries and network diagnostics",
      "Meshtastic and MeshCore features with per-connection profiles",
      "Independent SQLite database, backups, diagnostics and official-site updates"
    ],
    "historyTitle": "Release notes — latest 5 versions",
    "historyIntro": "Updates and fixes documented in the official project changelog.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Official website downloads and updates",
        "changes": [
          "The updater and installers move to www.PT2VHF.com with SHA-256 verification.",
          "A localized startup notice and installer download tracking are introduced."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Historical download counts",
        "changes": [
          "Introduced cumulative download statistics by package type for GitHub releases.",
          "Separate Windows, macOS and Linux indicators."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Stop repeated favorite commands",
        "changes": [
          "Prevented favorite commands from being sent again every minute.",
          "Synchronization is retried after reconnection only."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Node nicknames",
        "changes": [
          "Local friendly names were renamed to nicknames in node lists and details.",
          "Nicknames appear alongside actual node names."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Connection colors",
        "changes": [
          "USB green, Bluetooth blue, Wi-Fi orange and MQTT purple.",
          "Better indicators in the radio menu and themes."
        ]
      }
    ]
  },
  "es": {
    "summary": "Analice nodos Meshtastic y MeshCore, enlaces RF, tráfico, mensajes y telemetría.",
    "tagline": "Comprenda su red mesh, de la radio al mapa",
    "description": [
      "PT2VHF Mesh Analyzer es una aplicación independiente para supervisar y analizar redes mesh. Almacena datos de radios Meshtastic e integraciones MeshCore en su propia base SQLite, sin depender de MeshMonitor.",
      "Conecte una radio por USB/serie, Bluetooth LE o Wi-Fi/TCP; MQTT permite supervisión solo de recepción. El mapa muestra nodos, actividad y enlaces observados, distinguiendo enlaces RF comprobados de rutas inferidas.",
      "También ofrece mensajes, consultas de nodos, Ping, Traceroute, telemetría, automatizaciones, estadísticas e informes en Windows, Linux y macOS."
    ],
    "features": [
      "USB/serie, Bluetooth LE y Wi-Fi/TCP; MQTT solo para recepción",
      "Mapa de nodos, enlaces RF, topología, relieve y meteorología",
      "Lista de nodos, favoritos, RSSI, SNR y última actividad",
      "Mensajes de canal y privados con indicadores según la radio",
      "Node Info, posición, telemetría, Ping y Traceroute individuales o en lote",
      "Historial de tráfico, estadísticas, exportaciones e informes PDF",
      "Automatizaciones periódicas para consultas y diagnósticos",
      "Funciones Meshtastic y MeshCore con perfiles por conexión",
      "Base SQLite independiente, copias de seguridad y actualizaciones oficiales"
    ],
    "historyTitle": "Historial de versiones — últimas 5",
    "historyIntro": "Novedades y correcciones del registro oficial del proyecto.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Descargas y actualizaciones oficiales",
        "changes": [
          "El actualizador y los instaladores utilizan www.PT2VHF.com y validación SHA-256.",
          "Aviso inicial traducido e integración con contadores por instalador."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Conteo histórico de descargas",
        "changes": [
          "Conteo acumulado por tipo de paquete en las versiones de GitHub.",
          "Indicadores independientes para Windows, macOS y Linux."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Favoritos sin reenvíos continuos",
        "changes": [
          "Se evitan órdenes de favoritos repetidas cada minuto.",
          "La sincronización se repite únicamente al reconectar."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Apodos de los nodos",
        "changes": [
          "El nombre local amigable pasa a llamarse Apodo.",
          "Apodo y nombre real aparecen juntos."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Colores de conexión",
        "changes": [
          "USB verde, Bluetooth azul, Wi-Fi naranja y MQTT violeta.",
          "Mejor indicación de conexión en el menú de radio y en los temas."
        ]
      }
    ]
  },
  "fr": {
    "summary": "Analysez les nœuds Meshtastic et MeshCore, liaisons RF, trafic, messages et télémétrie.",
    "tagline": "Comprenez votre réseau maillé, de la radio à la carte",
    "description": [
      "PT2VHF Mesh Analyzer est une application autonome de surveillance et d’analyse des réseaux maillés. Elle stocke les données Meshtastic et MeshCore dans sa propre base SQLite, indépendamment de MeshMonitor.",
      "Connectez une radio par USB/série, Bluetooth LE ou Wi-Fi/TCP. MQTT fonctionne en réception uniquement. La carte montre les nœuds, l’activité et les liaisons observées, en séparant les observations RF avérées des routes estimées.",
      "Elle comprend aussi messagerie, requêtes de nœuds, Ping, Traceroute, télémétrie, automatisations, statistiques et rapports sur Windows, Linux et macOS."
    ],
    "features": [
      "USB/série, Bluetooth LE et Wi-Fi/TCP ; MQTT en réception uniquement",
      "Carte des nœuds, liaisons RF, topologie, relief et météo",
      "Liste des nœuds, favoris, RSSI, SNR et activité récente",
      "Messages privés et de canal avec indicateurs selon la radio",
      "Node Info, position, télémétrie, Ping et Traceroute, seuls ou en lots",
      "Historique du trafic, statistiques, exports et rapports PDF",
      "Automatisations périodiques pour les diagnostics",
      "Fonctions Meshtastic et MeshCore avec profils par connexion",
      "Base SQLite indépendante, sauvegardes et mises à jour officielles"
    ],
    "historyTitle": "Historique des versions — les 5 dernières",
    "historyIntro": "Améliorations et correctifs consignés dans le changelog officiel.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Téléchargements sur le site officiel",
        "changes": [
          "Mises à jour et installateurs sur www.PT2VHF.com avec contrôle SHA-256.",
          "Avis traduit au démarrage et compteurs par installateur."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Statistiques historiques des téléchargements",
        "changes": [
          "Total cumulatif par type de paquet pour les releases GitHub.",
          "Indicateurs distincts Windows, macOS et Linux."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Synchronisation des favoris corrigée",
        "changes": [
          "Fin des commandes de favoris répétées chaque minute.",
          "Nouvelle synchronisation uniquement après reconnexion."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Surnoms des nœuds",
        "changes": [
          "Le nom local devient un surnom dans la liste et la fiche.",
          "Surnom et nom réel s’affichent ensemble."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Couleurs de connexion",
        "changes": [
          "USB vert, Bluetooth bleu, Wi-Fi orange et MQTT violet.",
          "Indicateurs améliorés dans le menu radio et les thèmes."
        ]
      }
    ]
  },
  "de": {
    "summary": "Meshtastic- und MeshCore-Knoten, RF-Verbindungen, Verkehr, Nachrichten und Telemetrie analysieren.",
    "tagline": "Verstehen Sie Ihr Mesh-Netz, vom Funkgerät bis zur Karte",
    "description": [
      "PT2VHF Mesh Analyzer überwacht und analysiert Mesh-Netze eigenständig. Die Anwendung speichert Daten von Meshtastic-Funkgeräten und MeshCore-Integrationen in einer eigenen SQLite-Datenbank, unabhängig von MeshMonitor.",
      "Funkgeräte können über USB/seriell, Bluetooth LE oder Wi-Fi/TCP verbunden werden; MQTT ist nur für den Empfang vorgesehen. Die Karte unterscheidet bestätigte RF-Beobachtungen von abgeleiteten Routen.",
      "Außerdem unterstützt das Programm Nachrichten, Knotenabfragen, Ping, Traceroute, Telemetrie, Automatisierungen, Statistiken und Berichte unter Windows, Linux und macOS."
    ],
    "features": [
      "USB/seriell, Bluetooth LE und Wi-Fi/TCP; MQTT nur zum Empfang",
      "Knotenkarte, RF-Strecken, Topologie, Gelände und Wetter",
      "Knotenlisten, Favoriten, RSSI, SNR und letzte Aktivität",
      "Kanal- und Privatnachrichten mit geräteabhängiger Zustellanzeige",
      "Node Info, Position, Telemetrie, Ping und Traceroute, einzeln oder gesammelt",
      "Verkehrsverlauf, Statistiken, Export und PDF-Berichte",
      "Zeitgesteuerte Netzwerkabfragen und Diagnose",
      "Meshtastic- und MeshCore-Funktionen mit Verbindungsprofilen",
      "Eigene SQLite-Datenbank, Sicherung und offizielle Updates"
    ],
    "historyTitle": "Versionsverlauf — letzte 5 Versionen",
    "historyIntro": "Änderungen und Fehlerbehebungen aus dem offiziellen Changelog.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Downloads und Updates über die offizielle Website",
        "changes": [
          "Updater und Installationspakete über www.PT2VHF.com mit SHA-256-Prüfung.",
          "Mehrsprachiger Startdialog und Zähler pro Paket."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Historische Downloadstatistik",
        "changes": [
          "Kumulierte Zählung pro Paketart für GitHub-Releases.",
          "Separate Anzeigen für Windows, macOS und Linux."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Favoriten ohne dauernde Wiederholung",
        "changes": [
          "Favoritenbefehle werden nicht jede Minute wiederholt.",
          "Erneuter Abgleich erst nach einer Wiederverbindung."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Spitznamen der Knoten",
        "changes": [
          "Lokale Anzeigenamen heißen jetzt Spitznamen.",
          "Spitzname und tatsächlicher Name werden zusammen gezeigt."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Farben der Verbindungen",
        "changes": [
          "USB grün, Bluetooth blau, Wi-Fi orange und MQTT violett.",
          "Klarere Anzeigen im Funkgeräte-Menü und in den Designs."
        ]
      }
    ]
  },
  "it": {
    "summary": "Analizza nodi Meshtastic e MeshCore, collegamenti RF, traffico, messaggi e telemetria.",
    "tagline": "Comprendi la rete mesh, dalla radio alla mappa",
    "description": [
      "PT2VHF Mesh Analyzer è un'applicazione indipendente per monitorare e analizzare reti mesh. Salva i dati Meshtastic e MeshCore in un proprio database SQLite, senza dipendere da MeshMonitor.",
      "Collega una radio tramite USB/seriale, Bluetooth LE o Wi-Fi/TCP. MQTT permette il monitoraggio in sola ricezione. La mappa distingue i collegamenti RF osservati dai percorsi dedotti.",
      "Offre inoltre messaggi, interrogazioni dei nodi, Ping, Traceroute, telemetria, automazioni, statistiche e report per Windows, Linux e macOS."
    ],
    "features": [
      "USB/seriale, Bluetooth LE e Wi-Fi/TCP; MQTT solo ricezione",
      "Mappa nodi, collegamenti RF, topologia, rilievo e meteo",
      "Elenco nodi, preferiti, RSSI, SNR e ultima attività",
      "Messaggi privati e di canale con indicatori basati sulla radio",
      "Node Info, posizione, telemetria, Ping e Traceroute singoli o in gruppo",
      "Cronologia traffico, statistiche, esportazioni e report PDF",
      "Automazioni periodiche per query e diagnostica",
      "Funzioni Meshtastic e MeshCore con profili per connessione",
      "Database SQLite autonomo, backup e aggiornamenti ufficiali"
    ],
    "historyTitle": "Cronologia versioni — ultime 5",
    "historyIntro": "Novità e correzioni del changelog ufficiale.",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "Download e aggiornamenti ufficiali",
        "changes": [
          "Aggiornamenti e installatori tramite www.PT2VHF.com con verifica SHA-256.",
          "Avviso iniziale localizzato e contatori per installatore."
        ]
      },
      {
        "version": "0.6.57",
        "title": "Statistiche storiche dei download",
        "changes": [
          "Conteggio cumulativo per tipo di pacchetto nelle release GitHub.",
          "Indicatori specifici per Windows, macOS e Linux."
        ]
      },
      {
        "version": "0.6.56",
        "title": "Preferiti senza invii ripetuti",
        "changes": [
          "Rimossi i comandi preferiti ripetuti ogni minuto.",
          "Risincronizzazione solo dopo la riconnessione."
        ]
      },
      {
        "version": "0.6.55",
        "title": "Soprannomi dei nodi",
        "changes": [
          "Il nome locale viene mostrato come Soprannome.",
          "Soprannome e nome reale sono visibili insieme."
        ]
      },
      {
        "version": "0.6.54",
        "title": "Colori delle connessioni",
        "changes": [
          "USB verde, Bluetooth blu, Wi-Fi arancione, MQTT viola.",
          "Indicatori migliorati nel selettore radio e nei temi."
        ]
      }
    ]
  },
  "zh": {
    "summary": "分析 Meshtastic 与 MeshCore 节点、RF 链路、流量、消息和遥测。",
    "tagline": "从无线电设备到地图，了解您的 Mesh 网络",
    "description": [
      "PT2VHF Mesh Analyzer 是独立的 Mesh 网络监控与分析软件。它将 Meshtastic 无线电和 MeshCore 集成数据保存到自己的 SQLite 数据库，不依赖 MeshMonitor。",
      "可通过 USB/串口、低功耗蓝牙或 Wi-Fi/TCP 连接无线电设备；MQTT 仅用于接收监控。地图可区分直接观测到的 RF 链路与推测的路径。",
      "软件还提供消息、节点查询、Ping、Traceroute、遥测、自动化、统计和报告，适用于 Windows、Linux 与 macOS。"
    ],
    "features": [
      "USB/串口、BLE、Wi-Fi/TCP；MQTT 仅接收",
      "节点地图、RF 链路、网络拓扑、地形和气象图层",
      "节点列表、收藏、RSSI、SNR 和最近活动时间",
      "频道与私聊消息，按设备反馈显示送达状态",
      "单个或批量 Node Info、位置、遥测、Ping 与 Traceroute",
      "流量历史、统计、导出和 PDF 报告",
      "周期性网络查询与诊断自动任务",
      "Meshtastic 和 MeshCore 功能，按连接保存配置",
      "独立 SQLite 数据库、备份与官方网站更新"
    ],
    "historyTitle": "版本更新记录 — 最近 5 个版本",
    "historyIntro": "根据项目官方更新日志整理的功能与修复。",
    "changelog": [
      {
        "version": "0.6.58",
        "title": "通过官方网站分发",
        "changes": [
          "更新与安装包改用 www.PT2VHF.com，并验证 SHA-256。",
          "启动提示支持当前语言，并记录各安装包下载次数。"
        ]
      },
      {
        "version": "0.6.57",
        "title": "历史累计下载数",
        "changes": [
          "按软件包类型记录 GitHub 历史发行版本的下载量。",
          "分别统计 Windows、macOS 和 Linux。"
        ]
      },
      {
        "version": "0.6.56",
        "title": "收藏同步不再持续重发",
        "changes": [
          "避免每分钟重复发送收藏命令。",
          "只在重新连接后重试同步。"
        ]
      },
      {
        "version": "0.6.55",
        "title": "节点昵称",
        "changes": [
          "本地友好名称改为昵称。",
          "昵称与原节点名称同时显示。"
        ]
      },
      {
        "version": "0.6.54",
        "title": "连接颜色",
        "changes": [
          "USB 绿色、蓝牙蓝色、Wi-Fi 橙色和 MQTT 紫色。",
          "改善无线电菜单与主题中的状态标识。"
        ]
      }
    ]
  }
};
