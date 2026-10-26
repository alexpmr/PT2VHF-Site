/*
 * Catálogo de produtos e instaladores do site PT2VHF.
 *
 * Para publicar uma nova versão, edite apenas este arquivo:
 *   - version: número da versão (ex.: "1.4.2")
 *   - date:    data de lançamento no formato AAAA-MM-DD
 *   - files:   um item por instalador. "url" pode apontar para downloads/...
 *              (arquivo no próprio repositório, até 100 MB) ou para um
 *              link público externo. O primeiro item com url vira o botão
 *              principal; os demais aparecem como opções extras com o "label".
 *
 * Itens com url vazia aparecem como "Em breve".
 */
window.PT2VHF_PRODUCTS = [
  {
    id: "prog",
    name: "PT2VHF Prog Tool",
    tagline: "Kenwood TS-2000 e Icom ID-51A Plus2 / ID-880H",
    description:
      "Programa rádios pela porta serial. No TS-2000 lê e grava as memórias 000-299 e os menus via CAT e mostra um display LCD em tempo real; no ID-51A Plus2 e no ID-880H clona a memória do rádio, edita os canais (incluindo D-STAR) e grava de volta, preservando o resto da imagem.",
    features: [
      "TS-2000: memórias 000-299 e menus EX, gravando só o que mudou",
      "Display em tempo real com S-meter, VFO B, RIT/XIT e temas",
      "ID-51A Plus2 / ID-880H: clonagem com arquivos .icf (compatíveis com CS-51PLUS2 e CHIRP)",
      "Canais D-STAR (UR, RPT1, RPT2), bancos A-Z e exportação em CSV",
      "Porta SIMULADOR para testar sem rádio e log CAT para diagnóstico"
    ],
    icon: "prog",
    version: "1.2.0",
    date: "2026-10-25",
    files: [
      {
        os: "Windows",
        label: "Instalador (.exe) · Windows 10/11 64 bits",
        url: "downloads/prog-tool/PT2VHFProgTool-1.2.0-instalador.exe",
        size: "8,5 MB",
        sha256: "8cd72249be49808296bbf48e5f6c5fa5f10c2baab85bc67d5a1288055bface6b"
      },
      {
        os: "Windows",
        label: "Portátil (.zip) · sem instalar",
        url: "downloads/prog-tool/PT2VHFProgTool-1.2.0-windows-portatil.zip",
        size: "12,5 MB",
        sha256: "119c42c3b3bd86e15c1e1239d9a2dde3388660e21ed6fff7fca708119cdbfa9d"
      },
      {
        os: "Linux",
        label: "Pacote .deb · Ubuntu 22.04+, Debian 12+, Mint 21+",
        url: "downloads/prog-tool/pt2vhf-prog-tool_1.2.0_all.deb",
        size: "58 KB",
        sha256: "4891c944297cf3124e47540b94362057cff152d15f857def1c9e434696d2bf13"
      },
      {
        os: "Linux / macOS",
        label: ".tar.gz · Python 3.10+ com Tkinter",
        url: "downloads/prog-tool/pt2vhf-prog-tool-1.2.0-linux.tar.gz",
        size: "86 KB",
        sha256: "bf35e80a3f58f7f5607e8e2aa127cf4ab200a042f33e472c71efd7831fef27e1"
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
    files: [
      { os: "Windows", label: "Instalador (.exe)", url: "", size: "", sha256: "" }
    ]
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
    files: [
      { os: "Windows", label: "Instalador (.exe)", url: "", size: "", sha256: "" }
    ]
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
    files: [
      { os: "Windows", label: "Instalador (.exe)", url: "", size: "", sha256: "" }
    ]
  }
];
