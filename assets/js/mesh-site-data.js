/* Recursos e galeria Mesh Analyzer, em 7 idiomas. */
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
      "Banco SQLite próprio, backup, diagnóstico e atualizações pelo site oficial",
      "Mapa interativo: localização geográfica, marcadores de nós, enlaces RF observados e filtros de visualização para estudar cobertura e conectividade.",
      "Mensagens: canal primário, canais adicionais, conversas privadas, pesquisa histórica, filtros e indicação temporal de envio e recebimento.",
      "Inventário de nós: apelido, nome longo e curto, função, hardware, saltos, bateria, tensão, distância, SNR e horários das últimas interações e posições.",
      "Gerenciamento de conexões: múltiplos perfis USB/Serial, Wi-Fi/TCP, BLE e MQTT com ativação, desativação e descoberta automática quando compatível.",
      "Ranking RF: pares com comunicação direta, distâncias compatíveis, observações registradas, SNR e diagnóstico de elegibilidade.",
      "Estatísticas de chat: total de mensagens, nós participantes e ranking de interações no canal primário.",
      "Filtros de estatísticas: visão geral, rede, RF, routing, tráfego, consultas, chat, energia, repetidores, topologia e MeshCore.",
      "Relatórios e exportação: geração de PDF e CSV para documentação das análises de rede."
    ],
    "historyTitle": "Changelog — últimas 5 versões",
    "historyIntro": "Novidades e correções documentadas no changelog oficial do projeto.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Menu Ferramentas e análise de cobertura",
        "changes": [
          "Novo menu Ferramentas com análise de cobertura (onde o sinal chegaria, a partir de um ponto ou nó), enlace, melhor ponto e relevo com corte com cor ajustável.",
          "Indicador da conexão verde/vermelho com o tipo (USB, BLE, WIFI, MQTT) e automações recolhidas com Salvar/Cancelar."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Aviso do site oficial e aviso de versão nova em sequência",
        "changes": [
          "O aviso do site oficial aparece sempre ao abrir, sem opção de ocultar.",
          "O aviso de versão nova abre logo depois que o aviso é fechado, sem ficar escondido por baixo."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Detecção USB segura para rádios com CAT",
        "changes": [
          "A busca automática abre só portas de placas Meshtastic/MeshCore, sem acionar o PTT de rádios ligados ao PC.",
          "Placas MeshCore cadastradas como Meshtastic passam a conectar sozinhas."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mapa da malha — nós, enlaces RF e topologia visualizados sobre Brasília e região",
      "messages": "Mensagens — canal primário, conversas privadas, pesquisa e confirmações",
      "nodes": "Nós — apelidos, modelos, saltos, bateria, distância, SNR e atividade",
      "connections": "Conexões — perfis de rádios USB/Serial, Wi-Fi/TCP e descoberta automática",
      "rf": "Estatísticas — ranking de enlaces RF e critérios de elegibilidade",
      "chat": "Estatísticas — chat, mensagens e ranking de interações"
    },
    "galleryIntro": "Capturas reais da versão 0.6.58 em funcionamento, mostrando operações e análises da malha."
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
      "Independent SQLite database, backups, diagnostics and official-site updates",
      "Interactive map: node locations, observed RF links and display filters for coverage and network-connectivity analysis.",
      "Messages: primary and secondary channels, private conversations, history search, filters and relative time labels.",
      "Node inventory: nickname, long and short names, role, hardware, hops, battery, voltage, distance, SNR, last interaction and last position.",
      "Connection management: multiple USB/Serial, Wi-Fi/TCP, BLE and MQTT profiles with connect/disconnect and automatic discovery where supported.",
      "RF ranking: directly observed links, compatible distances, recorded observations, SNR and eligibility diagnostics.",
      "Chat analytics: message totals, participating nodes and most active nodes on the primary channel.",
      "Statistics panels: overview, network, RF, routing, traffic, queries, chat, energy, repeaters, topology and MeshCore.",
      "Reports and exports: PDF and CSV output for documenting network analysis."
    ],
    "historyTitle": "Changelog — last 5 versions",
    "historyIntro": "Updates and fixes documented in the official project changelog.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Tools menu and coverage analysis",
        "changes": [
          "New Tools menu with coverage analysis (where the signal would reach, from a point or node), link analysis, best spot and terrain cutoff with adjustable color.",
          "Green/red connection indicator with the type (USB, BLE, WIFI, MQTT) and collapsed automations with Save/Cancel."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Official site notice followed by the update prompt",
        "changes": [
          "The official site notice appears on every start, with no option to hide it.",
          "The new version prompt opens right after the notice is closed instead of hiding behind it."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Safe USB detection for radios with CAT",
        "changes": [
          "Automatic search opens only Meshtastic/MeshCore board ports, so radios connected to the PC no longer key PTT.",
          "MeshCore boards registered as Meshtastic now connect on their own."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mesh map — nodes, RF links and topology around Brasília",
      "messages": "Messages — primary channel, private conversations, search and acknowledgments",
      "nodes": "Nodes — nicknames, hardware, hops, battery, distance, SNR and activity",
      "connections": "Connections — USB/Serial and Wi-Fi/TCP radio profiles and automatic discovery",
      "rf": "Statistics — RF-link ranking and eligibility criteria",
      "chat": "Statistics — chat messages and interaction rankings"
    },
    "galleryIntro": "Real screenshots of version 0.6.58 in use, showing mesh operations and network analysis."
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
      "Base SQLite independiente, copias de seguridad y actualizaciones oficiales",
      "Mapa interactivo: ubicaciones de nodos, enlaces RF observados y filtros para analizar cobertura y conectividad.",
      "Mensajes: canal primario y otros canales, conversaciones privadas, búsqueda histórica, filtros y marcas de tiempo relativas.",
      "Inventario de nodos: apodo, nombres largo y corto, función, hardware, saltos, batería, tensión, distancia, SNR, última interacción y posición.",
      "Gestión de conexiones: varios perfiles USB/serie, Wi-Fi/TCP, BLE y MQTT, con conexión, desconexión y búsqueda automática compatible.",
      "Ranking RF: enlaces directos observados, distancias compatibles, registros, SNR y diagnóstico de elegibilidad.",
      "Estadísticas de chat: número de mensajes, nodos participantes y ranking de actividad en el canal primario.",
      "Paneles de estadísticas: resumen, red, RF, rutas, tráfico, consultas, chat, energía, repetidores, topología y MeshCore.",
      "Informes y exportación: salida PDF y CSV para documentar el análisis de la red."
    ],
    "historyTitle": "Changelog — últimas 5 versiones",
    "historyIntro": "Novedades y correcciones del registro oficial del proyecto.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Menú Herramientas y análisis de cobertura",
        "changes": [
          "Nuevo menú Herramientas con análisis de cobertura (hasta dónde llegaría la señal, desde un punto o nodo), enlace, mejor punto y relieve con corte de color ajustable.",
          "Indicador de conexión verde/rojo con el tipo (USB, BLE, WIFI, MQTT) y automatizaciones contraídas con Guardar/Cancelar."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Aviso del sitio oficial seguido del aviso de nueva versión",
        "changes": [
          "El aviso del sitio oficial aparece siempre al abrir, sin opción de ocultarlo.",
          "El aviso de nueva versión se abre justo después de cerrar el aviso, sin quedar oculto debajo."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Detección USB segura para radios con CAT",
        "changes": [
          "La búsqueda automática abre solo puertos de placas Meshtastic/MeshCore, sin activar el PTT de radios conectadas al PC.",
          "Las placas MeshCore registradas como Meshtastic ahora se conectan solas."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mapa mesh — nodos, enlaces RF y topología en Brasília",
      "messages": "Mensajes — canal primario, mensajes privados, búsqueda y confirmaciones",
      "nodes": "Nodos — apodos, hardware, saltos, batería, distancia, SNR y actividad",
      "connections": "Conexiones — perfiles USB/serie y Wi-Fi/TCP y búsqueda automática",
      "rf": "Estadísticas — clasificación RF y criterios de elegibilidad",
      "chat": "Estadísticas — mensajes de chat y actividad"
    },
    "galleryIntro": "Capturas reales de la versión 0.6.58 en funcionamiento."
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
      "Base SQLite indépendante, sauvegardes et mises à jour officielles",
      "Carte interactive : positions des nœuds, liaisons RF observées et filtres pour analyser couverture et connectivité.",
      "Messagerie : canal principal et autres canaux, messages privés, recherche dans l'historique, filtres et dates relatives.",
      "Inventaire : surnoms, noms long et court, rôle, matériel, sauts, batterie, tension, distance, SNR et derniers échanges/positions.",
      "Connexions : plusieurs profils USB/série, Wi-Fi/TCP, BLE et MQTT, avec activation et détection automatique lorsqu'elle est disponible.",
      "Classement RF : liaisons directes, distances compatibles, observations, SNR et diagnostic d'éligibilité.",
      "Statistiques des messages : volume, participants et nœuds les plus actifs sur le canal principal.",
      "Statistiques : résumé, réseau, RF, routage, trafic, requêtes, chat, énergie, répéteurs, topologie et MeshCore.",
      "Rapports : exports PDF et CSV pour documenter l'analyse du réseau."
    ],
    "historyTitle": "Changelog — 5 dernières versions",
    "historyIntro": "Améliorations et correctifs consignés dans le changelog officiel.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Menu Outils et analyse de couverture",
        "changes": [
          "Nouveau menu Outils avec analyse de couverture (jusqu’où le signal porterait, depuis un point ou un nœud), liaison, meilleur point et relief avec coupure à couleur réglable.",
          "Indicateur de connexion vert/rouge avec le type (USB, BLE, WIFI, MQTT) et automatisations repliées avec Enregistrer/Annuler."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Avis du site officiel suivi de l’avis de nouvelle version",
        "changes": [
          "L’avis du site officiel s’affiche à chaque démarrage, sans option pour le masquer.",
          "L’avis de nouvelle version s’ouvre juste après la fermeture de l’avis, au lieu d’être caché dessous."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Détection USB sûre pour les radios avec CAT",
        "changes": [
          "La recherche automatique n’ouvre que les ports des cartes Meshtastic/MeshCore, sans déclencher le PTT des radios reliées au PC.",
          "Les cartes MeshCore enregistrées comme Meshtastic se connectent désormais seules."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Carte mesh — nœuds, liaisons RF et topologie près de Brasília",
      "messages": "Messages — canal principal, messages privés, recherche et confirmations",
      "nodes": "Nœuds — surnoms, matériel, sauts, batterie, distance, SNR et activité",
      "connections": "Connexions — profils USB/série et Wi-Fi/TCP et découverte automatique",
      "rf": "Statistiques — classement des liaisons RF et critères d'éligibilité",
      "chat": "Statistiques — messages et interactions"
    }
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
      "Eigene SQLite-Datenbank, Sicherung und offizielle Updates",
      "Interaktive Karte: Knotenpositionen, beobachtete RF-Verbindungen und Filter zur Analyse von Abdeckung und Konnektivität.",
      "Nachrichten: primäre und weitere Kanäle, Privatnachrichten, Verlaufssuche, Filter und relative Zeitangaben.",
      "Knoteninventar: Spitzname, Kurz-/Langname, Rolle, Hardware, Hops, Akku, Spannung, Entfernung, SNR, letzte Aktivität und Position.",
      "Verbindungen: mehrere USB/seriell-, Wi-Fi/TCP-, BLE- und MQTT-Profile sowie automatische Erkennung, soweit unterstützt.",
      "RF-Rangliste: direkt beobachtete Verbindungen, plausible Entfernungen, Beobachtungen, SNR und Diagnose.",
      "Chatstatistik: Nachrichtenanzahl, beteiligte Knoten und häufigste Interaktionen auf dem Primärkanal.",
      "Statistikbereiche: Übersicht, Netz, RF, Routing, Verkehr, Anfragen, Chat, Energie, Repeater, Topologie und MeshCore.",
      "Berichte: PDF- und CSV-Export zur Dokumentation der Netzanalyse."
    ],
    "historyTitle": "Changelog — letzte 5 Versionen",
    "historyIntro": "Änderungen und Fehlerbehebungen aus dem offiziellen Changelog.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Werkzeug-Menü und Abdeckungsanalyse",
        "changes": [
          "Neues Werkzeug-Menü mit Abdeckungsanalyse (wohin das Signal reicht, ab einem Punkt oder Knoten), Strecke, bester Standort und Geländeschnitt mit einstellbarer Farbe.",
          "Grün/rote Verbindungsanzeige mit Typ (USB, BLE, WIFI, MQTT) und eingeklappte Automationen mit Speichern/Abbrechen."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Hinweis auf die offizielle Website, danach Update-Hinweis",
        "changes": [
          "Der Hinweis auf die offizielle Website erscheint bei jedem Start, ohne Option zum Ausblenden.",
          "Der Hinweis auf eine neue Version öffnet sich direkt nach dem Schließen, statt darunter verdeckt zu sein."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Sichere USB-Erkennung bei Funkgeräten mit CAT",
        "changes": [
          "Die automatische Suche öffnet nur Ports von Meshtastic/MeshCore-Boards und tastet angeschlossene Funkgeräte nicht mehr per PTT.",
          "Als Meshtastic eingetragene MeshCore-Boards verbinden sich jetzt selbst."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mesh-Karte — Knoten, RF-Verbindungen und Topologie um Brasília",
      "messages": "Nachrichten — Hauptkanal, Privatnachrichten, Suche und Bestätigungen",
      "nodes": "Knoten — Spitznamen, Hardware, Hops, Akku, Entfernung, SNR und Aktivität",
      "connections": "Verbindungen — USB/seriell, Wi-Fi/TCP und automatische Erkennung",
      "rf": "Statistik — RF-Verbindungsrangliste und Eignungskriterien",
      "chat": "Statistik — Nachrichten und Interaktionen"
    }
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
      "Database SQLite autonomo, backup e aggiornamenti ufficiali",
      "Mappa interattiva: posizioni dei nodi, collegamenti RF osservati e filtri per analizzare copertura e connettività.",
      "Messaggi: canale primario e secondari, conversazioni private, ricerca, filtri e orari relativi.",
      "Inventario nodi: soprannome, nome lungo/breve, ruolo, hardware, salti, batteria, tensione, distanza, SNR e ultime attività/posizioni.",
      "Connessioni: più profili USB/seriale, Wi-Fi/TCP, BLE e MQTT, con rilevamento automatico quando supportato.",
      "Classifica RF: collegamenti diretti osservati, distanze compatibili, osservazioni, SNR e diagnostica.",
      "Statistiche chat: messaggi totali, nodi partecipanti e maggiori interazioni sul canale primario.",
      "Statistiche: panoramica, rete, RF, routing, traffico, richieste, chat, energia, ripetitori, topologia e MeshCore.",
      "Report: esportazione PDF e CSV per documentare l'analisi della rete."
    ],
    "historyTitle": "Changelog — ultime 5 versioni",
    "historyIntro": "Novità e correzioni del changelog ufficiale.",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "Menu Strumenti e analisi di copertura",
        "changes": [
          "Nuovo menu Strumenti con analisi di copertura (dove arriverebbe il segnale, da un punto o nodo), collegamento, punto migliore e rilievo con taglio a colore regolabile.",
          "Indicatore di connessione verde/rosso con il tipo (USB, BLE, WIFI, MQTT) e automazioni compresse con Salva/Annulla."
        ]
      },
      {
        "version": "0.6.60",
        "title": "Avviso del sito ufficiale seguito dall’avviso di nuova versione",
        "changes": [
          "L’avviso del sito ufficiale appare a ogni avvio, senza opzione per nasconderlo.",
          "L’avviso di nuova versione si apre subito dopo la chiusura, invece di restare nascosto sotto."
        ]
      },
      {
        "version": "0.6.59",
        "title": "Rilevamento USB sicuro per radio con CAT",
        "changes": [
          "La ricerca automatica apre solo le porte delle schede Meshtastic/MeshCore, senza attivare il PTT delle radio collegate al PC.",
          "Le schede MeshCore registrate come Meshtastic ora si collegano da sole."
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mappa mesh — nodi, collegamenti RF e topologia a Brasília",
      "messages": "Messaggi — canale primario, privati, ricerca e conferme",
      "nodes": "Nodi — soprannomi, hardware, salti, batteria, distanza, SNR e attività",
      "connections": "Connessioni — USB/seriale, Wi-Fi/TCP e rilevamento automatico",
      "rf": "Statistiche — classifica dei collegamenti RF e criteri",
      "chat": "Statistiche — messaggi e interazioni"
    }
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
      "独立 SQLite 数据库、备份与官方网站更新",
      "交互地图：展示节点位置、实际观测的射频链路，并通过过滤器分析覆盖范围和连通性。",
      "消息：主频道和其他频道、私聊、历史搜索、过滤器及相对时间显示。",
      "节点清单：昵称、长短名称、角色、硬件、跳数、电池、电压、距离、SNR、最后活动和位置。",
      "连接管理：USB/串口、Wi-Fi/TCP、BLE 和 MQTT 多配置文件，支持相应的自动发现功能。",
      "RF 排名：直接观测到的链路、有效距离、观测次数、SNR 和链路资格诊断。",
      "聊天统计：消息总数、参与节点及主频道互动排名。",
      "统计面板：概览、网络、RF、路由、流量、查询、聊天、能源、中继、拓扑和 MeshCore。",
      "报表：导出 PDF 与 CSV 以记录网络分析结果。"
    ],
    "historyTitle": "更新日志 — 最近 5 个版本",
    "historyIntro": "根据项目官方更新日志整理的功能与修复。",
    "changelog": [
      {
        "version": "0.6.61",
        "title": "工具菜单与覆盖分析",
        "changes": [
          "新增工具菜单：覆盖分析（从某点或节点推算信号可达范围）、链路分析、最佳位置以及可调颜色的地形截断。",
          "连接指示灯改为绿/红并显示类型（USB、BLE、WIFI、MQTT），自动化改为折叠并带保存/取消。"
        ]
      },
      {
        "version": "0.6.60",
        "title": "官方网站提示后显示新版本通知",
        "changes": [
          "每次启动都会显示官方网站提示，且无法隐藏。",
          "关闭提示后立即显示新版本通知，不再被遮挡。"
        ]
      },
      {
        "version": "0.6.59",
        "title": "对带 CAT 的电台安全进行 USB 检测",
        "changes": [
          "自动搜索仅打开 Meshtastic/MeshCore 开发板端口，不再触发连接电脑的电台 PTT。",
          "登记为 Meshtastic 的 MeshCore 开发板现在可自动连接。"
        ]
      },
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
      }
    ],
    "captions": {
      "map": "Mesh 地图 — Brasília 地区的节点、RF 链路与拓扑",
      "messages": "消息 — 主频道、私聊、搜索与确认状态",
      "nodes": "节点 — 昵称、硬件、跳数、电池、距离、SNR 与活动",
      "connections": "连接 — USB/串口、Wi-Fi/TCP 和自动发现",
      "rf": "统计 — RF 链路排名与资格评估",
      "chat": "统计 — 聊天消息与互动排行"
    }
  }
};
