# Backlog — site www.pt2vhf.com

## Pendentes

- **Sat Tool — captura de tela real na página `/sat`** (registrado em 28/10/2026)
  - Imagem: `docs/backlog/sat-operacao-v1.3.15.png` (aba Operação da v1.3.15, recortada).
  - Publicar em `assets/screenshots/sat/` (WebP + original), adicionar em `PT2VHF_GALLERIES.sat`
    (`assets/js/gallery.js`) como `type:"screenshot"`, antes do logo, com legenda nos 7 idiomas
    (`captionId` novo nos `assets/js/locales/*.js`).

## Concluídos

- **Tabelas de download de todos os programas — coluna com a data de release** (registrado e concluído em 28/10/2026)
  - Roadmap do mantenedor: "Em todos os projetos, tabela de downloads, incluir uma coluna com a
    data de release".
  - Fonte da data: `products.<id>.date` do `updates.json` (já existe; `AAAA-MM-DD`). Formatar
    conforme o idioma da página e incluir o rótulo da coluna nos 7 idiomas
    (`assets/js/locales/*.js`); a montagem da tabela fica em `assets/js/main.js`.
  - Feito: coluna "Lançamento" (`catDate`) nas duas tabelas de `main.js`, com a data do arquivo
    ou da versão; Prog Tool passou a ser contado só pelo servidor (sem contagem dupla).
