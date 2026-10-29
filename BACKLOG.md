# Backlog — site www.pt2vhf.com

## Pendentes

(nenhum)

## Concluídos

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
