# Backlog — site www.pt2vhf.com

## Pendentes

Nenhum item pendente.

## Concluídos

### RESOLVIDO (24/11/2026) — Campo de produto no formulário de contato e e-mail mais enxuto

- **Pedido do Alex:** escolher o produto do comentário: Cliente APRS para PC, Cliente APRS para Android/iOS, Prop Tool,
  SDR Tool, QSL Manager, Mesh Analyzer e Outros. No e-mail, tirar "Idioma da página", "Data (UTC)" e o rótulo "Mensagem".
- **Feito:** lista obrigatória ao lado do indicativo, traduzida nos 7 idiomas; o servidor só aceita os valores da lista
  (`PT2VHF_CONTACT_PRODUCTS`) e põe o produto no assunto (`[Site PT2VHF · Prop Tool] Assunto — PY2XYZ`) e no corpo.
  O corpo agora traz nome, e-mail, indicativo, produto e assunto, seguidos do texto do visitante.

### RESOLVIDO (24/11/2026) — Campo opcional de indicativo no formulário de contato

- **Pedido do Alex:** campo "Indicativo de radioamador", opcional, no formulário de `/contato`.
- **Feito:** campo ao lado do assunto (abaixo dele no celular), em maiúsculas, traduzido nos 7 idiomas (`formCallsign`).
  O `enviar-contato.php` valida só quando informado (letras, números, `/` e SSID opcional, com ao menos um número,
  até 20 caracteres) e põe o indicativo no assunto (`[Site PT2VHF] Assunto — PY2XYZ`) e no corpo do e-mail.
  Teste em `scripts/test_contact.php`.

### RESOLVIDO (24/11/2026) — Formulário de contato: a Hostinger não envia e-mail pelo PHP

- **Relato:** depois da publicação do formulário em `/contato`, o envio real falhou para o Alex e para o teste
  automático. Diagnóstico em produção: `mail()` do PHP retorna falha com e sem remetente de envelope (`-f`), resposta
  `{"status":"erro","stage":"mail-failed"}` às 01:22 UTC. Nenhum e-mail do site (nem os avisos do `testers.php`)
  aparece no Gmail do Alex nos últimos 30 dias, então o `mail()` provavelmente nunca funcionou nesta hospedagem.
- **Contorno no ar:** a mensagem fica guardada em `../pt2vhf-private-data/contact-messages.jsonl` (fora do site) e o
  visitante vê "Mensagem recebida"; o `/stats` mostra só a quantidade guardada. Falha de servidor tem texto próprio.
- **Escolha do Alex (24/11/2026): SMTP autenticado pela caixa alex@pt2vhf.com** (smtp.hostinger.com, 465, SSL/TLS),
  remetente sempre `alex@pt2vhf.com`, destino `alexpmr@gmail.com`, Reply-To = e-mail do visitante.
- **Feito:** `mail_lib.php` lê `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`,
  `SMTP_FROM_NAME` e `CONTACT_RECIPIENT` das variáveis de ambiente ou, na falta delas (hospedagem compartilhada),
  de `../pt2vhf-private-data/smtp.env` (fora do site; modelo sem senha em `.env.example`; `.gitignore` e `.htaccess`
  protegem). `enviar-contato.php` valida os 4 campos obrigatórios com tamanho máximo, remove HTML/scripts, tem
  armadilha anti-robô, recusa envio em menos de 3 s, limita por IP sem gravar IP e registra falhas só no log do
  servidor. O formulário envia sem recarregar, limpa só após envio confirmado e mantém os campos em caso de erro.
  Testes: `scripts/test_contact.php` e `scripts/test_mail_lib.php`.
- **Verificado em produção (24/11/2026):** o Alex criou o `smtp.env`; o `/stats` reconheceu smtp.hostinger.com:465 (SSL)
  e o teste chegou ao Gmail com remetente alex@pt2vhf.com, junto com 2 mensagens guardadas. A terceira foi recusada por
  logins SMTP seguidos; o reenvio passou a esperar 2 s entre os envios (commits `08735cb` e `1b7d224`).
