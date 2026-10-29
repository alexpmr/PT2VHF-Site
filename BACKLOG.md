# Backlog — site www.pt2vhf.com

## Pendentes

### Site não atualizou depois da publicação do QSL Analyzer 0.1.0 (29/10/2026)

- **Relato:** depois dos pushes de 29/10/2026 (commits `1008fc4` a `39002a1`), a página `/qsl` e o
  `update.php?product=qsl` não aparecem em www.pt2vhf.com.
- **Hipótese:** a implantação Git da Hostinger falhou ou não foi disparada; esses pushes acrescentaram
  ~780 MB de pacotes (repositório com ~2,1 GB), o que pode estourar tempo ou espaço da hospedagem.
- **Conferir no hPanel:** Sites → pt2vhf.com → Avançado → GIT → log da última implantação; clicar em
  Implantar. Se o erro for de tamanho, publicar menos pacotes por versão (ex.: sem portátil Windows e
  sem .tar.gz Linux) ou mover os binários grandes para fora do histórico do Git.

## Concluídos

### RESOLVIDO (29/10/2026) — PT2VHF QSL Manager 0.4.0 no site (Windows)

- Novo nome PT2VHF QSL Manager (antes QSL Analyzer) no menu de projetos, página `/qsl` (mesma URL), catálogo e
  textos em 7 idiomas; produto `qsl` mantido no `updates.json`, `update.php` e contadores (histórico preservado).
- Pacotes 0.4.0 com o nome de arquivo anterior, para o OTA da 0.3.0 instalar a versão nova.
- `scripts/test_qsl_download.php` confere no catálogo real que todo arquivo do `qsl` tem `counterKey` aceito,
  URL oficial e partes publicadas, e que downloads pelo site e pelo OTA (nomes antigo e novo) contam uma vez.

### RESOLVIDO (29/10/2026) — QSL Analyzer 0.3.0 no site (Windows); screenshots e changelog no fim da página

- `updates.json` com a 0.3.0 (instalador e portátil Windows); atualização automática (OTA) no app.
- Página `/qsl`: textos revisados, galeria de screenshots e changelog (0.1.0 a 0.3.0) no fim da página,
  depois dos downloads.

### RESOLVIDO (29/10/2026) — QSL Analyzer 0.2.0 no site (Windows) e screenshots reais

- `updates.json` com a 0.2.0 (instalador e portátil Windows); pacotes 0.1.0 de Linux/macOS removidos
  enquanto essas plataformas não são geradas (uma versão por produto no catálogo).
- Galeria da página `/qsl` com as 10 capturas enviadas pelo mantenedor (log real), legendas em pt/en/es.
- `scripts/sync_qsl_release.py --platforms windows` publica só as plataformas geradas.

### RESOLVIDO (29/10/2026) — Publicar o PT2VHF QSL Analyzer com versões para Windows, Linux e macOS

- Página `/qsl`, menu de projetos em todas as páginas, catálogo da home ("Seis projetos"), sitemap,
  textos em 7 idiomas (pt, en, es; fr/de/it/zh com o texto em inglês) e galeria com capturas reais.
- `downloads/qsl-analyzer/`: os 7 pacotes (instalador e portátil Windows, AppImage, .deb, .tar.gz e .dmg
  arm64/x64) ficam em partes < 100 MiB e o `download.php` remonta cada arquivo com HTTP 200 e Range;
  todo download conta uma vez (site e OTA), HEAD/Range não contam, partes avulsas não são servidas.
- `update.php?product=qsl` anuncia a versão por plataforma; o app mostra o aviso do site oficial a cada
  abertura e, em seguida, o aviso de versão nova.
- `scripts/sync_qsl_release.py` publica uma release (SHA-256 conferido); `scripts/test_qsl_download.php`
  cobre contagem, remontagem e `update.php`.

### RESOLVIDO (29/10/2026) — Contadores: todo download conta — manual e OTA, em todos os projetos

- **Relato (backlog):** parece que os contadores do site não sobem quando a atualização é feita
  internamente (OTA). Regra do mantenedor: atualização OTA conta **uma única vez por download**.
