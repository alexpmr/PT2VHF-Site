# Publicação APRS 1.14.59 no PT2VHF.com

Estado inicial: o código e testes estão no GitLab, mas a publicação só é
autorizada quando os instaladores gerados em CI forem transferidos à
hospedagem e testados de fato. Não use URLs dos artefatos privados do GitLab
no manifesto. A interface pública nunca exibe código-fonte nem checksums.

## Pacotes

As compilações de Windows 10/11 x64 e Linux x86_64 são acionadas manualmente
em CI/CD no projeto APRS. ARM64 e macOS permanecem na tabela como
"pendentes" até existir build real e validado.

## Publicar na Hostinger

1. Obtenha os .exe, .deb, .AppImage, .tar.gz gerados pelo GitLab CI.
2. Teste instalação/execução em Windows 10/11 e Linux de destino.
3. Coloque os arquivos originais em public_html/downloads/aprs-client/.
4. Confirme que cada URL https://www.pt2vhf.com/downloads/aprs-client/NOME
   devolve o arquivo inteiro por HTTPS, sem redirecionamentos.
5. Em uma cópia do repositório pt2vhf-site com OS MESMOS instaladores no
   diretório downloads/aprs-client, execute:
   python scripts/sync_aprs_manifest.py --version 1.14.59
   python scripts/sync_aprs_manifest.py --version 1.14.59 --apply
6. Faça commit de updates.json e sincronize-o na Hostinger somente depois
   da verificação dos arquivos físicos na hospedagem.
7. Valide https://www.pt2vhf.com/update.php?product=aprs
   (status=available, arquivos da versão e hashes corretos).
8. Teste atualização real da 1.14.58 para a 1.14.59. Como 1.14.58 ainda
   consultava o GitHub, poderá ser necessária instalação manual inicial
   para migrar o canal OTA. Testar futuras atualizações partindo da 1.14.59.

## Contadores

Os contadores por tipo/arquitetura ficam no arquivo privado
pt2vhf-private-data/downloads.json e não são zerados por uma nova versão.
Downloads pelo site incrementam ao clicar. Atualizações OTA verificadas
a partir da versão 1.14.59 enviam também o registro ao mesmo contador.

A tabela de downloads mostra os instaladores públicos disponíveis. Quando
não há binários, o site exibe opções pendentes com o download bloqueado.
Arquivos fonte e somas de verificação NÃO entram em downloads públicos.
O SHA-256 fica apenas no manifesto da API para verificação de integridade.
