# Regras do mantenedor para todos os projetos PT2VHF

- Mensagens que começam com **"Roadmap:"** ou **"Backlog:"** só registram o item no `BACKLOG.md`
  do projeto; não implementar até o pedido de versão nova.
- **"Gerar versão nova"** de qualquer projeto significa, nesta ordem:
  1. resolver todos os itens pendentes do `BACKLOG.md` do projeto;
  2. gerar a release completa (CI verde, merge, build de produção);
  3. publicar no site: instaladores em `downloads/<pasta>/` deste repositório e `updates.json`
     (versão, tamanho, SHA-256); o push na `main` daqui publica na Hostinger;
  4. garantir que os clientes instalados percebam a versão nova (consulta a
     `https://www.pt2vhf.com/update.php?product=<produto>` e aviso de atualização).
- Downloads e atualizações oficiais são **somente** por www.pt2vhf.com. GitLab aposentado: não usar.
  GitHub Releases servem só como origem dos arquivos gerados pelo Actions.
- Atualizações OTA também contam nos contadores do site (`download.php`), uma única vez por download.
