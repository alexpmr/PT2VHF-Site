/*
 * Catálogo de produtos e instaladores do site PT2VHF.
 *
 * Para publicar uma nova versão, edite apenas este arquivo:
 *   - version:      número da versão (ex.: "1.4.2"); vazio = "Em breve"
 *   - date:         data de lançamento no formato AAAA-MM-DD
 *   - description:  texto ou lista de parágrafos
 *   - features:     recursos principais
 *   - supported:    rádios e equipamentos suportados (opcional)
 *   - requirements: sistema operacional, cabos e interfaces (opcional)
 *   - files:        um item por arquivo, com:
 *       category: uma das categorias abaixo (define a ordem na tabela)
 *                   "Windows — Instalador", "Windows — Portátil",
 *                   "Linux — .deb (Debian/Ubuntu)", "Linux — .tar.gz",
 *                   "macOS", "Código-fonte", "Somas de verificação"
 *       url:      caminho do arquivo, ex.: downloads/prog-tool/arquivo.exe
 *       label:    detalhe curto (sistemas suportados etc.)
 *       size:     tamanho legível, ex.: "8,5 MB"
 *       sha256:   hash SHA-256 do arquivo
 *
 * Programa sem arquivos aparece como "Em breve".
 */
window.PT2VHF_PRODUCTS = [
  {
    id: "prog",
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
    icon: "prog",
    version: "1.2.0",
    date: "2026-10-25",
    files: [
      {
        category: "Windows — Instalador",
        url: "downloads/prog-tool/PT2VHFProgTool-1.2.0-instalador.exe",
        label: "Windows 10/11 64 bits (recomendado)",
        size: "8,5 MB",
        sha256: "8cd72249be49808296bbf48e5f6c5fa5f10c2baab85bc67d5a1288055bface6b"
      },
      {
        category: "Windows — Portátil",
        url: "downloads/prog-tool/PT2VHFProgTool-1.2.0-windows-portatil.zip",
        label: "Windows 10/11 64 bits, sem instalar",
        size: "12,5 MB",
        sha256: "119c42c3b3bd86e15c1e1239d9a2dde3388660e21ed6fff7fca708119cdbfa9d"
      },
      {
        category: "Linux — .deb (Debian/Ubuntu)",
        url: "downloads/prog-tool/pt2vhf-prog-tool_1.2.0_all.deb",
        label: "Ubuntu 22.04+, Debian 12+, Mint 21+",
        size: "58 KB",
        sha256: "4891c944297cf3124e47540b94362057cff152d15f857def1c9e434696d2bf13"
      },
      {
        category: "Linux — .tar.gz",
        url: "downloads/prog-tool/pt2vhf-prog-tool-1.2.0-linux.tar.gz",
        label: "Outras distribuições e macOS (Python 3.10+ com Tkinter)",
        size: "86 KB",
        sha256: "bf35e80a3f58f7f5607e8e2aa127cf4ab200a042f33e472c71efd7831fef27e1"
      },
      {
        category: "Código-fonte",
        url: "downloads/prog-tool/pt2vhf-prog-tool-1.2.0-codigo-fonte.zip",
        label: "GPLv3",
        size: "710 KB",
        sha256: "eadfccf1f6385f5951456754adb55200820028990c5f99f82d33188ea9ead4e1"
      },
      {
        category: "Somas de verificação",
        url: "downloads/prog-tool/SHA256SUMS.txt",
        label: "SHA-256 de todos os arquivos da versão",
        size: "515 B",
        sha256: "7d86920c4b77fb6316064f5be5499ce8d4092b4e600fc33ac126459e4dee5eaf"
      }
    ]
  },
  {
    id: "prop",
    name: "PT2VHF Prop Tool",
    tagline: "Propagação e enlaces em VHF/UHF",
    description:
      "Planeje enlaces e estime a cobertura de estações e repetidoras usando perfil de terreno, zona de Fresnel e cálculo de perda de percurso.",
    features: [
      "Perfil de terreno entre dois pontos",
      "Zona de Fresnel e linha de visada",
      "Orçamento de enlace (link budget)",
      "Mapa de cobertura estimada"
    ],
    icon: "prop",
    version: "",
    date: "",
    files: []
  },
  {
    id: "mesh",
    name: "PT2VHF Mesh Analyzer",
    tagline: "Visibilidade total da sua rede mesh",
    description:
      "Acompanhe os nós da sua rede mesh, a qualidade dos enlaces e o caminho das mensagens. Descubra gargalos e pontos fracos antes que virem problema.",
    features: [
      "Lista de nós com SNR, RSSI e última atividade",
      "Mapa e topologia da rede",
      "Histórico de tráfego e telemetria",
      "Exportação de relatórios"
    ],
    icon: "mesh",
    version: "",
    date: "",
    files: []
  },
  {
    id: "aprs",
    name: "PT2VHF APRS Client",
    tagline: "APRS no mapa, via RF ou internet",
    description:
      "Veja estações, objetos e mensagens APRS em tempo real. Conecte-se a um TNC/KISS ou ao APRS-IS, envie beacons e troque mensagens.",
    features: [
      "Mapa com estações e trilhas em tempo real",
      "Conexão KISS (serial/TCP) e APRS-IS",
      "Envio de beacons de posição",
      "Mensagens APRS com confirmação"
    ],
    icon: "aprs",
    version: "",
    date: "",
    files: []
  }
];