- **Conferir produto a produto** (como cada atualizador baixa e o que o `download.php` faz):
  - **APRS:** o arquivo baixado com User-Agent `PT2VHF-APRS-Client*` é entregue **sem contar**; a contagem
    depende do `POST action=count` que o cliente envia depois de validar o SHA-256 (`updater.py`). Se o
    POST falha, não é enviado em alguma plataforma (Win7 Legacy, Linux, macOS) ou vai com categoria fora de
    `$allowed`, a atualização some do contador. Ver também se versões antigas do cliente enviam o POST.
  - **Mesh / Sat / Prog:** o `POST` de contagem é ignorado (HTTP 204) e a contagem depende do GET do arquivo
    passar pelo `download.php` (rewrite no `.htaccess`). Confirmar que o atualizador usa a URL do
    `updates.json` sem cair num redirecionamento/caminho que escape do rewrite.
  - **Prog Tool:** **não há rewrite** de `downloads/prog-tool/` para o `download.php` no `.htaccess` e os
    arquivos do `updates.json` não têm `counterKey` — o OTA do Prog (e talvez o download direto) não conta.
  - **Prop / Sat:** rewrite do `.exe` remontado pelas partes; conferir que o OTA baixa esse `.exe` (e não
    as partes ou `parts.json`, que não contam).
- **Decisão do mantenedor (29/10/2026): tudo conta como download, em todos os projetos** (APRS, Mesh,
  Prop, Prog, Sat e os que vierem): download **manual** pelo site e atualização **por dentro da aplicação**
  (OTA), em todas as plataformas e tipos de pacote (instalador, portátil, AppImage, .deb, .tar.gz, .dmg,
  Win7 Legacy). Cada download conta **uma vez** — sem somar duas vezes o GET e o POST do mesmo download, e
  sem contar HEAD/Range/retomadas. Todos os arquivos de `downloads/<pasta>/` passam pelo `download.php` e
  todos os itens do `updates.json` têm `counterKey`; nenhum produto fica de fora (hoje o Prog Tool fica).
  Mesma regra vale para versões antigas dos apps já instaladas.
- **Teste:** para cada produto, simular o download do atualizador (mesmo User-Agent e fluxo do app) contra
  `php -S` e verificar +1 exatamente uma vez; ampliar `scripts/test_download_counter.php` para todos os
  produtos e plataformas. Registrar no log do servidor (sem dados pessoais) produto/categoria/origem OTA.
- **Resolvido:** `download.php` conta todo download no GET do arquivo, inclusive o do atualizador do APRS
  (antes só o POST posterior contava e, se falhasse, a atualização sumia do contador); o POST de contagem
  das versões antigas é ignorado (204) para não contar duas vezes; retomadas (Range) e HEAD não contam;
  categorias `win7-*` aceitas; `ota` no `mode=stats` mostra quantos downloads vieram dos atualizadores.
  Prog Tool já passava pelo `download.php` (rewrite existente) — a observação acima estava errada.


- **Sat Tool — captura de tela real na página `/sat`** (registrado e concluído em 28/10/2026)
  - Imagem: `docs/backlog/sat-operacao-v1.3.15.png` (aba Operação da v1.3.15, recortada).
  - Publicar em `assets/screenshots/sat/` (WebP + original), adicionar em `PT2VHF_GALLERIES.sat`
    (`assets/js/gallery.js`) como `type:"screenshot"`, antes do logo, com legenda nos 7 idiomas
    (`captionId` novo nos `assets/js/locales/*.js`).
  - Feito: `operacao-v1.3.15.webp` + `original/operacao-v1.3.15.png`, primeiro item da galeria
    `sat` (`captionId` `satOperation` nos 7 idiomas); cache `?v=20261028-satshot`.

- **Tabelas de download de todos os programas — coluna com a data de release** (registrado e concluído em 28/10/2026)
  - Roadmap do mantenedor: "Em todos os projetos, tabela de downloads, incluir uma coluna com a
    data de release".
  - Fonte da data: `products.<id>.date` do `updates.json` (já existe; `AAAA-MM-DD`). Formatar
    conforme o idioma da página e incluir o rótulo da coluna nos 7 idiomas
    (`assets/js/locales/*.js`); a montagem da tabela fica em `assets/js/main.js`.
  - Feito: coluna "Lançamento" (`catDate`) nas duas tabelas de `main.js`, com a data do arquivo
    ou da versão; Prog Tool passou a ser contado só pelo servidor (sem contagem dupla).
