# project survey manager API

Backend da aplicação desenvolvido com `NestJS`, `TypeORM`, `PostgreSQL` e `Docker Compose`.

## Documentação de desenvolvimento

As convenções específicas do projeto, padrões de código e observações para contribuidores e agentes estão documentadas em [DEVELOPMENT.md](./DEVELOPMENT.md).

## `.env`

Este projeto depende de um arquivo `.env` local.

Se você ainda não possui esse arquivo, ele deve ser solicitado a outro integrante do projeto antes de rodar a aplicação.

Sem o `.env`, a aplicação pode subir com configurações incorretas ou não conseguir acessar serviços necessários.

## Primeira inicialização

Na primeira vez que a aplicação for executada no ambiente local, utilize:

```bash
docker compose build --no-cache
```

Esse passo garante que as imagens sejam reconstruídas do zero antes da primeira subida do ambiente.

## Subindo a aplicação

Para iniciar a aplicação localmente, utilize o script:

```bash
./up.sh
```

Esse script foi criado para subir primeiro o banco e depois a API, reduzindo problemas de ordem de inicialização entre os containers.

A API roda em modo watch dentro do container usando `nodemon`. Depois que o ambiente estiver de pé, alterações em arquivos `.ts` devem reiniciar automaticamente a aplicação sem precisar executar `docker compose down` ou subir tudo novamente.

Para acompanhar a recompilação e os logs da API:

```bash
docker compose logs -f eyf-api
```

## Swagger

Com a aplicação rodando, a documentação da API pode ser acessada em:

```text
http://localhost:3000/swagger-ui
```

O documento OpenAPI em JSON fica disponível em:

```text
http://localhost:3000/v3/api-docs
```

Para testar endpoints autenticados pela interface do Swagger, faça login pela rota de autenticação, copie o token retornado e use o botão `Authorize` com o token JWT.

## Migrations

### Gerar migration

```bash
docker compose exec eyf-api corepack yarn migration:generate ./src/database/migrations/NameOfMigration
```

### Criar migration vazia

```bash
docker compose exec eyf-api corepack yarn migration:create ./src/database/migrations/NameOfMigration
```

### Executar migrations

```bash
docker compose exec eyf-api corepack yarn migration:run
```

### Reverter última migration

```bash
docker compose exec eyf-api corepack yarn migration:revert
```

## Seeds

Para executar seeds, deve-se utilizar o script:

```bash
./seed.sh
```

As seeds são idempotentes e podem ser executadas mais de uma vez sem duplicar os registros seedados.

## Build

Para validar a aplicação via build:

```bash
corepack yarn build
```

## Observações

- O projeto utiliza `corepack` para execução do `yarn`.
- O banco local roda em `PostgreSQL` via `Docker Compose`.
- A API roda no serviço `eyf-api`.
- O banco roda no serviço `eyf-db`.
- Para comandos que dependem do ambiente Docker, prefira executar dentro do container da API com `docker compose exec eyf-api`.
