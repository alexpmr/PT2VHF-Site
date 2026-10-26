# Publicação APRS 1.14.59 usando a integração existente GitLab → Hostinger

A Hostinger está documentada como sincronizada à branch main do repositório
privado `pt2vhf-group/pt2vhf-site`. Portanto, a publicação dos instaladores
segue o **mesmo procedimento das páginas HTML**: colocar os binários no
repositório e fazer push da branch main. Não é obrigatório criar SFTP.

O pacote já foi criado pelo job GitLab APRS:
https://gitlab.com/pt2vhf-group/pt2vhf-aprs-client/-/jobs/17470937896

## Importar os cinco instaladores

1. No job acima, clique em **Download artifacts**. O GitLab baixará um ZIP
   externo que contém `out/PT2VHF-APRS-1.14.59-Hostinger.zip`.
2. Extraia desse ZIP externo o arquivo ZIP interno, que contém cinco
   instaladores verdadeiros e `updates.json`.
3. Faça clone ou atualize o repositório do **site**:

   ```bash
   git clone https://gitlab.com/pt2vhf-group/pt2vhf-site.git
   cd pt2vhf-site
   python scripts/import_aprs_bundle.py CAMINHO/PT2VHF-APRS-1.14.59-Hostinger.zip
   git add updates.json downloads/aprs-client
   git commit -m "release(aprs): publicar instaladores v1.14.59"
   git push origin main
   ```

O script verifica os cinco arquivos, os nomes, as URLs, as assinaturas,
o tamanho e SHA-256 antes de ativar o manifesto. Conserva versões e downloads
dos demais programas. Não publica código-fonte nem arquivo separado de checksum.

## Confirmar a publicação real

Acompanhe no hPanel o deploy Git configurado para `main` em
`public_html`. Confirme por HTTPS que os cinco arquivos foram entregues
integralmente e que:

- `https://www.pt2vhf.com/aprs` mostra os cinco downloads;
- `https://www.pt2vhf.com/update.php?product=aprs` retorna versão
  `1.14.59`, status `available` e os cinco arquivos;
- contadores são acumulados por arquitetura/tipo e não zeram em atualizações;
- OTA dentro de 1.14.59 consulta exclusivamente o site.

A instalação da 1.14.59 em sistemas executando 1.14.58 pode ser manual uma
única vez, pois a versão anterior consultava o GitHub suspenso.

**Importante:** o pipeline GitLab Pages de `pt2vhf-site` bem-sucedido
não comprova por si só o deploy na Hostinger. A confirmação é o teste HTTP
no próprio domínio oficial.


## Publicação contínua pelo GitLab

O projeto APRS agora dispõe de um pipeline que compila Windows e Linux e envia os binários para a branch main deste repositório. A sincronização Git já configurada na Hostinger deve distribuir os mesmos arquivos das páginas.

Para habilitar a publicação automática entre projetos privados uma única vez, abra Configurações > CI/CD > Permissões do token de job neste repositório. Adicione o projeto pt2vhf-group/pt2vhf-aprs-client à lista de permissões, autorize envio ao repositório e envio entre projetos autorizados. Depois de ativar, a publicação de versões futuras dispensa transferência manual.

Status dos binários e deploy deve ser conferido no pipeline do APRS e em https://www.pt2vhf.com/aprs. A versão só está publicamente disponível depois que os cinco arquivos existirem no domínio oficial.
