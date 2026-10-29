/*
 * Textos dos programas do site PT2VHF: nome, descrição, recursos,
 * equipamentos suportados e requisitos.
 *
 * Versões, datas e arquivos NÃO ficam aqui: vêm de /updates.json, que é
 * a única fonte de versões (lida também pelos próprios programas para
 * verificar atualizações). Veja o README.
 *
 *   - id:           chave do programa em updates.json (prog, prop, mesh, aprs, sat, qsl)
 *   - description:  texto ou lista de parágrafos
 *   - features:     recursos principais
 *   - supported:    rádios e equipamentos suportados (opcional)
 *   - requirements: sistema operacional, cabos e interfaces (opcional)
 */
window.PT2VHF_PRODUCTS = [
  {
    id: "prog",
    summary: "Programe, faça backup e gerencie memórias e configurações de rádios Kenwood e Icom.",
    cardSummary: "Ferramenta de configuração de memórias e menus de rádios em ambiente simples e fácil.",
    name: "PT2VHF Prog Tool",
    tagline: "Kenwood TS-2000 e Icom ID-51A Plus2 / ID-880H",
    description: [
      "O PT2VHF Prog Tool é um aplicativo para computador que programa rádios pela porta serial. Na tela inicial você escolhe o fabricante: em Kenwood aparece o TS-2000; em ICOM, o ID-51A Plus2 e o ID-880H.",
      "É para quem quer ler, editar e gravar as memórias e as configurações desses rádios no computador, com backup em arquivo, em vez de programar canal por canal no painel.",
      "No TS-2000 a programação é feita em tempo real pelo CAT: o programa lê e grava as memórias 000-299 e os itens de menu, pode gravar só o que você alterou e confere a gravação com uma releitura. Uma janela de display simula o LCD do rádio, com frequência, S-meter e indicadores atualizados cerca de 5 vezes por segundo.",
      "Os Icom ID-51A Plus2 e ID-880H são programados por clonagem: o programa lê a memória inteira do rádio, você edita os canais no computador e grava a imagem de volta. Tudo o que o programa não edita volta para o rádio exatamente como veio, e os arquivos .icf são os mesmos do software da Icom e do CHIRP.",
      "Os formatos Icom foram conferidos contra o código do CHIRP, mas ainda não houve teste com rádios reais: salve um backup .icf antes da primeira gravação. O programa é software livre, sob a licença GPLv3."
    ],
    features: [
      "TS-2000: memórias 000-299 com frequência, split, modo, shift/offset, tom/CTCSS/DCS, passo, grupo, lockout e nome",
      "TS-2000: menus com descrições e listas de valores, e varredura EX000-EX099 que mostra os menus aceitos sem gravar nada",
      "Leitura e gravação de tudo, só memórias, só menus, só os itens selecionados ou só os alterados, com verificação",
      "Display em tempo real: frequência em 7 segmentos, S-meter (PO na TX), VFO B, RIT/XIT, SPLIT, temas e tela cheia",
      "Icom: frequência, duplex/offset, modo (FM, NFM, AM, NAM, DV), tom/DTCS, passo, skip, bancos A-Z e nomes",
      "Campos D-STAR: UR, RPT1, RPT2, código digital e, no ID-51, o silenciador DSQL/CSQL",
      "Arquivos: projeto .ts2k, CSV para planilhas e .icf (CS-51PLUS2, CS-80/880 e CHIRP)",
      "Porta SIMULADOR para testar sem rádio e log CAT para diagnóstico"
    ],
    supported: [
      { name: "Kenwood TS-2000", detail: "Programação em tempo real via CAT (serial)" },
      { name: "Icom ID-51A Plus2", detail: "Clonagem, com arquivos .icf do CS-51PLUS2 e do CHIRP" },
      { name: "Icom ID-880H", detail: "Clonagem, com arquivos .icf do CS-80/880 e do CHIRP" }
    ],
    requirements: [
      "Windows 10/11 de 64 bits: instalador ou versão portátil, sem precisar instalar Python",
      "Linux: pacote .deb para Ubuntu 22.04+, Debian 12+ e Mint 21+ (usa python3-tk e python3-serial); outras distribuições e macOS pelo .tar.gz, com Python 3.10+ e Tkinter",
      "TS-2000: cabo serial direto (não null-modem) DB-9 ou adaptador USB-serial FTDI/Prolific, na mesma taxa do menu 56 do rádio (padrão 9600, 8N1) e com controle de fluxo RTS/CTS",
      "ID-51A Plus2 / ID-880H: cabo de clonagem/dados do rádio (por exemplo, o OPC-2218LU no ID-51) e o rádio em modo de clonagem",
      "Driver do cabo USB-serial do fabricante (FTDI, Prolific, Silicon Labs ou o do cabo Icom)"
    ],
    icon: "prog"
  },
  {
    id: "prop",
    summary: "Analise propagação HF, 6 m, 2 m e 70 cm com dados reais e mapas de calor por região.",
    cardSummary: "Análise de propagação para HF/VHF em tempo real, a partir da sua estação.",
    name: "PT2VHF Prop Tool",
    tagline: "PSK Reporter, WSPR, RBN, NOAA, VOACAP e MUF em uma só análise",
    description: [
      "O PT2VHF Prop Tool mostra evidências de propagação de sua região a partir de recepções observadas e condições de clima espacial. Diferencia observação, medição e estimativa para evitar interpretações equivocadas.",
      "Informe seu indicativo, coordenadas ou Grid Maidenhead e selecione as bandas de interesse. O mapa de calor mostra a concentração geográfica de evidências, e a análise destaca quais bandas têm melhores condições no momento.",
      "Suporta 14 bandas, de 160 m a 70 cm, incluindo 11 m. Consulte a origem dos dados e a confiança associada a cada avaliação. O sistema não garante contatos bidirecionais e não substitui a medição física da estação."
    ],
    features: [
      "Mapa de calor regional com zoom, gradiente de densidade e mapas base offline",
      "PSK Reporter, WSPR.live e Reverse Beacon Network como fontes observacionais independentes",
      "NOAA SWPC: Kp, F10.7, Bz, vento solar e raios X",
      "VOACAP HF local e referências foF2/MUF de ionossondas",
      "Bandas agora, bar-graphs de qualidade, confiança e destaque das condições mais favoráveis",
      "Filtros independentes de fonte e de janela de observação (15, 30 ou 60 minutos)",
      "Destinos geolocalizados, azimute e distância a partir da estação",
      "Assistente local, histórico de tráfego, temas e seis idiomas",
      "Windows 10/11 x64: instalador e portátil com atualização segura via pt2vhf.com"
    ],
    requirements: [
      "Windows 10 ou 11 de 64 bits",
      "Conexão à internet para consultar fontes de propagação e clima espacial",
      "Executável instalado ou portátil; sem necessidade de instalar Node.js ou Python",
      "VOACAP local requer instalação/configuração do motor externo quando utilizado"
    ],
    icon: "prop"
  },
  {
    "id": "mesh",
    "summary": "Analise nós Meshtastic e MeshCore, enlaces RF, mensagens, tráfego e telemetria.",
    "cardSummary": "Converse com outras pessoas e analise como as redes estão se comportando: enlaces RF, tráfego, telemetria etc. Compatível com Meshtastic e MeshCore.",
    "name": "PT2VHF Mesh Analyzer",
    "tagline": "Entenda o que acontece na sua rede mesh — do rádio ao mapa",
    "description": [
      "O PT2VHF Mesh Analyzer é um aplicativo independente de monitoramento e análise de redes mesh. Ele reúne dados de rádios Meshtastic e integrações MeshCore em um banco SQLite próprio, sem depender do MeshMonitor.",
      "Conecte seu rádio por USB/serial, Bluetooth LE ou Wi-Fi/TCP; use MQTT para monitoramento somente de recepção. Veja no mapa os nós, a atividade de rádio e os enlaces observados, distinguindo evidências de RF direto de caminhos inferidos.",
      "Além de observar a rede, o aplicativo oferece mensagens, consultas aos nós, traceroute, telemetria, automações e relatórios em Windows, Linux e macOS."
    ],
    "features": [
      "Conexões USB/serial, Bluetooth LE e Wi-Fi/TCP; MQTT somente para recepção",
      "Mapa de nós, enlaces RF, topologia, relevo e camadas meteorológicas",
      "Nós com nomes, favoritos, RSSI, SNR e histórico de atividade",
      "Mensagens em canais e privadas, com indicadores conforme os retornos do rádio",
      "Traceroute, Ping, Node Info, posição e telemetria, individualmente ou em lote",
      "Estatísticas, análise de tráfego, exportações e relatórios PDF",
      "Automações periódicas para consultas e diagnóstico da malha",
      "Recursos Meshtastic e MeshCore com configurações por conexão",
      "Banco SQLite independente, backup e atualização pelo site oficial",
      "Temas de interface e seleção de idioma"
    ],
    "icon": "mesh"
  },
  {
    id: "aprs",
    summary: "Monitore estações, mensagens e rotas APRS por RF e APRS-IS.",
    cardSummary: "Cliente de APRS com conexão pela internet e por rádio/TNC.",
    name: "PT2VHF APRS Client",
    tagline: "APRS no mapa, via RF ou internet",
    description:
      "Veja estações, objetos e mensagens APRS em tempo real. Conecte-se a um TNC/KISS ou ao APRS-IS, envie beacons e troque mensagens.",
    features: [
      "Mapas OSM/satélite, radar meteorológico, relevo e trilhas",
      "APRS-IS e TNC KISS por serial ou TCP, beacons por RF e Internet",
      "Topologia: estações, digipeaters, iGates e enlaces RF históricos",
      "Mensagens privadas e CQ, ACK/REJ e automações de resposta",
      "Estatísticas, relatórios PDF e exportações geográficas",
      "Interface multilíngue, web local/LAN e atualização segura por pt2vhf.com"
    ],
    icon: "aprs"
  },
  {
    id: "sat",
    summary: "Rastreie satélites amadores, preveja passagens e controle o TS-2000 via CAT.",
    cardSummary: "Software de rastreamento de satélites e da ISS com controle em tempo real do rádio via CAT/Serial.",
    name: "PT2VHF Sat Tool",
    tagline: "Satélites amadores, passagens e CAT para o Kenwood TS-2000",
    description: [
      "Acompanhe satélites de radioamador com mapa orbital, dados TLE/OMM, previsões de passagens e frequências para operar os modos disponíveis.",
      "Integração CAT com o Kenwood TS-2000 para compensação Doppler em recepção e transmissão. O acompanhamento automático requer conexão serial e validação com o equipamento real."
    ],
    features: [
      "Mapa orbital, posições, satélites favoritos e calendário de passagens AOS/TCA/LOS",
      "Perfis de frequência e transponder de satélites amadores",
      "Controle CAT do Kenwood TS-2000 e acompanhamento Doppler",
      "Estação configurável por coordenadas e Grid Locator Maidenhead",
      "Diagnóstico de frequências previstas e leituras reais do rádio",
      "Atualização de dados orbitais e frequências",
      "Auto CAT contínuo: FA/FB enviados e confirmados por leitura do rádio, sem acionar PTT",
      "Elementos orbitais CelesTrak (OMM/TLE) e transponders SatNOGS, com mapa offline",
      "Instalador e portátil EXE com atualização segura via pt2vhf.com (tamanho e SHA-256 verificados)"
    ],
    supported: [
      { name: "Kenwood TS-2000", detail: "Controle CAT pela porta serial" },
      { name: "Satélites de radioamador", detail: "Catálogo orbital e frequências de operação" }
    ],
    requirements: [
      "Windows 10 (1809+) ou Windows 11, 64 bits",
      "Para CAT: cabo serial e configuração compatível com o TS-2000",
      "Ajustes automáticos devem ser validados no rádio físico antes do uso operacional"
    ],
    icon: "sat"
  },
  {
    id: "qsl",
    summary: "Analise seus contatos de radioamador: estatísticas, mapas, confirmações QSL e relatórios em PDF a partir de ADIF e outros logs.",
    cardSummary: "Análise de logs e confirmações QSL com banco local, gráficos interativos e relatórios.",
    name: "PT2VHF QSL Analyzer",
    tagline: "ADIF, Cabrillo, EDI e CSV · QRZ.com, LoTW, eQSL e Club Log",
    description: [
      "O PT2VHF QSL Analyzer lê os seus logs de radioamador (ADIF, ADX, Cabrillo, EDI e CSV) e guarda os contatos num banco local, no seu computador. Novos envios só acrescentam o que ainda não existe e atualizam as confirmações QSL dos contatos já cadastrados.",
      "Logs de várias estações convivem no mesmo banco, e cada contato guarda o indicativo da estação. Em Configurações você apaga só o indicativo que quiser.",
      "Inspirado no QScope.org, traz as mesmas análises: estatísticas básicas, estações trabalhadas, mapas de atividade, bandas e modos, primeiro DXCC, trocas de banda, pausas, duplicados, pontos, zonas CQ/ITU, DXCC/locator, azimutes e distâncias, taxas de QSO e tempo de operação. Os gráficos são interativos: um clique filtra a tela inteira.",
      "A aba QSL soma as confirmações por papel, LoTW e eQSL e mostra a matriz DXCC × banda trabalhado/confirmado. O gerador de relatórios monta um PDF personalizado com as seções que você escolher."
],
    features: [
      "Banco local incremental: reenvios não duplicam contatos e atualizam as confirmações QSL",
      "Limpeza do banco por indicativo de estação, em todos os containers ou em um só",
      "Importação de ADIF, ADX, Cabrillo, EDI (REG1TEST) e CSV, e download direto do QRZ.com Logbook, LoTW, eQSL e Club Log",
      "Menu Logs no fluxo do QScope: containers, enviar, importar, modificar, copiar/filtrar e busca com curingas",
      "20 estatísticas do QScope, com taxas de QSO, tempo de operação, pausas, zonas, DXCC e mapas",
      "Gráficos estilo BI: clique para filtrar, arraste para escolher o período e legendas interativas",
      "Status de QSL com matriz DXCC × banda trabalhado (W) / confirmado (C)",
      "Relatórios personalizáveis em PDF e HTML; exportação em ADIF v3, CSV, Cabrillo e KML (Google Earth)",
      "Interface em português, inglês e espanhol, com tema claro e escuro"
],
    requirements: [
      "Windows 10/11 de 64 bits: instalador ou versão portátil",
      "Linux x64: AppImage, pacote .deb (Ubuntu/Debian/Mint) ou .tar.gz",
      "macOS 12+ em Apple Silicon (arm64) ou Intel (x64). O app ainda não é assinado pela Apple: na primeira abertura, clique com o botão direito e escolha Abrir",
      "Internet só para baixar logs das plataformas online e verificar atualizações em www.pt2vhf.com"
],
    icon: "qsl"
  }
];
