/* Changelog (últimas 5 versões) dos projetos sem arquivo próprio de site.
 * Fontes: CHANGELOG do QSL Manager, README do Sat Tool, version_notes.py do APRS Client e notas da
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
    qsl: {
      pt: "Evolução do QSL Manager, versão a versão.",
      en: "QSL Manager evolution, version by version.",
      es: "Evolución del QSL Manager, versión por versión.",
      fr: "Évolution du QSL Manager, version par version.",
      de: "Entwicklung des QSL Manager, Version für Version.",
      it: "Evoluzione del QSL Manager, versione per versione.",
      zh: "QSL Manager 各版本更新。"
    },
    "aprs-android": {
      pt: "Histórico oficial de versões do PT2VHF APRS Client for Android.",
      en: "Official PT2VHF APRS Client for Android release history.",
      es: "Historial oficial de versiones de PT2VHF APRS Client for Android.",
      fr: "Historique officiel des versions de PT2VHF APRS Client for Android.",
      de: "Offizielle Versionshistorie des PT2VHF APRS Client for Android.",
      it: "Cronologia ufficiale delle versioni di PT2VHF APRS Client for Android.",
      zh: "PT2VHF APRS Client for Android 官方版本更新记录。"
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
    qsl: {
      pt: [
        e("1.15.2", "Anúncio no seu idioma e enlaces preservados", ["O boletim de versão nova sai no idioma configurado, com download em www.PT2VHF.com; a divulgação da aba Sobre também passa a usar www.PT2VHF.com.", "Limpar as estações não apaga nem esconde mais os enlaces do mapa.", "O cabeçalho ganhou o botão Enviar Beacon no lugar do ícone."]),
        e("0.6.0", "Envio automático e testar conexão", ["Contatos baixados das plataformas que já existiam ficam marcados como enviados, e o envio ao QRZ.com ficou muito mais rápido.", "Envio automático de cada contato novo às plataformas escolhidas, botão Testar conexão com LED e Plataformas em Configurações.", "Formulário com banda automática pela frequência, frequência e modo do último contato e botão Salvar e adicionar novo; ficha do indicativo com bandeira e resumo dos dados; termo Grid em todo o programa."]),
        e("0.5.0", "Recuperação de dados e indicativo ativo", ["Se o banco abrir vazio, o programa recupera sozinho os contatos da versão anterior e avisa quantos restaurou.", "Menu no cabeçalho para escolher o indicativo ativo; formulário de contato mostra se a estação já foi trabalhada e se a banda/modo é novo.", "Backup automático direto na pasta do OneDrive, Dropbox, Google Drive ou iCloud; instaladores com o nome QSL Manager."]),
        e("0.4.0", "Novo nome: PT2VHF QSL Manager", ["Agora um gerenciador de contatos: inserir, editar e apagar contatos, enviar e sincronizar com QRZ.com, LoTW (via TQSL), eQSL e Club Log.", "Downloads das plataformas a partir de 1980, mensagens claras quando o LoTW limita consultas e sincronização incremental.", "Backup completo com senhas opcionais protegidas, restauração com prévia e backup automático."]),
        e("0.3.0", "Atualização automática", ["No Windows, o aviso de versão nova oferece \"Atualizar agora\": baixa de www.pt2vhf.com com progresso, confere tamanho e SHA-256, instala e reabre o app já atualizado.", "Banco, preferências e credenciais preservados; as novidades aparecem uma vez na primeira abertura."]),
        e("0.2.0", "Fichas, diplomas e novas análises", ["Indicativos, países, quadrículas, zonas e continentes clicáveis, com todos os contatos; ficha do indicativo com foto e dados do QRZ.com/HamQTH.", "Diplomas (DXCC, WAZ, WAS, WPX, VUCC, IOTA), Faltam confirmar, Entidades raras, Propagação, Comparar períodos, Estações frequentes, Novos indicativos, Concursos e Saúde do log.", "Importação em um passo com progresso, organização por estação, filtros recolhidos, painéis salvos, sub-abas e relatório \"Meu ano no rádio\"."]),
        e("0.1.0", "Primeira versão", ["Banco local incremental com limpeza por indicativo; ADIF, ADX, Cabrillo, EDI e CSV; importação do QRZ.com, LoTW, eQSL e Club Log.", "20 estatísticas, status de QSL, gráficos interativos, relatórios em PDF e exportação ADIF/CSV/Cabrillo/KML."])
      ],
      en: [
        e("1.15.2", "Announcement in your language and links kept", ["The new-version bulletin is sent in the configured language, with download at www.PT2VHF.com; the About tab promotion also uses www.PT2VHF.com.", "Clearing stations no longer deletes or hides the map links.", "The header now has a Send Beacon button instead of the icon."]),
        e("0.6.0", "Automatic upload and connection test", ["Contacts downloaded from the platforms that already existed are marked as uploaded, and uploading to QRZ.com is much faster.", "Automatic upload of each new contact to the chosen platforms, Test connection button with LED, and Platforms moved to Settings.", "Contact form with band from frequency, last frequency and mode prefilled and a Save and add new button; callsign sheet with flag and data summary; Grid wording throughout."]),
        e("0.5.0", "Data recovery and active callsign", ["If the database opens empty, the program recovers the contacts from the previous version and tells how many were restored.", "Header menu to pick the active callsign; the contact form shows whether the station was worked before and if the band/mode is new.", "Automatic backup straight into the OneDrive, Dropbox, Google Drive or iCloud folder; installers named QSL Manager."]),
        e("0.4.0", "New name: PT2VHF QSL Manager", ["Now a contact manager: add, edit and delete contacts, upload and sync with QRZ.com, LoTW (via TQSL), eQSL and Club Log.", "Platform downloads from 1980, clear messages when LoTW limits queries and incremental sync.", "Full backup with optional protected passwords, restore with preview and automatic backup."]),
        e("0.3.0", "Automatic updates", ["On Windows, the new version prompt offers \"Update now\": downloads from www.pt2vhf.com with progress, verifies size and SHA-256, installs and reopens the updated app.", "Database, preferences and credentials are kept; what's new is shown once on first launch."]),
        e("0.2.0", "Cards, awards and new analyses", ["Clickable callsigns, countries, grids, zones and continents with all contacts; callsign card with photo and QRZ.com/HamQTH data.", "Awards (DXCC, WAZ, WAS, WPX, VUCC, IOTA), To be confirmed, Rare entities, Propagation, Compare periods, Frequent stations, New callsigns, Contests and Log health.", "One-step import with progress, organization by station, collapsible filters, saved views, sub-tabs and the \"My year on the air\" report."]),
        e("0.1.0", "First release", ["Incremental local database with clearing by callsign; ADIF, ADX, Cabrillo, EDI and CSV; import from QRZ.com, LoTW, eQSL and Club Log.", "20 statistics, QSL status, interactive charts, PDF reports and ADIF/CSV/Cabrillo/KML export."])
      ],
      es: [
        e("1.15.2", "Anuncio en su idioma y enlaces preservados", ["El boletín de versión nueva se envía en el idioma configurado, con descarga en www.PT2VHF.com; la divulgación de la pestaña Acerca de también usa www.PT2VHF.com.", "Limpiar las estaciones ya no borra ni oculta los enlaces del mapa.", "El encabezado tiene el botón Enviar beacon en lugar del icono."]),
        e("0.6.0", "Envío automático y prueba de conexión", ["Los contactos descargados de las plataformas que ya existían quedan marcados como enviados, y el envío a QRZ.com es mucho más rápido.", "Envío automático de cada contacto nuevo a las plataformas elegidas, botón Probar conexión con LED y Plataformas en Configuración.", "Formulario con banda automática por la frecuencia, frecuencia y modo del último contacto y botón Guardar y añadir otro; ficha del indicativo con bandera y resumen de datos; término Grid en todo el programa."]),
        e("0.5.0", "Recuperación de datos e indicativo activo", ["Si la base abre vacía, el programa recupera los contactos de la versión anterior e informa cuántos restauró.", "Menú en la cabecera para elegir el indicativo activo; el formulario de contacto muestra si la estación ya fue trabajada y si la banda/modo es nuevo.", "Copia automática directa en la carpeta de OneDrive, Dropbox, Google Drive o iCloud; instaladores con el nombre QSL Manager."]),
        e("0.4.0", "Nuevo nombre: PT2VHF QSL Manager", ["Ahora un gestor de contactos: agregar, editar y eliminar contactos, enviar y sincronizar con QRZ.com, LoTW (vía TQSL), eQSL y Club Log.", "Descargas de las plataformas desde 1980, mensajes claros cuando LoTW limita consultas y sincronización incremental.", "Copia completa con contraseñas protegidas opcionales, restauración con vista previa y copia automática."]),
        e("0.3.0", "Actualización automática", ["En Windows, el aviso de nueva versión ofrece \"Actualizar ahora\": descarga de www.pt2vhf.com con progreso, verifica tamaño y SHA-256, instala y reabre la app actualizada.", "Base, preferencias y credenciales se conservan; las novedades aparecen una vez en el primer inicio."]),
        e("0.2.0", "Fichas, diplomas y nuevos análisis", ["Indicativos, países, cuadrículas, zonas y continentes clicables, con todos los contactos; ficha del indicativo con foto y datos de QRZ.com/HamQTH.", "Diplomas (DXCC, WAZ, WAS, WPX, VUCC, IOTA), Faltan confirmar, Entidades raras, Propagación, Comparar períodos, Estaciones frecuentes, Indicativos nuevos, Concursos y Salud del log.", "Importación en un paso con progreso, organización por estación, filtros plegables, paneles guardados, subpestañas e informe \"Mi año en la radio\"."]),
        e("0.1.0", "Primera versión", ["Base local incremental con limpieza por indicativo; ADIF, ADX, Cabrillo, EDI y CSV; importación de QRZ.com, LoTW, eQSL y Club Log.", "20 estadísticas, estado de QSL, gráficos interactivos, informes PDF y exportación ADIF/CSV/Cabrillo/KML."])
      ]
    },
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
        e("1.15.2", "Annonce dans votre langue et liaisons conservées", ["Le bulletin de nouvelle version est envoyé dans la langue configurée, avec téléchargement sur www.PT2VHF.com ; la promotion de l’onglet À propos utilise aussi www.PT2VHF.com.", "Effacer les stations ne supprime ni ne masque plus les liaisons de la carte.", "L’en-tête affiche le bouton Envoyer le beacon à la place de l’icône."]),
        e("1.3.15", "Satellites par défaut et écran épuré", ["Les nouvelles installations démarrent avec ISS, IO-86 et SO-50 activés ; les sélections enregistrées sont conservées.", "Bloc Prochain passage du satellite sélectionné supprimé ; le tableau des passages sur 36 h reste disponible."]),
        e("1.3.14", "Mise à jour OTA via le site PT2VHF", ["Mises à jour vérifiées et téléchargées uniquement depuis www.pt2vhf.com, sans redirection.", "Taille et SHA-256 obligatoires ; annonce du nouveau site officiel au démarrage."]),
        e("1.3.13", "Avis de nouvelle version", ["Lorsqu’une nouvelle version est détectée, propose de mettre à jour maintenant.", "Plus tard reporte la même version de 24 heures ; rien n’est installé sans confirmation."]),
        e("1.3.12", "Auto CAT continu et passages compacts", ["Les nouvelles consignes FA/FB passent avant la relecture périodique, confirmées et sans PTT.", "Panneau des passages plus compact ; versions pour Windows 10/11 x64 uniquement."]),
        e("1.3.11", "Prévision comparée au poste réel", ["Compare le Doppler calculé aux FA/FB lues sur le TS-2000 environ chaque seconde.", "Réaligne automatiquement le poste lorsque la fréquence réelle diverge."])
      ],
      de: [
        e("1.15.2", "Ankündigung in Ihrer Sprache, Verbindungen bleiben erhalten", ["Das Bulletin zur neuen Version wird in der eingestellten Sprache gesendet, Download unter www.PT2VHF.com; auch die Werbung im Reiter Über nutzt www.PT2VHF.com.", "Das Löschen der Stationen löscht oder verbirgt die Kartenverbindungen nicht mehr.", "Die Kopfzeile hat jetzt die Schaltfläche Beacon senden statt des Symbols."]),
        e("1.3.15", "Standardsatelliten und aufgeräumte Ansicht", ["Neuinstallationen starten mit ISS, IO-86 und SO-50 aktiviert; gespeicherte Auswahl bleibt erhalten.", "Block Nächster Überflug des gewählten Satelliten entfernt; die 36-h-Überflugtabelle bleibt."]),
        e("1.3.14", "OTA über die PT2VHF-Website", ["Updates werden nur von www.pt2vhf.com geprüft und geladen, ohne Weiterleitungen.", "Größe und SHA-256 Pflicht; Hinweis auf die neue offizielle Website beim Start."]),
        e("1.3.13", "Hinweis auf neue Version", ["Bei einer neuen Version wird gefragt, ob jetzt aktualisiert werden soll.", "Später verschiebt dieselbe Version um 24 Stunden; nichts wird ohne Bestätigung installiert."]),
        e("1.3.12", "Kontinuierliches Auto-CAT und kompakte Überflüge", ["Neue FA/FB-Ziele haben Vorrang vor dem periodischen Rücklesen, bestätigt und ohne PTT.", "Kompakteres Überflugfeld; Builds nur für Windows 10/11 x64."]),
        e("1.3.11", "Vorhersage im Vergleich zum echten Funkgerät", ["Vergleicht den berechneten Doppler etwa sekündlich mit den vom TS-2000 gelesenen FA/FB.", "Gleicht das Funkgerät automatisch ab, wenn die tatsächliche Frequenz abweicht."])
      ],
      it: [
        e("1.15.2", "Annuncio nella tua lingua e collegamenti mantenuti", ["Il bollettino di nuova versione viene inviato nella lingua configurata, con download su www.PT2VHF.com; anche la promozione della scheda Informazioni usa www.PT2VHF.com.", "Cancellare le stazioni non elimina né nasconde più i collegamenti sulla mappa.", "L’intestazione ha il pulsante Invia beacon al posto dell’icona."]),
        e("1.3.15", "Satelliti predefiniti e schermata più pulita", ["Le nuove installazioni partono con ISS, IO-86 e SO-50 abilitati; le selezioni salvate restano.", "Rimosso il blocco Prossimo passaggio del satellite selezionato; la tabella dei passaggi a 36 h resta disponibile."]),
        e("1.3.14", "OTA dal sito PT2VHF", ["Aggiornamenti verificati e scaricati solo da www.pt2vhf.com, senza reindirizzamenti.", "Dimensione e SHA-256 obbligatori; avviso del nuovo sito ufficiale all’avvio."]),
        e("1.3.13", "Avviso di nuova versione", ["Quando trova una nuova versione, chiede se aggiornare subito.", "Più tardi rimanda la stessa versione di 24 ore; nulla viene installato senza conferma."]),
        e("1.3.12", "Auto CAT continuo e passaggi compatti", ["I nuovi valori FA/FB hanno priorità sulla rilettura periodica, confermati e senza PTT.", "Pannello passaggi più compatto; build solo per Windows 10/11 x64."]),
        e("1.3.11", "Previsione confrontata con la radio reale", ["Confronta il Doppler calcolato con FA/FB letti dal TS-2000 circa ogni secondo.", "Riallinea automaticamente la radio quando la frequenza reale differisce."])
      ],
      zh: [
        e("1.15.2", "以您的语言发布公告并保留链路", ["新版本公告以所设置的语言发送，下载地址 www.PT2VHF.com；“关于”选项卡的推广也改用 www.PT2VHF.com。", "清除电台不再删除或隐藏地图上的链路。", "页眉中的图标改为“发送信标”按钮。"]),
        e("1.3.15", "默认卫星与更简洁的界面", ["新安装默认启用 ISS、IO-86 和 SO-50；已保存的选择保持不变。", "移除“所选卫星的下一次过境”区块；36 小时过境表仍然保留。"]),
        e("1.3.14", "通过 PT2VHF 官网 OTA 更新", ["仅从 www.pt2vhf.com 检查并下载更新，不允许重定向。", "必须校验大小和 SHA-256；启动时提示新的官方网站。"]),
        e("1.3.13", "新版本提示", ["发现新版本时询问是否立即更新。", "“稍后”将同一版本推迟 24 小时；未经确认不会安装。"]),
        e("1.3.12", "连续 Auto CAT 与紧凑过境面板", ["新的 FA/FB 目标优先于周期回读，经确认且不触发 PTT。", "过境面板更紧凑；仅提供 Windows 10/11 x64 版本。"]),
        e("1.3.11", "预测与实际电台对比", ["约每秒将计算的多普勒与 TS-2000 回读的 FA/FB 对比。", "实际频率偏离时自动校正电台。"])
      ]
    },
    aprs: {
      pt: [
        e("1.15.1", "Configuração em sub-abas", ["A Configuração agora é dividida em sub-abas: Estação, APRS-IS, TNC / RF, Mapa, Aplicativo, Integrações, Banco de dados e Backup; o indicador TNC abre direto a sub-aba TNC / RF.", "Posições de DMR, D-STAR, C4FM e outros modos digitais não aparecem mais como RF no mapa de calor e nos enlaces.", "Processamentos demorados podem ser cancelados pelo botão × e mostram o tempo decorrido."]),
        e("1.15.0", "Menu Ferramentas e análise de cobertura", ["Novo menu Ferramentas: análise de cobertura, enlace entre 2 pontos, melhor ponto para instalar estação, relevo com corte, relatório em PDF e diagnóstico para suporte.", "Análise de cobertura com potência em W (padrão 50 W), raio de 50 até 100 km, estações com e sem cobertura e comparação com as recepções reais por RF.", "PDFs com mapa de ruas; relevo com corte em coluna compacta e cor ajustável; TNC / RF agora fica em Configuração."]),
        e("1.14.62", "Downloads no site oficial", ["Ao iniciar, um aviso informa que novas versões e instaladores são distribuídos pelo site oficial."]),
        e("1.14.61", "Estatísticas guardadas", ["A aba Estatísticas abre com o último cálculo guardado; o botão Recalcular refaz quando quiser.", "Atualizações automáticas também entram nos contadores do site."]),
        e("1.14.60", "Anúncio da versão e filtros de mensagens", ["Anúncio automático da versão na rede APRS (desligável em Automações).", "Mensagens da própria estação sempre visíveis; rotas RF sem saltos faltando; Windows sem UPX."]),
        e("1.14.59", "Atualização via site PT2VHF", ["O atualizador consulta exclusivamente https://www.pt2vhf.com.", "Tamanho e SHA-256 verificados; links externos e redirecionamentos bloqueados."]),
        e("1.14.58", "Retenção permanente por padrão", ["Todos os itens do banco passam a ser guardados para sempre por padrão.", "Ao atualizar, prazos escolhidos pelo usuário são mantidos; nada é apagado."]),
        e("1.14.57", "Enlaces de estações fixas de volta ao mapa", ["Corrigido: enlaces de digis, iGates e estações fixas sumiam 12 horas após a primeira escuta.", "Enlaces já gravados sem posição são recuperados automaticamente, sem apagar nada."]),
        e("1.14.56", "Enlaces do mapa e diagnóstico", ["Corrigido: estações meteorológicas eram tratadas como móveis porque o vento era lido como velocidade.", "Verificar banco explica quantos enlaces RF existem e por que algum não aparece."]),
        e("1.14.55", "Planejamento de enlaces e melhor ponto", ["Enlace entre 2 pontos com perfil de terreno, Fresnel, sinal estimado e veredito de viabilidade.", "Melhor ponto para instalar estação: topos da área desenhada, com CSV e PDF."])
      ],
      en: [
        e("1.15.1", "Settings in sub-tabs", ["Settings are now split into sub-tabs: Station, APRS-IS, TNC / RF, Map, Application, Integrations, Database and Backup; the TNC indicator opens the TNC / RF sub-tab directly.", "Positions from DMR, D-STAR, C4FM and other digital modes no longer show up as RF in the heat map and links.", "Long-running processing can be cancelled with the × button and shows the elapsed time."]),
        e("1.15.0", "Tools menu and coverage analysis", ["New Tools menu: coverage analysis, link between 2 points, best spot to install a station, terrain cut, PDF report and support diagnostics.", "Coverage analysis with power in W (50 W default), radius from 50 up to 100 km, stations with and without coverage, and comparison with real RF receptions.", "PDFs with a street map; compact terrain cut with adjustable color; TNC / RF now lives in Settings."]),
        e("1.14.62", "Downloads on the official website", ["At startup, a notice explains that new versions and installers are distributed through the official website."]),
        e("1.14.61", "Saved statistics", ["The Statistics tab opens with the last saved calculation; Recalculate refreshes it on demand.", "Automatic updates are also counted on the site."]),
        e("1.14.60", "Version announcement and message filters", ["Automatic version announcement on the APRS network (can be turned off in Automations).", "Own-station messages always visible; RF routes without missing hops; Windows builds without UPX."]),
        e("1.14.59", "Updates from the PT2VHF site", ["The updater checks only https://www.pt2vhf.com.", "Size and SHA-256 verified; external links and redirects blocked."]),
        e("1.14.58", "Permanent retention by default", ["Every database item is now kept forever by default.", "On upgrade, retention periods chosen by the user are kept; nothing is deleted."]),
        e("1.14.57", "Fixed-station links back on the map", ["Fixed: digi, iGate and fixed-station links disappeared 12 hours after first heard.", "Links already stored without position are recovered automatically, without deleting anything."]),
        e("1.14.56", "Map links and diagnostics", ["Fixed: weather stations were treated as mobile because wind was read as speed.", "Check database explains how many RF links exist and why one is hidden."]),
        e("1.14.55", "Link planning and best site", ["Point-to-point link with terrain profile, Fresnel zone, estimated signal and feasibility verdict.", "Best site for a station: peaks inside the drawn area, with CSV and PDF."])
      ],
      es: [
        e("1.15.1", "Configuración en subpestañas", ["La Configuración ahora se divide en subpestañas: Estación, APRS-IS, TNC / RF, Mapa, Aplicación, Integraciones, Base de datos y Copia de seguridad; el indicador TNC abre directamente TNC / RF.", "Las posiciones de DMR, D-STAR, C4FM y otros modos digitales ya no aparecen como RF en el mapa de calor y en los enlaces.", "Los procesos largos se pueden cancelar con el botón × y muestran el tiempo transcurrido."]),
        e("1.15.0", "Menú Herramientas y análisis de cobertura", ["Nuevo menú Herramientas: análisis de cobertura, enlace entre 2 puntos, mejor punto para instalar una estación, relieve con corte, informe PDF y diagnóstico para soporte.", "Análisis de cobertura con potencia en W (50 W por defecto), radio de 50 hasta 100 km, estaciones con y sin cobertura y comparación con las recepciones reales por RF.", "PDF con mapa de calles; relieve con corte compacto y color ajustable; TNC / RF ahora está en Configuración."]),
        e("1.14.62", "Descargas en el sitio web oficial", ["Al iniciar, un aviso indica que las nuevas versiones e instaladores se distribuyen por el sitio oficial."]),
        e("1.14.61", "Estadísticas guardadas", ["La pestaña Estadísticas abre con el último cálculo guardado; Recalcular lo actualiza cuando quiera.", "Las actualizaciones automáticas también cuentan en el sitio."]),
        e("1.14.60", "Anuncio de versión y filtros de mensajes", ["Anuncio automático de la versión en la red APRS (desactivable en Automatizaciones).", "Mensajes de la propia estación siempre visibles; rutas RF sin saltos faltantes; Windows sin UPX."]),
        e("1.14.59", "Actualización desde el sitio PT2VHF", ["El actualizador consulta exclusivamente https://www.pt2vhf.com.", "Tamaño y SHA-256 verificados; enlaces externos y redirecciones bloqueados."]),
        e("1.14.58", "Retención permanente por defecto", ["Todos los elementos de la base se guardan para siempre por defecto.", "Al actualizar se mantienen los plazos elegidos por el usuario; no se borra nada."]),
        e("1.14.57", "Enlaces de estaciones fijas de vuelta al mapa", ["Corregido: los enlaces de digis, iGates y estaciones fijas desaparecían 12 horas después de la primera escucha.", "Los enlaces guardados sin posición se recuperan automáticamente, sin borrar nada."]),
        e("1.14.56", "Enlaces del mapa y diagnóstico", ["Corregido: las estaciones meteorológicas se trataban como móviles porque el viento se leía como velocidad.", "Verificar base explica cuántos enlaces RF hay y por qué alguno no aparece."]),
        e("1.14.55", "Planificación de enlaces y mejor punto", ["Enlace entre 2 puntos con perfil de terreno, Fresnel, señal estimada y veredicto de viabilidad.", "Mejor punto para instalar una estación: cumbres del área dibujada, con CSV y PDF."])
      ],
      fr: [
        e("1.15.1", "Configuration en sous-onglets", ["La configuration est désormais répartie en sous-onglets : Station, APRS-IS, TNC / RF, Carte, Application, Intégrations, Base de données et Sauvegarde ; l’indicateur TNC ouvre directement TNC / RF.", "Les positions DMR, D-STAR, C4FM et autres modes numériques n’apparaissent plus comme RF dans la carte de chaleur et les liaisons.", "Les traitements longs peuvent être annulés avec le bouton × et affichent le temps écoulé."]),
        e("1.15.0", "Menu Outils et analyse de couverture", ["Nouveau menu Outils : analyse de couverture, liaison entre 2 points, meilleur emplacement pour une station, relief avec coupe, rapport PDF et diagnostic pour le support.", "Analyse de couverture avec puissance en W (50 W par défaut), rayon de 50 à 100 km, stations couvertes ou non et comparaison avec les réceptions RF réelles.", "PDF avec carte des rues ; relief avec coupe compact et couleur réglable ; TNC / RF se trouve désormais dans Configuration."]),
        e("1.14.62", "Téléchargements sur le site officiel", ["Au démarrage, un avis indique que les nouvelles versions et installateurs sont distribués via le site officiel."]),
        e("1.14.61", "Statistiques enregistrées", ["L’onglet Statistiques s’ouvre avec le dernier calcul enregistré ; Recalculer le met à jour à la demande.", "Les mises à jour automatiques sont aussi comptées sur le site."]),
        e("1.14.60", "Annonce de version et filtres de messages", ["Annonce automatique de la version sur le réseau APRS (désactivable dans Automatisations).", "Messages de la station toujours visibles ; routes RF sans sauts manquants ; Windows sans UPX."]),
        e("1.14.59", "Mise à jour via le site PT2VHF", ["Le programme de mise à jour consulte uniquement https://www.pt2vhf.com.", "Taille et SHA-256 vérifiés ; liens externes et redirections bloqués."]),
        e("1.14.58", "Conservation permanente par défaut", ["Tous les éléments de la base sont désormais conservés indéfiniment par défaut.", "Lors de la mise à jour, les durées choisies par l’utilisateur sont conservées ; rien n’est supprimé."]),
        e("1.14.57", "Liaisons des stations fixes de retour sur la carte", ["Corrigé : les liaisons des digis, iGates et stations fixes disparaissaient 12 heures après la première écoute.", "Les liaisons enregistrées sans position sont récupérées automatiquement, sans rien supprimer."]),
        e("1.14.56", "Liaisons de la carte et diagnostic", ["Corrigé : les stations météo étaient traitées comme mobiles car le vent était lu comme une vitesse.", "Vérifier la base indique le nombre de liaisons RF et pourquoi l’une est masquée."]),
        e("1.14.55", "Planification de liaisons et meilleur site", ["Liaison entre 2 points avec profil du terrain, zone de Fresnel, signal estimé et verdict de faisabilité.", "Meilleur site pour une station : sommets de la zone dessinée, avec CSV et PDF."])
      ],
      de: [
        e("1.15.1", "Einstellungen in Unterregistern", ["Die Einstellungen sind jetzt in Unterregister aufgeteilt: Station, APRS-IS, TNC / RF, Karte, Anwendung, Integrationen, Datenbank und Sicherung; die TNC-Anzeige öffnet direkt TNC / RF.", "Positionen aus DMR, D-STAR, C4FM und anderen Digitalmodi erscheinen nicht mehr als HF in der Heatmap und bei Verbindungen.", "Lange Verarbeitungen lassen sich mit der Schaltfläche × abbrechen und zeigen die verstrichene Zeit."]),
        e("1.15.0", "Menü Werkzeuge und Abdeckungsanalyse", ["Neues Menü Werkzeuge: Abdeckungsanalyse, Verbindung zwischen 2 Punkten, bester Standort für eine Station, Geländeschnitt, PDF-Bericht und Support-Diagnose.", "Abdeckungsanalyse mit Leistung in W (Standard 50 W), Radius von 50 bis 100 km, Stationen mit und ohne Abdeckung und Vergleich mit echten HF-Empfängen.", "PDFs mit Straßenkarte; kompakter Geländeschnitt mit einstellbarer Farbe; TNC / RF jetzt in den Einstellungen."]),
        e("1.14.62", "Downloads auf der offiziellen Website", ["Beim Start weist ein Hinweis darauf hin, dass neue Versionen über die offizielle Website verteilt werden."]),
        e("1.14.61", "Gespeicherte Statistiken", ["Der Statistik-Tab öffnet mit der zuletzt gespeicherten Berechnung; Neu berechnen aktualisiert bei Bedarf.", "Automatische Updates werden ebenfalls auf der Website gezählt."]),
        e("1.14.60", "Versionsansage und Nachrichtenfilter", ["Automatische Versionsansage im APRS-Netz (unter Automationen abschaltbar).", "Eigene Nachrichten immer sichtbar; RF-Routen ohne fehlende Sprünge; Windows ohne UPX."]),
        e("1.14.59", "Updates über die PT2VHF-Website", ["Der Updater fragt ausschließlich https://www.pt2vhf.com ab.", "Größe und SHA-256 geprüft; externe Links und Weiterleitungen blockiert."]),
        e("1.14.58", "Standardmäßig dauerhafte Aufbewahrung", ["Alle Datenbankeinträge werden standardmäßig dauerhaft gespeichert.", "Beim Update bleiben vom Benutzer gewählte Fristen erhalten; nichts wird gelöscht."]),
        e("1.14.57", "Verbindungen fester Stationen wieder auf der Karte", ["Behoben: Verbindungen von Digis, iGates und festen Stationen verschwanden 12 Stunden nach dem ersten Empfang.", "Bereits ohne Position gespeicherte Verbindungen werden automatisch wiederhergestellt, ohne Löschungen."]),
        e("1.14.56", "Kartenverbindungen und Diagnose", ["Behoben: Wetterstationen galten als mobil, weil der Wind als Geschwindigkeit gelesen wurde.", "Datenbank prüfen zeigt, wie viele RF-Verbindungen es gibt und warum eine verborgen ist."]),
        e("1.14.55", "Verbindungsplanung und bester Standort", ["Punkt-zu-Punkt-Verbindung mit Geländeprofil, Fresnelzone, geschätztem Signal und Machbarkeitsurteil.", "Bester Standort für eine Station: Gipfel im gezeichneten Bereich, mit CSV und PDF."])
      ],
      it: [
        e("1.15.1", "Configurazione in sotto-schede", ["La Configurazione è ora divisa in sotto-schede: Stazione, APRS-IS, TNC / RF, Mappa, Applicazione, Integrazioni, Database e Backup; l’indicatore TNC apre direttamente TNC / RF.", "Le posizioni da DMR, D-STAR, C4FM e altri modi digitali non compaiono più come RF nella mappa di calore e nei collegamenti.", "Le elaborazioni lunghe possono essere annullate con il pulsante × e mostrano il tempo trascorso."]),
        e("1.15.0", "Menu Strumenti e analisi di copertura", ["Nuovo menu Strumenti: analisi di copertura, collegamento tra 2 punti, punto migliore per installare una stazione, rilievo con taglio, report PDF e diagnostica per il supporto.", "Analisi di copertura con potenza in W (50 W predefiniti), raggio da 50 fino a 100 km, stazioni con e senza copertura e confronto con le ricezioni RF reali.", "PDF con mappa stradale; rilievo con taglio compatto e colore regolabile; TNC / RF ora si trova in Configurazione."]),
        e("1.14.62", "Download sul sito ufficiale", ["All’avvio, un avviso indica che le nuove versioni sono distribuite tramite il sito ufficiale."]),
        e("1.14.61", "Statistiche salvate", ["La scheda Statistiche si apre con l’ultimo calcolo salvato; Ricalcola lo aggiorna su richiesta.", "Anche gli aggiornamenti automatici vengono conteggiati sul sito."]),
        e("1.14.60", "Annuncio versione e filtri messaggi", ["Annuncio automatico della versione sulla rete APRS (disattivabile in Automazioni).", "Messaggi della propria stazione sempre visibili; rotte RF senza salti mancanti; Windows senza UPX."]),
        e("1.14.59", "Aggiornamento dal sito PT2VHF", ["L’aggiornamento consulta esclusivamente https://www.pt2vhf.com.", "Dimensione e SHA-256 verificati; link esterni e reindirizzamenti bloccati."]),
        e("1.14.58", "Conservazione permanente predefinita", ["Tutti gli elementi del database sono ora conservati per sempre per impostazione predefinita.", "All’aggiornamento restano i periodi scelti dall’utente; nulla viene cancellato."]),
        e("1.14.57", "Collegamenti delle stazioni fisse di nuovo sulla mappa", ["Corretto: i collegamenti di digi, iGate e stazioni fisse sparivano 12 ore dopo il primo ascolto.", "I collegamenti salvati senza posizione vengono recuperati automaticamente, senza cancellare nulla."]),
        e("1.14.56", "Collegamenti della mappa e diagnostica", ["Corretto: le stazioni meteo erano trattate come mobili perché il vento veniva letto come velocità.", "Verifica database spiega quanti collegamenti RF esistono e perché uno non appare."]),
        e("1.14.55", "Pianificazione dei collegamenti e punto migliore", ["Collegamento tra 2 punti con profilo del terreno, zona di Fresnel, segnale stimato e verdetto di fattibilità.", "Punto migliore per una stazione: cime dell’area disegnata, con CSV e PDF."])
      ],
      zh: [
        e("1.15.1", "设置分为子选项卡", ["设置现在分为子选项卡：电台、APRS-IS、TNC / RF、地图、应用程序、集成、数据库和备份；TNC 指示器直接打开 TNC / RF。", "来自 DMR、D-STAR、C4FM 等数字模式的位置不再在热力图和链路中显示为射频。", "耗时的处理可通过 × 按钮取消，并显示已用时间。"]),
        e("1.15.0", "工具菜单与覆盖分析", ["新增工具菜单：覆盖分析、两点链路分析、最佳站点选址、地形切面、PDF 报告和支持诊断。", "覆盖分析按瓦特设置功率（默认 50 W），半径 50 至 100 km，列出有/无覆盖的电台，并与实际射频接收对比。", "PDF 带街道底图；紧凑的地形切面并可调颜色；TNC / RF 移至设置。"]),
        e("1.14.62", "官方网站下载", ["启动时提示：新版本和安装程序通过官方网站发布。"]),
        e("1.14.61", "保存的统计", ["统计页面打开时显示上次保存的计算结果；需要时点击“重新计算”。", "自动更新也计入网站下载计数。"]),
        e("1.14.60", "版本播报与消息筛选", ["在 APRS 网络自动播报版本（可在“自动化”中关闭）。", "本台消息始终显示；RF 路由不再缺少跳；Windows 版不再使用 UPX。"]),
        e("1.14.59", "通过 PT2VHF 官网更新", ["更新程序仅查询 https://www.pt2vhf.com。", "校验大小和 SHA-256；阻止外部链接和重定向。"]),
        e("1.14.58", "默认永久保留", ["数据库中的所有项目默认永久保存。", "升级时保留用户自选的保留期限，不删除任何数据。"]),
        e("1.14.57", "固定台站链路重新显示在地图上", ["修复：数字中继、iGate 和固定台站的链路在首次收听 12 小时后消失。", "已保存但缺少位置的链路会自动恢复，不删除任何数据。"]),
        e("1.14.56", "地图链路与诊断", ["修复：气象站因风速被当作移动速度而被视为移动台。", "“检查数据库”说明 RF 链路数量以及某条链路为何被隐藏。"]),
        e("1.14.55", "链路规划与最佳站址", ["两点间链路：地形剖面、菲涅耳区、估算信号和可行性结论。", "最佳站址：在绘制区域内列出山顶，并支持 CSV 和 PDF。"])
      ]
    },
    "aprs-android": {
      pt: [e("0.1.0", "Primeira versão Android", ["APRS-IS com servidor configurável, passcode automático e reconexão ao alternar entre Wi-Fi e dados móveis.", "Mapa OpenStreetMap com estações e enlaces RF; mensagens, CQ, boletins, ACK e notificações.", "Beacon manual, SmartBeaconing em segundo plano, TNC KISS Bluetooth e aviso de atualização pelo site oficial."])],
      en: [e("0.1.0", "First Android release", ["APRS-IS with configurable server, automatic passcode and reconnection when switching between Wi-Fi and mobile data.", "OpenStreetMap with stations and RF links; messages, CQ, bulletins, ACK and notifications.", "Manual beacon, background SmartBeaconing, Bluetooth KISS TNC and update notice from the official website."])],
      es: [e("0.1.0", "Primera versión Android", ["APRS-IS con servidor configurable, código de acceso automático y reconexión al cambiar entre Wi-Fi y datos móviles.", "Mapa OpenStreetMap con estaciones y enlaces RF; mensajes, CQ, boletines, ACK y notificaciones.", "Beacon manual, SmartBeaconing en segundo plano, TNC KISS Bluetooth y aviso de actualización desde el sitio oficial."])],
      fr: [e("0.1.0", "Première version Android", ["APRS-IS avec serveur configurable, code d’accès automatique et reconnexion lors du passage du Wi-Fi aux données mobiles.", "Carte OpenStreetMap avec stations et liaisons RF ; messages, CQ, bulletins, accusés de réception et notifications.", "Balise manuelle, SmartBeaconing en arrière-plan, TNC KISS Bluetooth et avis de mise à jour via le site officiel."])],
      de: [e("0.1.0", "Erste Android-Version", ["APRS-IS mit konfigurierbarem Server, automatischem Passcode und Wiederverbindung beim Wechsel zwischen WLAN und Mobilfunk.", "OpenStreetMap mit Stationen und HF-Verbindungen; Nachrichten, CQ, Bulletins, ACKs und Benachrichtigungen.", "Manuelle Bake, SmartBeaconing im Hintergrund, Bluetooth-KISS-TNC und Update-Hinweis über die offizielle Website."])],
      it: [e("0.1.0", "Prima versione Android", ["APRS-IS con server configurabile, passcode automatico e riconnessione tra Wi-Fi e rete mobile.", "Mappa OpenStreetMap con stazioni e collegamenti RF; messaggi, CQ, bollettini, ACK e notifiche.", "Beacon manuale, SmartBeaconing in background, TNC KISS Bluetooth e avviso di aggiornamento dal sito ufficiale."])],
      zh: [e("0.1.0", "首个 Android 版本", ["APRS-IS 支持配置服务器、自动生成通行码，并在 Wi-Fi 与移动网络切换时重新连接。", "OpenStreetMap 地图显示电台和射频链路，支持消息、CQ、公告、ACK 确认和通知。", "支持手动信标、后台 SmartBeaconing、蓝牙 KISS TNC，以及通过官方网站检查新版本。"])]
    },
    prog: {
      pt: [e("1.3.2", "Aviso do site oficial", ["Ao abrir, um aviso informa que downloads e atualizações vêm somente de www.pt2vhf.com.", "O aviso de versão nova aparece em seguida, depois que o aviso é fechado."]), e("1.3.1", "Instalador do Windows e testes automáticos", ["Instalador do Windows corrigido para também ser gerado no próprio Windows (caminhos e acentos do assistente).", "Testes automáticos no Linux e no Windows a cada alteração, incluindo a geração do instalador."]), e("1.3.0", "Display em tempo real e atualização pelo site", ["Réplica do display do TS-2000 e painel completo com todos os dados do rádio (ganhos, filtro, medidores de TX).", "Atualização automática assinada pelo site pt2vhf.com; tabela de menus completa conforme o manual; fotos dos rádios na tela inicial."]), e("1.2.0", "Novo nome: PT2VHF Prog Tool", ["O programa passa a se chamar PT2VHF Prog Tool (antes Programador de Rádios); o instalador Windows remove a versão 1.1.0 e o .deb substitui o pacote antigo.", "Arquivos .ts2k e .icf continuam compatíveis; instaladores para Windows e Linux."])],
      en: [e("1.3.2", "Official site notice", ["On startup, a notice says downloads and updates come only from www.pt2vhf.com.", "The new version prompt follows right after the notice is closed."]), e("1.3.1", "Windows installer and automated tests", ["Windows installer fixed so it can also be built on Windows itself (paths and accents in the setup wizard).", "Automated tests on Linux and Windows for every change, including the installer build."]), e("1.3.0", "Real-time display and site updates", ["TS-2000 display replica and full panel with all radio data (gains, filter, TX meters).", "Signed automatic updates from pt2vhf.com; complete menu table per the manual; radio photos on the start screen."]), e("1.2.0", "New name: PT2VHF Prog Tool", ["The program is now PT2VHF Prog Tool (formerly Programador de Rádios); the Windows installer removes 1.1.0 and the .deb replaces the old package.", ".ts2k and .icf files remain compatible; installers for Windows and Linux."])],
      es: [e("1.3.2", "Aviso del sitio oficial", ["Al abrir, un aviso informa que descargas y actualizaciones vienen solo de www.pt2vhf.com.", "El aviso de nueva versión aparece a continuación, al cerrar el aviso."]), e("1.3.1", "Instalador de Windows y pruebas automáticas", ["Instalador de Windows corregido para generarse también en el propio Windows (rutas y acentos del asistente).", "Pruebas automáticas en Linux y Windows en cada cambio, incluida la generación del instalador."]), e("1.3.0", "Pantalla en tiempo real y actualización desde el sitio", ["Réplica de la pantalla del TS-2000 y panel completo con todos los datos de la radio (ganancias, filtro, medidores de TX).", "Actualización automática firmada desde pt2vhf.com; tabla de menús completa según el manual; fotos de las radios en la pantalla inicial."]), e("1.2.0", "Nuevo nombre: PT2VHF Prog Tool", ["El programa pasa a llamarse PT2VHF Prog Tool (antes Programador de Rádios); el instalador de Windows elimina la 1.1.0 y el .deb sustituye al paquete anterior.", "Los archivos .ts2k e .icf siguen siendo compatibles; instaladores para Windows y Linux."])],
      fr: [e("1.3.2", "Avis du site officiel", ["Au démarrage, un avis indique que téléchargements et mises à jour viennent uniquement de www.pt2vhf.com.", "L’avis de nouvelle version suit dès la fermeture de l’avis."]), e("1.3.1", "Installateur Windows et tests automatiques", ["Installateur Windows corrigé pour être aussi généré sous Windows (chemins et accents de l’assistant).", "Tests automatiques sous Linux et Windows à chaque modification, y compris la génération de l’installateur."]), e("1.3.0", "Affichage en temps réel et mises à jour via le site", ["Réplique de l’afficheur du TS-2000 et panneau complet avec toutes les données de la radio (gains, filtre, mesures TX).", "Mises à jour automatiques signées via pt2vhf.com ; table des menus complète selon le manuel ; photos des radios à l’accueil."]), e("1.2.0", "Nouveau nom : PT2VHF Prog Tool", ["Le programme s’appelle désormais PT2VHF Prog Tool (anciennement Programador de Rádios) ; l’installateur Windows retire la 1.1.0 et le .deb remplace l’ancien paquet.", "Les fichiers .ts2k et .icf restent compatibles ; installateurs pour Windows et Linux."])],
      de: [e("1.3.2", "Hinweis auf die offizielle Website", ["Beim Start weist ein Hinweis darauf hin, dass Downloads und Updates nur von www.pt2vhf.com kommen.", "Der Hinweis auf eine neue Version folgt direkt nach dem Schließen."]), e("1.3.1", "Windows-Installer und automatische Tests", ["Windows-Installer korrigiert, damit er auch unter Windows selbst erstellt werden kann (Pfade und Umlaute im Assistenten).", "Automatische Tests unter Linux und Windows bei jeder Änderung, einschließlich der Installer-Erstellung."]), e("1.3.0", "Echtzeitanzeige und Updates über die Website", ["Nachbildung des TS-2000-Displays und vollständiges Panel mit allen Funkgerätedaten (Pegel, Filter, TX-Messwerte).", "Signierte automatische Updates über pt2vhf.com; vollständige Menütabelle laut Handbuch; Fotos der Geräte auf dem Startbildschirm."]), e("1.2.0", "Neuer Name: PT2VHF Prog Tool", ["Das Programm heißt jetzt PT2VHF Prog Tool (vorher Programador de Rádios); der Windows-Installer entfernt 1.1.0, das .deb ersetzt das alte Paket.", ".ts2k- und .icf-Dateien bleiben kompatibel; Installer für Windows und Linux."])],
      it: [e("1.3.2", "Avviso del sito ufficiale", ["All’avvio, un avviso indica che download e aggiornamenti arrivano solo da www.pt2vhf.com.", "L’avviso di nuova versione segue subito dopo la chiusura."]), e("1.3.1", "Installer Windows e test automatici", ["Installer Windows corretto per essere generato anche su Windows (percorsi e accenti della procedura guidata).", "Test automatici su Linux e Windows a ogni modifica, inclusa la generazione dell’installer."]), e("1.3.0", "Display in tempo reale e aggiornamenti dal sito", ["Replica del display del TS-2000 e pannello completo con tutti i dati della radio (guadagni, filtro, misure TX).", "Aggiornamenti automatici firmati da pt2vhf.com; tabella dei menu completa secondo il manuale; foto delle radio nella schermata iniziale."]), e("1.2.0", "Nuovo nome: PT2VHF Prog Tool", ["Il programma si chiama ora PT2VHF Prog Tool (prima Programador de Rádios); l’installer Windows rimuove la 1.1.0 e il .deb sostituisce il vecchio pacchetto.", "I file .ts2k e .icf restano compatibili; installer per Windows e Linux."])],
      zh: [e("1.3.2", "官方网站提示", ["启动时提示：下载和更新仅来自 www.pt2vhf.com。", "关闭提示后，随即显示新版本通知。"]), e("1.3.1", "Windows 安装程序与自动测试", ["修正 Windows 安装程序，使其也能在 Windows 上生成（安装向导中的路径和重音字符）。", "每次修改都在 Linux 和 Windows 上自动测试，包括生成安装程序。"]), e("1.3.0", "实时显示与网站更新", ["TS-2000 显示屏仿真，以及包含全部电台数据的完整面板（增益、滤波器、发射表）。", "来自 pt2vhf.com 的签名自动更新；按手册整理的完整菜单表；启动界面显示电台照片。"]), e("1.2.0", "新名称：PT2VHF Prog Tool", ["程序更名为 PT2VHF Prog Tool（原 Programador de Rádios）；Windows 安装程序会移除 1.1.0，.deb 替换旧软件包。", ".ts2k 和 .icf 文件保持兼容；提供 Windows 与 Linux 安装包。"])]
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
