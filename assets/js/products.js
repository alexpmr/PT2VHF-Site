/*
 * Catálogo de produtos e instaladores do site PT2VHF.
 *
 * Para publicar uma nova versão, edite apenas este arquivo:
 *   - version: número da versão (ex.: "1.4.2")
 *   - date:    data de lançamento no formato AAAA-MM-DD
 *   - files:   um item por instalador. "url" pode apontar para /downloads/...
 *              (arquivo no próprio repositório, até 100 MB) ou para um
 *              asset de GitHub Releases (recomendado para arquivos grandes).
 *
 * Itens com url vazia aparecem como "Em breve".
 */
window.PT2VHF_PRODUCTS = [
  {
    id: "prog",
    name: "PT2VHF Prog Tool",
    tagline: "Programação de rádios sem complicação",
    description:
      "Leia, edite e grave memórias, canais e configurações do seu rádio em uma planilha clara. Importe e exporte listas de repetidoras e mantenha backups de cada equipamento.",
    features: [
      "Edição de canais em formato de planilha",
      "Importação e exportação em CSV",
      "Backup e restauração da configuração do rádio",
      "Listas de repetidoras prontas para gravar"
    ],
    icon: "prog",
    version: "",
    date: "",
    files: [
      { os: "Windows", label: "Instalador (.exe)", url: "", size: "", sha256: "" }
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
