# Atualizador do Mesh Analyzer via pt2vhf.com

Endpoint publico: https://www.pt2vhf.com/update.php?product=mesh&platform=windows-x64&kind=installer

O site consulta apenas updates.json na propria hospedagem. Nunca faz proxy
de GitLab/GitHub nem divulga downloads externos. Sua resposta inclui
schema, source, product, status, version, date, notes, page e files.
Cada pacote possui category, platform, kind, name, url, size e sha256.

## Publicacao segura
1. Compilar e testar os instaladores Windows 10/11 no projeto Mesh.
2. Hospedar os arquivos em downloads/mesh-analyzer/ da Hostinger.
3. Calcular o tamanho real e SHA-256, e verificar se o download publico funciona.
4. Publicar version, date, notes e files em updates.json somente depois.
5. Cada arquivo Mesh deve incluir platform: windows-x64 ou windows-arm64
   (ou linux-x64, linux-arm64, macos-x64, macos-arm64).
6. Enquanto nao houver pacote validado, manter version=null e files=[].

A API devolve status=unpublished e version=null quando o arquivo nao esta
disponivel fisicamente, quando o tamanho nao coincide ou quando o arquivo
nao e de um caminho HTTPS permitido do dominio PT2VHF.
O SHA-256 deve ser validado pelo cliente apos o download.

## Integracao obrigatoria no aplicativo
- Substituir TODO acesso a releases do GitLab/GitHub pela API do site.
- Exigir HTTPS, schema=1, product=mesh e source do PT2VHF.
- Verificar versao maior que a instalada, plataforma correta e URL da propria hospedagem.
- Nao aceitar redirecionamentos, downgrade ou falta de SHA-256.
- Baixar em arquivo temporario, conferir bytes e hash antes de iniciar instalacao.
- Atualizar em processo destacado com banco/configuracoes preservados.
- Confirmar versao pelo endpoint local /health apos reinicio.
- Tratar separadamente edicoes instalavel e portatil e oferecer rollback.
- Em falha, manter a instalacao corrente funcional e emitir log de diagnostico.

PENDENCIA: o repositorio do PT2VHF Mesh Analyzer nao esta presente no
grupo PT2VHF do GitLab conectado. A API do site nao altera sozinha o
comportamento dos EXEs ja distribuidos. A integracao e a compilacao
precisam ocorrer quando os fontes estiverem disponiveis.