- **Troca a pedido do Alex (24/11/2026):** o `smtp.env` passou a usar o SMTP do Gmail (smtp.gmail.com:465, conta
  alexpmr@gmail.com com senha de app), para as notificações chegarem como "Site PT2VHF" <alexpmr@gmail.com>.
  Teste do `/stats` conferido na caixa de entrada. Nenhuma mudança de código; a caixa alex@pt2vhf.com deixou de ser
  usada pelo site.

### RESOLVIDO (24/11/2026) — Site no idioma do navegador e todas as páginas nos 7 idiomas

- **Pedido do Alex:** o site deve abrir sempre no idioma do sistema/navegador do visitante, e todas as páginas devem ter
  tradução nos 7 idiomas (pt, en, es, fr, de, it, zh). Os aplicativos não foram alterados.
- **Idioma:** `main.js` e `page-i18n.js` usam o primeiro idioma da lista do navegador que o site tem (sem nenhum,
  inglês). O seletor muda o idioma só na aba (sessionStorage); `?lang` e a escolha antiga salva não prendem mais o idioma.
- **Traduções novas:** QSL Manager em fr/de/it/zh (textos, legendas e changelog), requisitos do Prop Tool, equipamentos
  do APRS Android, observações e rótulos dos arquivos do `updates.json` (`fileText` nos arquivos de idioma, com `{v}`
  no lugar da versão), faixas de tópicos das páginas de produto (`staticText`), `/privacidade` completa em 7 idiomas
  (um bloco por idioma) e `/speed`, `/speed-ios` e `/404` via `assets/js/page-i18n.js`, sem mudar a marcação que os
  scripts de publicação do Speed reescrevem.
- **Ao publicar versão nova:** observação nova de arquivo no `updates.json` precisa da tradução em `fileText` dos
  6 idiomas; sem ela, aparece em português.

### RESOLVIDO (24/11/2026) — Formulário de contato por e-mail em /contato

- **Origem:** a IA da Hostinger criou o formulário (commits `c8eb0e9` e `93604b7`), mas o `contato.html` dela
  trocava a página inteira: sumiam o menu de projetos, o seletor de 7 idiomas, o WhatsApp, a lista "Ao relatar um
  problema" e a contagem do `/stats`. O `enviar-contato.php` não tinha limite de envios e mandava o assunto sem
  codificação UTF-8.
- **Feito (escolha do Alex):** página anterior restaurada, com o formulário "Ou escreva por aqui" entre os canais e a
  lista de ajuda, no visual do site e traduzido nos 7 idiomas (`contact-data.js`). `enviar-contato.php` no padrão do
  `testers.php`: assunto e nome em UTF-8, envelope `nao-responda@pt2vhf.com`, Reply-To de quem escreveu, armadilha
  anti-robô, limite de 5 mensagens por IP e 60 por dia (HMAC com chave diária, sem gravar IP), nada mais é gravado.
  Respostas: `/contato?contato=ok|erro|limite#formulario`.
- Testes: `scripts/test_contact.php` (sendmail falso) e `scripts/test_site_navigation.cjs` (expressão das rotas
  atualizada para a rota `privacidade`).

### RESOLVIDO (23/11/2026) — Página de estatísticas de visitas em /stats

- **Pedido do Alex:** página www.pt2vhf.com/stats com estatísticas de quem visita o site, só para ele, sem link no
  site e, a pedido, sem senha.
- **Coleta:** `assets/js/visit.js` em todas as páginas envia um beacon para `visit.php` com o caminho, o domínio de
  origem externo, o idioma e o fuso do navegador. Sem cookies e sem serviços de terceiros. Visitante único por dia =
  HMAC de (IP + User-Agent) com chave do dia, descartada na virada (mesmo esquema do `installs_lib.php`); IP e
  User-Agent não são gravados, só as categorias. Robôs, navegadores automatizados, origens externas e o cookie
  `pt2vhf_nostats=1` (botão "Não contar este navegador" no painel) não contam.
