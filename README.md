# PT2VHF Site

Site oficial de [www.pt2vhf.com](https://www.pt2vhf.com): divulgação e downloads do
**PT2VHF Prog Tool**, **PT2VHF Prop Tool**, **PT2VHF Mesh Analyzer** e **PT2VHF APRS Client**.

É um site estático (HTML, CSS e JavaScript puro, sem etapa de build), publicado pelo GitHub Pages.

## Estrutura

```
index.html               Página principal (programas, downloads, instalação, sobre, contato)
404.html                 Página de erro
assets/css/style.css     Estilos (tema claro e escuro automáticos)
assets/js/products.js    Catálogo de programas, versões e links dos instaladores  ← edite aqui
assets/js/main.js        Monta os cartões e a tabela de downloads
assets/img/              Favicon e imagem de compartilhamento
downloads/<programa>/    Instaladores hospedados no próprio repositório (opcional)
CNAME                    Domínio personalizado (www.pt2vhf.com)
.github/workflows/       Publicação automática no GitHub Pages
```

## Publicar uma nova versão de um programa

1. Coloque o instalador em um destes lugares:
   - **GitHub Releases** (recomendado): crie uma release neste repositório e anexe o `.exe`.
     Use a URL do asset, ex.: `https://github.com/<usuario>/PT2VHF-Site/releases/download/prog-v1.0.0/PT2VHF-Prog-Tool-1.0.0-setup.exe`.
   - **No próprio repositório**: copie o arquivo para `downloads/prog-tool/` e use a URL
     `downloads/prog-tool/PT2VHF-Prog-Tool-1.0.0-setup.exe`. O GitHub recusa arquivos acima de 100 MB.
2. Edite `assets/js/products.js` e preencha `version`, `date` e, em `files`, `url`, `size` e `sha256`.
   Para obter o hash:
   - Windows: `certutil -hashfile PT2VHF-Prog-Tool-1.0.0-setup.exe SHA256`
   - Linux/macOS: `sha256sum PT2VHF-Prog-Tool-1.0.0-setup.exe`
3. Faça commit e push na branch `main`. O site é atualizado em cerca de um minuto.

Programas com `url` vazia aparecem como **Em breve**. Para oferecer outro sistema operacional,
adicione mais um item em `files` (ex.: `{ os: "Linux", label: "AppImage", url: "...", ... }`).

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

## Testar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
