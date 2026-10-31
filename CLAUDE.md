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

## Regra permanente — toda nova versão do PT2VHF APRS Client for Android

Autorização do mantenedor: cada nova versão do app `alexpmr/PT2VHF-APRS-Android` deve
incluir a publicação coordenada neste site (`alexpmr/PT2VHF-Site`). Não considerar
uma release finalizada apenas porque o APK saiu no GitHub Actions.

1. Concluir alterações, testes e geração de **APK release assinado**; conferir tag,
   `versionName` e `versionCode` do Android, assinatura e integridade do binário.
2. Copiar o APK **real e verificado** para `downloads/aprs-android/`. Não anunciar versão
   nem criar link com arquivo ausente. Nunca apontar o usuário para URL temporária de CI.
3. Atualizar `updates.json`, produto **`aprs-android`**: `version`, `date`,
   `notes`, `files` (`name`, `url`, `size`, `sha256`, `platform`,
   `category`, `counterKey`), além do campo global `updated`. Manter
   `counterKey: "android-apk"` estável entre versões: a contagem histórica é
   cumulativa por tipo de instalador, não por versão.
4. Atualizar a página `/android`: recursos e requisitos quando mudarem,
   changelog das **últimas cinco versões** em `assets/js/changelog-data.js`,
   textos/traduções pertinentes e cache busting dos scripts quando modificados.
   A tabela de downloads é montada de `updates.json` por `assets/js/main.js`;
   não duplicar versão ou dados do APK diretamente no HTML.
5. Validar o manifesto, integridade, links, tabela, contagem via `download.php`
   (manual e OTA, **uma vez por download**, sem zerar dados), e resposta do
   `update.php?product=aprs-android`. A verificação OTA do app deve apontar
   somente para `www.pt2vhf.com`.
6. Publicar mudanças do site em `main` e **verificar o endereço público**
   `https://www.pt2vhf.com/android`, `/updates.json`, o endpoint OTA e
   o download real após implantação Hostinger; se a implantação não se confirmar,
   registrar e informar a pendência. Nunca afirmar "site atualizado" apenas pelo
   sucesso do commit.
7. Não iniciar versão nova por conta própria: esta é uma regra do fluxo de
   publicação quando o mantenedor solicitar a próxima versão.

- **Todo novo item de backlog deve ser registrado imediatamente no GitHub:** atualizar `BACKLOG.md` no repositório correspondente e realizar commit de documentação no mesmo atendimento. Não basta mencionar a pendência na conversa. Confirmar repositório/branch/commit; não implementar nem publicar versão até pedido explícito. Se o commit falhar, informar claramente que o registro não foi concluído.