- **Dados:** `../pt2vhf-private-data/visits-AAAA-MM.json` (totais diários) e `visits-state.json` (chave do dia).
- **Painel `stats.php` (`/stats`):** períodos de hoje a 1 ano; visitantes, páginas vistas, gráfico diário, páginas,
  entrada, origem, país, fuso, idioma, dispositivo, navegador, sistema e
  horário (Brasília); downloads acumulados e instalações ativas. `noindex`, fora do sitemap e do robots.
- Política de privacidade com o aviso das estatísticas do site. Teste em `scripts/test_visits.php`.
- **País (pedido do Alex, 23/11/2026):** estimado pelo IP na hora da visita com a base local DB-IP Lite (CC BY 4.0),
  em `geo/country-ipv4.bin` e `geo/country-ipv6.bin` (busca binária em `pt2vhf_geo_country`, bloqueados por
  `.htaccess`). O IP continua sem ser gravado nem enviado a terceiros. Atualizar a base: `npm pack
  @ip-location-db/dbip-country` e `scripts/build_country_db.py` (versão em `geo/VERSION`). O painel mostra bandeira
  e nome em português, com o link "IP Geolocation by DB-IP" exigido pela licença.

### RESOLVIDO (APRS Client v2.0.2, 14/11/2026) — Contagem aproximada de instalações ativas

- **Verificado em produção (23/11/2026):** `installs.php?product=aprs` responde HTTP 200.

- **Pedido do Alex (aprovado em 13/11/2026):** contar as instalações ativas, inclusive versões antigas que não mandam
  indicativo, sem guardar IP nem indicativo.
- **Entregue:** `installs_lib.php`, chamado pelo `update.php` em toda consulta de todos os produtos. Cada consulta vira
  um hash HMAC de (IP + User-Agent) com chave aleatória do dia; chave e hashes somem na virada do dia UTC e fica só o
  total diário (400 dias), em `../pt2vhf-private-data/installs.json`. A resposta do `update.php` não muda.
  Resumo público em `installs.php?product=<produto>` (hoje, média dos 7 dias completos, maior dia, 30 dias); a
  seção de estações de `/aprs`, `/android` e `/sat` mostra "Cerca de N instalações ativas por dia". É aproximado:
  instalações atrás do mesmo IP contam como uma. Teste em `scripts/test_installs.php`.
- **APRS Client v2.0.2 só Windows:** `scripts/publish_aprs_release.py --only windows` publica os binários Windows da
  versão nova e mantém Linux/macOS da 2.0.1 no manifesto (campo `version` por arquivo). No Linux/macOS o app vê a
  2.0.2 anunciada sem pacote compatível e não oferece atualização.

### RESOLVIDO (APRS Client v2.0.0, 13/11/2026) — Estações do APRS Client e comparação de recursos em /aprs

- **Verificado em produção (23/11/2026):** `stations.php?product=aprs` responde HTTP 200.

- **Estações por país:** produto `aprs` no registro (`stations_lib.php`), seção no fim de `/aprs` igual à de `/android`
  (ranking com bandeira e indicativos de cada país). Substitui o PR #25, que tinha conflito com o registro do Android.
  O app envia `update.php?product=aprs&call=...` a partir da v2.0.0. Teste em `scripts/test_stations.php`.
- **Comparação de recursos (backlog 12/11/2026):** WinAPRS × APRS World × PT2VHF APRS Client, no mesmo formato da
  tabela do Android (`assets/js/compare-data-aprs.js`). Valores sem fonte ficam como "Não confirmado".
- **Changelog corrigido:** as notas 1.15.2–1.15.9 do APRS Client tinham entrado nos blocos do QSL (pt/en/es) e do Sat
  (fr/de/it/zh) em `changelog-data.js`; voltaram para o APRS, com a 2.0.0 no topo.

### RESOLVIDO (verificado em 23/11/2026) — Estações que usam o APRS Client for Android (indicativos por país) (13/11/2026)

- **Verificado em produção (23/11/2026):** `stations.php?product=aprs-android` responde HTTP 200 (85 estações) e a seção de estações aparece em `/android`.

