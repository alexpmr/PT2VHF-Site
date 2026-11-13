# Backlog — site www.pt2vhf.com

## Pendentes

### Estações que usam o SAT Tool (indicativos por país) — PR aberto, aguardando aprovação (13/11/2026)

- **Pedido do Alex:** ao consultar versão nova, o app envia o indicativo da estação; o site mostra, no fim da
  página `/sat`, um ranking de países e a lista de indicativos de cada país (estilo APRS World).
- **Contrato com o app (v1.8.0, PR #34 do PT2VHF-Sat-Tool):** `update.php?product=sat&call=PY2XYZ`, só o
  indicativo, URL-encoded. A resposta do `update.php` não muda; falha no registro é silenciosa.
- **Implementado no PR:** `stations_lib.php` (validação, país por prefixo DXCC, uma gravação por indicativo
  por dia, sem guardar IP, limite de 10 indicativos novos por IP/dia e 300/dia no total), `stations.php`
  (resumo público; registros permanentes, sem expiração, a pedido do Alex), `stations_prefixes.php` gerado por `scripts/build_station_prefixes.py`
  a partir do dxcc.json (k0swe/dxcc-json, Apache-2.0), seção "Estações usando o SAT Tool" em `sat.html`
  e teste `scripts/test_stations.php`. Dados em `../pt2vhf-private-data/stations.json`.
- **Depois do merge:** verificar em produção `stations.php?product=sat` (HTTP 200) e a seção na página `/sat`;
  ela só aparece quando o endpoint responde e lista estações a partir da 1.8.0 do app.

### Banner PT2VHF em inglês — GitHub atualizado, publicação na Hostinger pendente (10/11/2026)

- **Solicitação:** retirar o carro e a pessoa, reduzir a altura do banner e retirar a assinatura "por Alex, PT2VHF"; usar títulos em inglês.
- **Código pronto na branch `main`:** novo `assets/img/pt2vhf-hero-banner-en.svg` (2000 × 520), página `index.html` apontando para a arte, e teste do site atualizado.
- **Commits:** `0d4a76214c9b62ed1cf136ffc7577998914f8b69` (arte), `0bf2b74904706f805ddaebd2e3bbf9b9db12e387` (index), `6633f05b93621e38aeac86071a859081d3426651` (teste).
- **Verificação em produção:** após os commits, `https://www.pt2vhf.com/` ainda referenciava `pt2vhf-hero-banner.webp`; a nova URL `/assets/img/pt2vhf-hero-banner-en.svg` retornava HTTP 404. Confirmado novamente com parâmetros de cache-busting. **Não considerar publicado em produção.**
- **Próxima ação:** conferir o status de Auto-deployment, o commit atual e o log de deploy em **Hostinger hPanel → Sites → pt2vhf.com → Avançado → Git**; se necessário, clicar **Redeploy** da `main`. Depois validar a imagem no navegador desktop e celular, sem cache, e a URL direta com HTTP 200.


### APRS Android v0.1.10 Beta QA — GitHub preparado; Hostinger ainda na v0.1.9 (08/11/2026)

- **Repositório do site atualizado:** commit `84efc53bc992fdda8341fcca331408e50cfc2201` e ajustes posteriores.
- APK Android assinado, 7.992.699 bytes, SHA-256 `0a656898f98b354ff460c962089ccabb46ab63e76d15c78adaa9f6f905b8ac07`;
  armazenado em 12 segmentos Git, reconstruídos no `download.php` pelo suporte `prop_parts.php`.
  `counterKey=android-apk` preservado; `.htaccess` impede acessar segmentos diretamente.
- `updates.json` da branch `main` anuncia **0.1.10 QA beta**, com link oficial, tamanho e SHA-256;
  página Android, catálogo e changelog de cinco versões ajustados.
- **Bloqueio observado:** o workflow do repositório `PT2VHF-Site` falhou **antes de iniciar o runner**
  nas execuções `42541710070` e `42541891213` (assim como runs anteriores do site);
  importação via GitHub App foi usada como alternativa e o commit do site foi concluído.
- **Verificação pública após o push:** `https://www.pt2vhf.com/updates.json` e
  `update.php?product=aprs-android` ainda retornaram **0.1.9**, a página não exibiu o aviso de QA.
  A implantação **na Hostinger não está confirmada**.
- **Próxima ação:** no hPanel Hostinger, implantar a branch `main` do repositório
  `alexpmr/PT2VHF-Site` e validar: a página `/aprs-android`, `updates.json`, `update.php`,
  HEAD do APK (`Content-Length: 7992699`) e checksum SHA-256 de um download real.
  Não declarar entrega pública sem esta verificação.
- O APK é **QA beta**, não homologado por RF/APRS-IS; backlog funcional continua aberto.


### Site não atualizou depois da publicação do QSL Analyzer 0.1.0 (29/10/2026)

- **Relato:** depois dos pushes de 29/10/2026 (commits `1008fc4` a `39002a1`), a página `/qsl` e o
  `update.php?product=qsl` não aparecem em www.pt2vhf.com.
- **Hipótese:** a implantação Git da Hostinger falhou ou não foi disparada; esses pushes acrescentaram
  ~780 MB de pacotes (repositório com ~2,1 GB), o que pode estourar tempo ou espaço da hospedagem.
- **Conferir no hPanel:** Sites → pt2vhf.com → Avançado → GIT → log da última implantação; clicar em
  Implantar. Se o erro for de tamanho, publicar menos pacotes por versão (ex.: sem portátil Windows e
  sem .tar.gz Linux) ou mover os binários grandes para fora do histórico do Git.

## Concluídos

### RESOLVIDO (07/11/2026) — PT2VHF SDR Tool 0.5.0 no ar e funcionando

- Publicado na `main` (commits `43da66d`…`6075010`) a partir da Release `v0.5.0` (run 42397078694, SHA-256
  conferidos). A verificação automática pelo GitHub Actions recebeu HTTP 429 da Hostinger (run 42398177173); o
  mantenedor confirmou em 07/11/2026 que a versão ficou boa e está funcionando.
- Supera a pendência da 0.4.1 (que não abria o RTL-SDR): a 0.5.0 traz a correção.

### RESOLVIDO (07/11/2026) — PT2VHF SDR Tool 0.4.0 no ar

- Verificado no endereço público pelo workflow `verify-site` do `alexpmr/PT2VHF-SDR-Tool` (run 42387645413):
  `update.php?product=sdr` anuncia a 0.4.0 com instalador e portátil, `/sdr` e `updates.json` atualizados, e os dois
  `.exe` baixados de www.pt2vhf.com conferem tamanho e SHA-256 (download com Range, sem inflar os contadores).
- A tentativa anterior também mostrou a 0.3.0 no ar antes da implantação da 0.4.0 (publicação da 0.3.0 confirmada).

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
