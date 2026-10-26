# PT2VHF Site

Site oficial de [www.pt2vhf.com](https://www.pt2vhf.com): divulgação e downloads do
**PT2VHF Prog Tool**, **PT2VHF Prop Tool**, **PT2VHF Mesh Analyzer** e **PT2VHF APRS Client**.

É um site estático (HTML, CSS e JavaScript puro, sem etapa de build). O repositório fica em
`gitlab.com/pt2vhf-group/pt2vhf-site` e a Hostinger publica automaticamente cada push na branch `main`
(veja [Hospedagem na Hostinger](#hospedagem-na-hostinger-atual)).

## Estrutura

```
index.html               Página principal (visão geral, uma seção por programa, instalação, sobre, contato)
updates.json             Versões e arquivos de cada programa  ← única fonte de versões (contrato abaixo)
404.html                 Página de erro
assets/css/style.css     Estilos (tema claro e escuro automáticos)
assets/js/products.js    Textos de cada programa (descrição, recursos, equipamentos, requisitos)
assets/js/main.js        Lê updates.json e monta a visão geral e a seção de cada programa
assets/img/              Favicon e imagem de compartilhamento
downloads/<pasta>/        Arquivos de cada versão (prog-tool, prop-tool, mesh-analyzer, aprs-client)
CNAME                    Domínio personalizado (www.pt2vhf.com)
.github/workflows/       Publicação automática no GitHub Pages
```

## updates.json: contrato de versões

`https://www.pt2vhf.com/updates.json` é a **única fonte de versões e arquivos**. O site lê esse
arquivo para montar as tabelas de download, e os programas o consultam para verificar se há
atualização (eles não consultam o GitLab nem o GitHub). Os nomes dos campos são um contrato com os
programas: **não renomeie nem remova campos**. Campos novos podem ser acrescentados.

```json
{
  "schema": 1,
  "updated": "2026-10-26",
  "products": {
    "prog": {
      "name": "PT2VHF Prog Tool",
      "version": "1.2.0",
      "date": "2026-10-25",
      "page": "https://www.pt2vhf.com/#prog",
      "notes": "Resumo curto das novidades, em texto puro.",
      "files": [
        {
          "category": "windows-installer",
          "label": "Windows — Instalador",
          "name": "PT2VHFProgTool-1.2.0-instalador.exe",
          "url": "https://www.pt2vhf.com/downloads/prog-tool/PT2VHFProgTool-1.2.0-instalador.exe",
          "size": 8887706,
          "sha256": "8cd72249be49808296bbf48e5f6c5fa5f10c2baab85bc67d5a1288055bface6b",
          "detail": "Windows 10/11 64 bits (recomendado)"
        }
      ]
    },
    "prop": { "name": "PT2VHF Prop Tool", "version": null, "page": "https://www.pt2vhf.com/#prop", "files": [] },
    "mesh": { "name": "PT2VHF Mesh Analyzer", "version": null, "page": "https://www.pt2vhf.com/#mesh", "files": [] },
    "aprs": { "name": "PT2VHF APRS Client", "version": null, "page": "https://www.pt2vhf.com/#aprs", "files": [] }
  }
}
```

| Campo | Regra |
|---|---|
| `schema` | Versão do formato. Hoje `1`. |
| `updated` | Data da última alteração do arquivo (`AAAA-MM-DD`). |
| `products.<id>` | Chaves fixas: `prog`, `prop`, `mesh`, `aprs` (as mesmas de `products.js`). |
| `version` | Versão publicada (`"1.2.0"`), ou `null` se ainda não há versão. Com `null`, o site mostra **Em breve**. |
| `date` | Data de lançamento (`AAAA-MM-DD`). |
| `page` | Página do programa no site. |
| `notes` | Resumo curto das novidades, em texto puro (sem Markdown nem HTML). |
| `files[].category` | Um destes valores, nesta ordem: `windows-installer`, `windows-portable`, `linux-deb`, `linux-targz`, `macos`, `source`, `checksums`. Use só as categorias que têm arquivo. |
| `files[].label` | Nome da categoria para leitura humana (`Windows — Instalador`, `Windows — Portátil`, `Linux — .deb (Debian/Ubuntu)`, `Linux — .tar.gz`, `macOS`, `Código-fonte`, `Somas de verificação`). |
| `files[].name` | Nome do arquivo. |
| `files[].url` | URL **absoluta**: `https://www.pt2vhf.com/downloads/<pasta>/<arquivo>`. |
| `files[].size` | Tamanho em **bytes** (inteiro). O site converte para "8,5 MB". |
| `files[].sha256` | SHA-256 em **minúsculas**. |
| `files[].detail` | Opcional: detalhe mostrado na tabela (sistemas suportados etc.). |

O servidor entrega o arquivo com `Content-Type: application/json; charset=utf-8`,
`Cache-Control: no-cache` e `Access-Control-Allow-Origin: *` (configurado no `.htaccess`).

Pastas de download: `prog` → `downloads/prog-tool/`, `prop` → `downloads/prop-tool/`,
`mesh` → `downloads/mesh-analyzer/`, `aprs` → `downloads/aprs-client/`.

## Publicar uma nova versão de um programa

1. Atualize o repositório: `git pull --rebase origin main`.
2. Copie os arquivos da versão para `downloads/<pasta>/` (instalador, portátil, `.deb`, `.tar.gz`,
   código-fonte e `SHA256SUMS.txt`, os que existirem). Arquivos acima de 100 MB não devem ir para o
   repositório. Pode apagar os arquivos da versão anterior.
3. Confira os hashes e anote tamanho e SHA-256 de cada arquivo:
   ```bash
   cd downloads/prog-tool
   sha256sum -c --ignore-missing SHA256SUMS.txt
   for f in *; do echo "$f $(stat -c %s "$f") $(sha256sum "$f" | cut -d' ' -f1)"; done
   ```
4. Edite `updates.json`: no programa, troque `version`, `date`, `notes` e a lista `files`
   (`category`, `label`, `name`, `url` absoluta, `size` em bytes, `sha256` em minúsculas, `detail`).
   Atualize também `updated` no topo.
5. Valide o JSON: `python3 -m json.tool updates.json > /dev/null && echo ok`.
6. Se a descrição ou os recursos do programa mudaram, edite `assets/js/products.js`
   (só textos; versões e arquivos não ficam lá).
7. Teste localmente (veja abaixo) e confira a tabela do programa.
8. Faça commit e envie: `git pull --rebase origin main && git push origin main`. Outras sessões
   também publicam neste repositório, por isso sempre faça `pull --rebase` antes do push e nunca
   use `push --force` na `main`.
9. A Hostinger implanta em cerca de um minuto. Confira em hPanel → Sites → pt2vhf.com → Avançado → GIT
   e teste `https://www.pt2vhf.com/updates.json` e um download.

## Configuração inicial (uma única vez)

1. Crie o repositório `PT2VHF-Site` no GitHub e envie este conteúdo:
   ```bash
   git remote add origin https://github.com/<usuario>/PT2VHF-Site.git
   git push -u origin main
   ```
2. Em **Settings → Pages**, em *Source*, escolha **GitHub Actions**.
3. Ainda em **Settings → Pages**, confirme o domínio personalizado `www.pt2vhf.com`
   e marque **Enforce HTTPS** quando o certificado ficar pronto.
4. No painel DNS do domínio `pt2vhf.com`, crie:

   | Tipo  | Nome | Valor                    |
   |-------|------|--------------------------|
   | CNAME | www  | `<usuario>.github.io`    |
   | A     | @    | `185.199.108.153`        |
   | A     | @    | `185.199.109.153`        |
   | A     | @    | `185.199.110.153`        |
   | A     | @    | `185.199.111.153`        |

   Os registros `A` fazem `pt2vhf.com` (sem www) redirecionar para `www.pt2vhf.com`.

## Hospedagem na Hostinger (atual)

O site está conectado ao repositório `pt2vhf-group/pt2vhf-site` no GitLab pela função **Git** do hPanel
(Sites → pt2vhf.com → Avançado → GIT), com implantação automática da branch `main` em `public_html`.
Basta fazer push na `main` para atualizar o site. Os passos abaixo servem para atualização manual.

1. No hPanel, abra **Arquivos → Gerenciador de Arquivos** e entre em `public_html`.
2. Envie o `pt2vhf-public_html.zip` e use **Extrair** dentro de `public_html`.
   O `.htaccess` incluído força HTTPS e `www`, usa a página 404 e faz os instaladores baixarem como arquivo.
3. Envie cada instalador para a pasta correspondente em `public_html/downloads/`
   (`prog-tool`, `prop-tool`, `mesh-analyzer`, `aprs-client`) e atualize o `updates.json`
   como descrito em [Publicar uma nova versão](#publicar-uma-nova-versão-de-um-programa).
4. Em **Segurança → SSL**, confirme que o certificado do domínio está ativo.

Para gerar o pacote: `git archive --format=zip -o pt2vhf-public_html.zip HEAD -- index.html 404.html .htaccess robots.txt sitemap.xml updates.json assets downloads`

## Alternativa: GitLab Pages

O repositório também publica no GitLab Pages pelo arquivo `.gitlab-ci.yml` (o `CNAME` e o workflow do GitHub são ignorados lá).

1. Crie o projeto `PT2VHF-Site` no GitLab (visibilidade **Public**) e envie o conteúdo:
   ```bash
   git remote add gitlab https://gitlab.com/<usuario>/PT2VHF-Site.git
   git push -u gitlab main
   ```
2. Aguarde o pipeline terminar em **Build → Pipelines**. O site fica em `https://<usuario>.gitlab.io/PT2VHF-Site/`.
3. Em **Deploy → Pages → New Domain**, adicione `www.pt2vhf.com` e deixe o certificado automático (Let's Encrypt) ativado.
4. No DNS de `pt2vhf.com`, crie os registros que o GitLab mostrar. Normalmente são:

   | Tipo  | Nome                              | Valor                                 |
   |-------|-----------------------------------|---------------------------------------|
   | CNAME | www                               | `<usuario>.gitlab.io`                 |
   | TXT   | _gitlab-pages-verification-code.www | código exibido pelo GitLab          |

5. De volta em **Deploy → Pages**, clique em **Verify** no domínio.

Quando a conta do GitHub voltar, basta adicionar o remote `origin` e seguir a configuração inicial acima. Os dois podem coexistir, mas o DNS deve apontar para apenas um deles.

## Testar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Catálogo de cinco programas (26/10/2026)

O site exibe **prog, prop, mesh, aprs e sat**. Além dos campos já existentes
em `updates.json`, são aceitos metadados informativos opcionais:
`developmentVersion` (versão presente no código, **não publicada**),
`releaseStatus` (situação da distribuição), `ciUrl` e `ciLabel`
(link de diagnóstico de CI que pode exigir autenticação GitLab).

**Regra de segurança para atualizadores:** enquanto não existir instalador
público permanente e verificado para o programa, `version` permanece `null`
e `files` permanece `[]`. Não colocar URLs efêmeras de artefatos CI em
`files`: elas expiram após 14 dias e podem exigir autenticação.

Estado verificado em 26/10/2026:
- Prog v1.2.0: arquivos presentes no diretório de downloads do site.
- APRS: código v1.14.58; CI Windows e Linux concluídos, artefatos internos.
- Prop: código v0.2.21; pacote Windows gerado, mas teste de instalação falhou.
- SAT: código v1.3.13 conforme README; build Windows travou na importação do Qt WebEngine.
- Mesh Analyzer: repositório/instalador ainda não localizado na conta GitLab conectada.

O catálogo pode apresentar informações sobre o CI, mas esses links não são
substitutos de instaladores públicos homologados.

## URLs próprias dos projetos (26/10/2026)

As cinco páginas possuem URLs estáveis: `/aprs`, `/prop`, `/mesh`,
`/sat` e `/prog`. Cada rota tem um documento estático em sua respectiva
raiz (`aprs.html`, `prop.html`, `mesh.html`, `sat.html`, `prog.html`).
O Apache/LiteSpeed da Hostinger realiza reescrita interna pelas regras
do arquivo `.htaccess`. O GitLab Pages recebe os arquivos HTML no artefato.

`index.html` mantém o catálogo e links entre os projetos. Os dados das
versões e downloads continuam em **`/updates.json`** (esquema 1, sem
quebrar os atualizadores); `products.<id>.page` aponta para cada nova rota.
O arquivo JavaScript compartilhado seleciona o conteúdo da página com
`body[data-program]` e resolve downloads a partir da raiz do domínio.

Favoritos antigos `/#aprs`, `/#prop`, `/#mesh`, `/#sat` e `/#prog`
são encaminhados para as novas páginas pelo navegador.

**Teste local:** `python -m http.server` não interpreta `.htaccess`;
abra `/prop.html` etc. Os endereços sem extensão são servidos pela Hostinger.

## Apresentação simplificada dos downloads (26/10/2026)

A interface pública de cada projeto **não exibe** links para baixar código-fonte,
arquivos de somas de verificação ou a coluna SHA-256. Apenas as categorias de
instalação e execução são exibidas: Windows instalador, Windows portátil, Linux
.deb, Linux .tar.gz e macOS.

O contrato `updates.json` **não foi alterado**: os campos `sha256`, além dos
registros internos `source` e `checksums`, são preservados para compatibilidade
com atualizadores e verificadores de integridade. Os arquivos de origem não
foram excluídos do repositório nem da hospedagem por esta alteração.

**Atenção à licença GPLv3 do Prog Tool:** distribuir binários requer disponibilizar
o código-fonte correspondente por um meio que cumpra os termos da licença.
Esta alteração remove a apresentação desses links no catálogo; não altera
as obrigações de licenciamento e deve-se manter uma oferta de código conforme a GPLv3.