- **Pedido do Alex:** o mesmo registro do SAT Tool para o app Android (produto `aprs-android`, item #84 do
  PT2VHF-APRS-Android): ranking de países e indicativos de cada país no fim da página `/aprs-android`, com bandeira em
  imagem no lugar da sigla, em todos os idiomas.
- **Contrato com o app:** `update.php?product=aprs-android&call=PY2XYZ`, só o indicativo (sem SSID, posição ou
  locator); resposta do `update.php` idêntica com ou sem `call`.
- **Feito no PR:** `aprs-android` em `PT2VHF_STATION_PRODUCTS` (mesmo arquivo, mesmas regras: DXCC, sem IP, 10 novos por
  IP por dia somando os produtos, registro permanente), seção em `android.html`, cache busting e teste em
  `scripts/test_stations.php`. Publicar só com aprovação do Alex.

### RESOLVIDO (verificado em 23/11/2026) — Estações que usam o SAT Tool (indicativos por país) (13/11/2026)

- **Verificado em produção (23/11/2026):** `stations.php?product=sat` responde HTTP 200 (3 estações) e a seção aparece em `/sat`.

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

### RESOLVIDO (verificado em 23/11/2026) — Banner PT2VHF em inglês (10/11/2026)

- **Verificado em produção (23/11/2026):** a home referencia `pt2vhf-hero-banner-en.svg` e a imagem responde HTTP 200.

- **Solicitação:** retirar o carro e a pessoa, reduzir a altura do banner e retirar a assinatura "por Alex, PT2VHF"; usar títulos em inglês.
- **Código pronto na branch `main`:** novo `assets/img/pt2vhf-hero-banner-en.svg` (2000 × 520), página `index.html` apontando para a arte, e teste do site atualizado.
- **Commits:** `0d4a76214c9b62ed1cf136ffc7577998914f8b69` (arte), `0bf2b74904706f805ddaebd2e3bbf9b9db12e387` (index), `6633f05b93621e38aeac86071a859081d3426651` (teste).
- **Verificação em produção:** após os commits, `https://www.pt2vhf.com/` ainda referenciava `pt2vhf-hero-banner.webp`; a nova URL `/assets/img/pt2vhf-hero-banner-en.svg` retornava HTTP 404. Confirmado novamente com parâmetros de cache-busting. **Não considerar publicado em produção.**
- **Próxima ação:** conferir o status de Auto-deployment, o commit atual e o log de deploy em **Hostinger hPanel → Sites → pt2vhf.com → Avançado → Git**; se necessário, clicar **Redeploy** da `main`. Depois validar a imagem no navegador desktop e celular, sem cache, e a URL direta com HTTP 200.

### RESOLVIDO (verificado em 23/11/2026) — APRS Android v0.1.10 Beta QA (08/11/2026)

- **Verificado em produção (23/11/2026):** superado. O site público anuncia o APRS Android 1.4 (18/11/2026) em `updates.json` e `update.php?product=aprs-android`.

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

### RESOLVIDO (verificado em 23/11/2026) — Site não atualizou depois da publicação do QSL Analyzer 0.1.0 (29/10/2026)

- **Verificado em produção (23/11/2026):** `/qsl` responde HTTP 200 (PT2VHF QSL Manager) e `update.php?product=qsl` anuncia a 0.6.0; a implantação da Hostinger está funcionando.

- **Relato:** depois dos pushes de 29/10/2026 (commits `1008fc4` a `39002a1`), a página `/qsl` e o
  `update.php?product=qsl` não aparecem em www.pt2vhf.com.
- **Hipótese:** a implantação Git da Hostinger falhou ou não foi disparada; esses pushes acrescentaram
  ~780 MB de pacotes (repositório com ~2,1 GB), o que pode estourar tempo ou espaço da hospedagem.
- **Conferir no hPanel:** Sites → pt2vhf.com → Avançado → GIT → log da última implantação; clicar em
  Implantar. Se o erro for de tamanho, publicar menos pacotes por versão (ex.: sem portátil Windows e
  sem .tar.gz Linux) ou mover os binários grandes para fora do histórico do Git.

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
