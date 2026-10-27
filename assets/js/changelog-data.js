/* Changelog (últimas 5 versões) dos projetos sem arquivo próprio de site.
 * Fontes: README do Sat Tool, version_notes.py do APRS Client e notas da
 * versão do Prog Tool em updates.json. Mesh e Prop usam mesh-site-data.js
 * e prop-site.js. Idioma ausente cai para pt. */
(function () {
  "use strict";
  var TITLE = {
    pt: "Changelog — últimas 5 versões", en: "Changelog — last 5 versions",
    es: "Changelog — últimas 5 versiones", fr: "Changelog — 5 dernières versions",
    de: "Changelog — letzte 5 Versionen", it: "Changelog — ultime 5 versioni",
    zh: "更新日志 — 最近 5 个版本"
  };
  var TITLE_ONE = {
    pt: "Changelog", en: "Changelog", es: "Changelog", fr: "Changelog",
    de: "Changelog", it: "Changelog", zh: "更新日志"
  };
  var INTRO = {
    sat: {
      pt: "Evolução do Sat Tool com base no histórico oficial do projeto.",
      en: "Sat Tool evolution, based on the project's official history.",
      es: "Evolución del Sat Tool según el historial oficial del proyecto.",
      fr: "Évolution du Sat Tool d’après l’historique officiel du projet.",
      de: "Entwicklung des Sat Tool laut offizieller Projekthistorie.",
      it: "Evoluzione del Sat Tool secondo la cronologia ufficiale del progetto.",
      zh: "根据项目官方历史整理的 Sat Tool 更新。"
    },
    aprs: {
      pt: "Evolução do APRS Client com base nas notas oficiais de cada versão.",
      en: "APRS Client evolution, based on each version's official notes.",
      es: "Evolución del APRS Client según las notas oficiales de cada versión.",
      fr: "Évolution de l’APRS Client d’après les notes officielles de chaque version.",
      de: "Entwicklung des APRS Client laut offiziellen Versionshinweisen.",
      it: "Evoluzione dell’APRS Client secondo le note ufficiali di ogni versione.",
      zh: "根据各版本官方说明整理的 APRS Client 更新。"
    },
    prog: {
      pt: "Versão publicada no site; as próximas versões serão listadas aqui.",
      en: "Version published on the site; future versions will be listed here.",
      es: "Versión publicada en el sitio; las próximas versiones se listarán aquí.",
      fr: "Version publiée sur le site ; les prochaines versions seront listées ici.",
      de: "Auf der Website veröffentlichte Version; künftige Versionen erscheinen hier.",
      it: "Versione pubblicata sul sito; le prossime versioni saranno elencate qui.",
      zh: "官网已发布的版本；后续版本将在此列出。"
    }
  };
  function e(version, title, changes) { return { version: version, title: title, changes: changes }; }
  var LOG = {
    sat: {
      pt: [
        e("1.3.15", "Satélites padrão e tela mais limpa", ["Instalações novas começam com ISS, IO-86 e SO-50 habilitados; seleções salvas são preservadas.", "Removido o bloco Próxima passagem do satélite selecionado; a tabela de passagens de 36 h continua."]),
        e("1.3.14", "OTA pelo site PT2VHF", ["Atualizações consultadas e baixadas apenas de www.pt2vhf.com, sem redirecionamentos.", "Tamanho e SHA-256 obrigatórios; aviso do novo site oficial ao abrir o programa."]),
        e("1.3.13", "Aviso de nova versão", ["Ao detectar versão nova, pergunta se deseja atualizar agora.", "Depois adia a mesma versão por 24 horas; nada é instalado sem confirmação."]),
        e("1.3.12", "Auto CAT contínuo e passagens compactas", ["Novos destinos FA/FB têm prioridade sobre a leitura periódica, com confirmação e sem PTT.", "Painel de passagens mais compacto; builds somente Windows 10/11 x64."]),
        e("1.3.11", "Previsão comparada ao rádio real", ["Compara o Doppler calculado com FA/FB lidas do TS-2000 cerca de uma vez por segundo.", "Reconcilia automaticamente o rádio quando a frequência real diverge da prevista."])
      ],
      en: [
        e("1.3.15", "Default satellites and a cleaner screen", ["New installs start with ISS, IO-86 and SO-50 enabled; saved selections are kept.", "Removed the next-pass block for the selected satellite; the 36 h pass table remains."]),
        e("1.3.14", "OTA from the PT2VHF site", ["Updates are checked and downloaded only from www.pt2vhf.com, with no redirects.", "Size and SHA-256 required; new official site notice on startup."]),
        e("1.3.13", "New version prompt", ["When a new version is found, asks whether to update now.", "Later postpones the same version for 24 hours; nothing installs without confirmation."]),
        e("1.3.12", "Continuous Auto CAT and compact passes", ["New FA/FB targets take priority over periodic readback, confirmed and without PTT.", "More compact pass panel; builds for Windows 10/11 x64 only."]),
        e("1.3.11", "Prediction compared with the real radio", ["Compares computed Doppler with FA/FB read from the TS-2000 about once per second.", "Automatically reconciles the radio when the actual frequency diverges."])
      ],
      es: [
        e("1.3.15", "Satélites predeterminados y pantalla más limpia", ["Las instalaciones nuevas empiezan con ISS, IO-86 y SO-50 habilitados; las selecciones guardadas se conservan.", "Eliminado el bloque Próxima pasada del satélite seleccionado; la tabla de pasadas de 36 h sigue disponible."]),
        e("1.3.14", "OTA desde el sitio PT2VHF", ["Actualizaciones consultadas y descargadas solo de www.pt2vhf.com, sin redirecciones.", "Tamaño y SHA-256 obligatorios; aviso del nuevo sitio oficial al abrir el programa."]),
        e("1.3.13", "Aviso de nueva versión", ["Al detectar una versión nueva, pregunta si desea actualizar ahora.", "Después pospone la misma versión 24 horas; nada se instala sin confirmación."]),
        e("1.3.12", "Auto CAT continuo y pasadas compactas", ["Los nuevos destinos FA/FB tienen prioridad sobre la lectura periódica, con confirmación y sin PTT.", "Panel de pasadas más compacto; compilaciones solo para Windows 10/11 x64."]),
        e("1.3.11", "Predicción comparada con el radio real", ["Compara el Doppler calculado con FA/FB leídas del TS-2000 aproximadamente cada segundo.", "Reconcilia automáticamente el radio cuando la frecuencia real difiere."])
      ],
      fr: [
        e("1.3.15", "Satellites par défaut et écran épuré", ["Les nouvelles installations démarrent avec ISS, IO-86 et SO-50 activés ; les sélections enregistrées sont conservées.", "Bloc Prochain passage du satellite sélectionné supprimé ; le tableau des passages sur 36 h reste disponible."]),
        e("1.3.14", "Mise à jour OTA via le site PT2VHF", ["Mises à jour vérifiées et téléchargées uniquement depuis www.pt2vhf.com, sans redirection.", "Taille et SHA-256 obligatoires ; annonce du nouveau site officiel au démarrage."]),
        e("1.3.13", "Avis de nouvelle version", ["Lorsqu’une nouvelle version est détectée, propose de mettre à jour maintenant.", "Plus tard reporte la même version de 24 heures ; rien n’est installé sans confirmation."]),
        e("1.3.12", "Auto CAT continu et passages compacts", ["Les nouvelles consignes FA/FB passent avant la relecture périodique, confirmées et sans PTT.", "Panneau des passages plus compact ; versions pour Windows 10/11 x64 uniquement."]),
        e("1.3.11", "Prévision comparée au poste réel", ["Compare le Doppler calculé aux FA/FB lues sur le TS-2000 environ chaque seconde.", "Réaligne automatiquement le poste lorsque la fréquence réelle diverge."])
      ],
      de: [
        e("1.3.15", "Standardsatelliten und aufgeräumte Ansicht", ["Neuinstallationen starten mit ISS, IO-86 und SO-50 aktiviert; gespeicherte Auswahl bleibt erhalten.", "Block Nächster Überflug des gewählten Satelliten entfernt; die 36-h-Überflugtabelle bleibt."]),
        e("1.3.14", "OTA über die PT2VHF-Website", ["Updates werden nur von www.pt2vhf.com geprüft und geladen, ohne Weiterleitungen.", "Größe und SHA-256 Pflicht; Hinweis auf die neue offizielle Website beim Start."]),
        e("1.3.13", "Hinweis auf neue Version", ["Bei einer neuen Version wird gefragt, ob jetzt aktualisiert werden soll.", "Später verschiebt dieselbe Version um 24 Stunden; nichts wird ohne Bestätigung installiert."]),
        e("1.3.12", "Kontinuierliches Auto-CAT und kompakte Überflüge", ["Neue FA/FB-Ziele haben Vorrang vor dem periodischen Rücklesen, bestätigt und ohne PTT.", "Kompakteres Überflugfeld; Builds nur für Windows 10/11 x64."]),
        e("1.3.11", "Vorhersage im Vergleich zum echten Funkgerät", ["Vergleicht den berechneten Doppler etwa sekündlich mit den vom TS-2000 gelesenen FA/FB.", "Gleicht das Funkgerät automatisch ab, wenn die tatsächliche Frequenz abweicht."])
      ],
      it: [
        e("1.3.15", "Satelliti predefiniti e schermata più pulita", ["Le nuove installazioni partono con ISS, IO-86 e SO-50 abilitati; le selezioni salvate restano.", "Rimosso il blocco Prossimo passaggio del satellite selezionato; la tabella dei passaggi a 36 h resta disponibile."]),
        e("1.3.14", "OTA dal sito PT2VHF", ["Aggiornamenti verificati e scaricati solo da www.pt2vhf.com, senza reindirizzamenti.", "Dimensione e SHA-256 obbligatori; avviso del nuovo sito ufficiale all’avvio."]),
        e("1.3.13", "Avviso di nuova versione", ["Quando trova una nuova versione, chiede se aggiornare subito.", "Più tardi rimanda la stessa versione di 24 ore; nulla viene installato senza conferma."]),
        e("1.3.12", "Auto CAT continuo e passaggi compatti", ["I nuovi valori FA/FB hanno priorità sulla rilettura periodica, confermati e senza PTT.", "Pannello passaggi più compatto; build solo per Windows 10/11 x64."]),
        e("1.3.11", "Previsione confrontata con la radio reale", ["Confronta il Doppler calcolato con FA/FB letti dal TS-2000 circa ogni secondo.", "Riallinea automaticamente la radio quando la frequenza reale differisce."])
      ],
      zh: [
        e("1.3.15", "默认卫星与更简洁的界面", ["新安装默认启用 ISS、IO-86 和 SO-50；已保存的选择保持不变。", "移除“所选卫星的下一次过境”区块；36 小时过境表仍然保留。"]),
        e("1.3.14", "通过 PT2VHF 官网 OTA 更新", ["仅从 www.pt2vhf.com 检查并下载更新，不允许重定向。", "必须校验大小和 SHA-256；启动时提示新的官方网站。"]),
        e("1.3.13", "新版本提示", ["发现新版本时询问是否立即更新。", "“稍后”将同一版本推迟 24 小时；未经确认不会安装。"]),
        e("1.3.12", "连续 Auto CAT 与紧凑过境面板", ["新的 FA/FB 目标优先于周期回读，经确认且不触发 PTT。", "过境面板更紧凑；仅提供 Windows 10/11 x64 版本。"]),
        e("1.3.11", "预测与实际电台对比", ["约每秒将计算的多普勒与 TS-2000 回读的 FA/FB 对比。", "实际频率偏离时自动校正电台。"])
      ]
    },
    aprs: {
      pt: [
        e("1.14.59", "Atualização via site PT2VHF", ["O atualizador consulta exclusivamente https://www.pt2vhf.com.", "Tamanho e SHA-256 verificados; links externos e redirecionamentos bloqueados."]),
        e("1.14.58", "Retenção permanente por padrão", ["Todos os itens do banco passam a ser guardados para sempre por padrão.", "Ao atualizar, prazos escolhidos pelo usuário são mantidos; nada é apagado."]),
        e("1.14.57", "Enlaces de estações fixas de volta ao mapa", ["Corrigido: enlaces de digis, iGates e estações fixas sumiam 12 horas após a primeira escuta.", "Enlaces já gravados sem posição são recuperados automaticamente, sem apagar nada."]),
        e("1.14.56", "Enlaces do mapa e diagnóstico", ["Corrigido: estações meteorológicas eram tratadas como móveis porque o vento era lido como velocidade.", "Verificar banco explica quantos enlaces RF existem e por que algum não aparece."]),
        e("1.14.55", "Planejamento de enlaces e melhor ponto", ["Enlace entre 2 pontos com perfil de terreno, Fresnel, sinal estimado e veredito de viabilidade.", "Melhor ponto para instalar estação: topos da área desenhada, com CSV e PDF."])
      ],
      en: [
        e("1.14.59", "Updates from the PT2VHF site", ["The updater checks only https://www.pt2vhf.com.", "Size and SHA-256 verified; external links and redirects blocked."]),
        e("1.14.58", "Permanent retention by default", ["Every database item is now kept forever by default.", "On upgrade, retention periods chosen by the user are kept; nothing is deleted."]),
        e("1.14.57", "Fixed-station links back on the map", ["Fixed: digi, iGate and fixed-station links disappeared 12 hours after first heard.", "Links already stored without position are recovered automatically, without deleting anything."]),
        e("1.14.56", "Map links and diagnostics", ["Fixed: weather stations were treated as mobile because wind was read as speed.", "Check database explains how many RF links exist and why one is hidden."]),
        e("1.14.55", "Link planning and best site", ["Point-to-point link with terrain profile, Fresnel zone, estimated signal and feasibility verdict.", "Best site for a station: peaks inside the drawn area, with CSV and PDF."])
      ],
      es: [
        e("1.14.59", "Actualización desde el sitio PT2VHF", ["El actualizador consulta exclusivamente https://www.pt2vhf.com.", "Tamaño y SHA-256 verificados; enlaces externos y redirecciones bloqueados."]),
        e("1.14.58", "Retención permanente por defecto", ["Todos los elementos de la base se guardan para siempre por defecto.", "Al actualizar se mantienen los plazos elegidos por el usuario; no se borra nada."]),
        e("1.14.57", "Enlaces de estaciones fijas de vuelta al mapa", ["Corregido: los enlaces de digis, iGates y estaciones fijas desaparecían 12 horas después de la primera escucha.", "Los enlaces guardados sin posición se recuperan automáticamente, sin borrar nada."]),
        e("1.14.56", "Enlaces del mapa y diagnóstico", ["Corregido: las estaciones meteorológicas se trataban como móviles porque el viento se leía como velocidad.", "Verificar base explica cuántos enlaces RF hay y por qué alguno no aparece."]),
        e("1.14.55", "Planificación de enlaces y mejor punto", ["Enlace entre 2 puntos con perfil de terreno, Fresnel, señal estimada y veredicto de viabilidad.", "Mejor punto para instalar una estación: cumbres del área dibujada, con CSV y PDF."])
      ],
      fr: [
        e("1.14.59", "Mise à jour via le site PT2VHF", ["Le programme de mise à jour consulte uniquement https://www.pt2vhf.com.", "Taille et SHA-256 vérifiés ; liens externes et redirections bloqués."]),
        e("1.14.58", "Conservation permanente par défaut", ["Tous les éléments de la base sont désormais conservés indéfiniment par défaut.", "Lors de la mise à jour, les durées choisies par l’utilisateur sont conservées ; rien n’est supprimé."]),
        e("1.14.57", "Liaisons des stations fixes de retour sur la carte", ["Corrigé : les liaisons des digis, iGates et stations fixes disparaissaient 12 heures après la première écoute.", "Les liaisons enregistrées sans position sont récupérées automatiquement, sans rien supprimer."]),
        e("1.14.56", "Liaisons de la carte et diagnostic", ["Corrigé : les stations météo étaient traitées comme mobiles car le vent était lu comme une vitesse.", "Vérifier la base indique le nombre de liaisons RF et pourquoi l’une est masquée."]),
        e("1.14.55", "Planification de liaisons et meilleur site", ["Liaison entre 2 points avec profil du terrain, zone de Fresnel, signal estimé et verdict de faisabilité.", "Meilleur site pour une station : sommets de la zone dessinée, avec CSV et PDF."])
      ],
      de: [
        e("1.14.59", "Updates über die PT2VHF-Website", ["Der Updater fragt ausschließlich https://www.pt2vhf.com ab.", "Größe und SHA-256 geprüft; externe Links und Weiterleitungen blockiert."]),
        e("1.14.58", "Standardmäßig dauerhafte Aufbewahrung", ["Alle Datenbankeinträge werden standardmäßig dauerhaft gespeichert.", "Beim Update bleiben vom Benutzer gewählte Fristen erhalten; nichts wird gelöscht."]),
        e("1.14.57", "Verbindungen fester Stationen wieder auf der Karte", ["Behoben: Verbindungen von Digis, iGates und festen Stationen verschwanden 12 Stunden nach dem ersten Empfang.", "Bereits ohne Position gespeicherte Verbindungen werden automatisch wiederhergestellt, ohne Löschungen."]),
        e("1.14.56", "Kartenverbindungen und Diagnose", ["Behoben: Wetterstationen galten als mobil, weil der Wind als Geschwindigkeit gelesen wurde.", "Datenbank prüfen zeigt, wie viele RF-Verbindungen es gibt und warum eine verborgen ist."]),
        e("1.14.55", "Verbindungsplanung und bester Standort", ["Punkt-zu-Punkt-Verbindung mit Geländeprofil, Fresnelzone, geschätztem Signal und Machbarkeitsurteil.", "Bester Standort für eine Station: Gipfel im gezeichneten Bereich, mit CSV und PDF."])
      ],
      it: [
        e("1.14.59", "Aggiornamento dal sito PT2VHF", ["L’aggiornamento consulta esclusivamente https://www.pt2vhf.com.", "Dimensione e SHA-256 verificati; link esterni e reindirizzamenti bloccati."]),
        e("1.14.58", "Conservazione permanente predefinita", ["Tutti gli elementi del database sono ora conservati per sempre per impostazione predefinita.", "All’aggiornamento restano i periodi scelti dall’utente; nulla viene cancellato."]),
        e("1.14.57", "Collegamenti delle stazioni fisse di nuovo sulla mappa", ["Corretto: i collegamenti di digi, iGate e stazioni fisse sparivano 12 ore dopo il primo ascolto.", "I collegamenti salvati senza posizione vengono recuperati automaticamente, senza cancellare nulla."]),
        e("1.14.56", "Collegamenti della mappa e diagnostica", ["Corretto: le stazioni meteo erano trattate come mobili perché il vento veniva letto come velocità.", "Verifica database spiega quanti collegamenti RF esistono e perché uno non appare."]),
        e("1.14.55", "Pianificazione dei collegamenti e punto migliore", ["Collegamento tra 2 punti con profilo del terreno, zona di Fresnel, segnale stimato e verdetto di fattibilità.", "Punto migliore per una stazione: cime dell’area disegnata, con CSV e PDF."])
      ],
      zh: [
        e("1.14.59", "通过 PT2VHF 官网更新", ["更新程序仅查询 https://www.pt2vhf.com。", "校验大小和 SHA-256；阻止外部链接和重定向。"]),
        e("1.14.58", "默认永久保留", ["数据库中的所有项目默认永久保存。", "升级时保留用户自选的保留期限，不删除任何数据。"]),
        e("1.14.57", "固定台站链路重新显示在地图上", ["修复：数字中继、iGate 和固定台站的链路在首次收听 12 小时后消失。", "已保存但缺少位置的链路会自动恢复，不删除任何数据。"]),
        e("1.14.56", "地图链路与诊断", ["修复：气象站因风速被当作移动速度而被视为移动台。", "“检查数据库”说明 RF 链路数量以及某条链路为何被隐藏。"]),
        e("1.14.55", "链路规划与最佳站址", ["两点间链路：地形剖面、菲涅耳区、估算信号和可行性结论。", "最佳站址：在绘制区域内列出山顶，并支持 CSV 和 PDF。"])
      ]
    },
    prog: {
      pt: [e("1.2.0", "Novo nome: PT2VHF Prog Tool", ["O programa passa a se chamar PT2VHF Prog Tool (antes Programador de Rádios); o instalador Windows remove a versão 1.1.0 e o .deb substitui o pacote antigo.", "Arquivos .ts2k e .icf continuam compatíveis; instaladores para Windows e Linux."])],
      en: [e("1.2.0", "New name: PT2VHF Prog Tool", ["The program is now PT2VHF Prog Tool (formerly Programador de Rádios); the Windows installer removes 1.1.0 and the .deb replaces the old package.", ".ts2k and .icf files remain compatible; installers for Windows and Linux."])],
      es: [e("1.2.0", "Nuevo nombre: PT2VHF Prog Tool", ["El programa pasa a llamarse PT2VHF Prog Tool (antes Programador de Rádios); el instalador de Windows elimina la 1.1.0 y el .deb sustituye al paquete anterior.", "Los archivos .ts2k e .icf siguen siendo compatibles; instaladores para Windows y Linux."])],
      fr: [e("1.2.0", "Nouveau nom : PT2VHF Prog Tool", ["Le programme s’appelle désormais PT2VHF Prog Tool (anciennement Programador de Rádios) ; l’installateur Windows retire la 1.1.0 et le .deb remplace l’ancien paquet.", "Les fichiers .ts2k et .icf restent compatibles ; installateurs pour Windows et Linux."])],
      de: [e("1.2.0", "Neuer Name: PT2VHF Prog Tool", ["Das Programm heißt jetzt PT2VHF Prog Tool (vorher Programador de Rádios); der Windows-Installer entfernt 1.1.0, das .deb ersetzt das alte Paket.", ".ts2k- und .icf-Dateien bleiben kompatibel; Installer für Windows und Linux."])],
      it: [e("1.2.0", "Nuovo nome: PT2VHF Prog Tool", ["Il programma si chiama ora PT2VHF Prog Tool (prima Programador de Rádios); l’installer Windows rimuove la 1.1.0 e il .deb sostituisce il vecchio pacchetto.", "I file .ts2k e .icf restano compatibili; installer per Windows e Linux."])],
      zh: [e("1.2.0", "新名称：PT2VHF Prog Tool", ["程序更名为 PT2VHF Prog Tool（原 Programador de Rádios）；Windows 安装程序会移除 1.1.0，.deb 替换旧软件包。", ".ts2k 和 .icf 文件保持兼容；提供 Windows 与 Linux 安装包。"])]
    }
  };
  var out = {};
  Object.keys(LOG).forEach(function (id) {
    out[id] = {};
    Object.keys(LOG[id]).forEach(function (lang) {
      out[id][lang] = {
        historyTitle: (LOG[id][lang].length > 1 ? TITLE : TITLE_ONE)[lang],
        historyIntro: INTRO[id][lang],
        changelog: LOG[id][lang]
      };
    });
  });
  window.PT2VHF_CHANGELOGS = out;
})();
