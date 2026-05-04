# Brev.ly

Brev.ly é uma aplicação FullStack para encurtamento de URLs. O projeto permite cadastrar, listar, remover e acessar links encurtados, além de contabilizar acessos e exportar um relatório CSV dos links criados.

O repositório está dividido em dois projetos:

- `server/`: API HTTP com Fastify, TypeScript, Drizzle ORM e Postgres.
- `web/`: aplicação React SPA com Vite, TypeScript e Tailwind CSS.

## Layout

O layout base do desafio está disponível no Figma:

- [Brev.ly no Figma](https://www.figma.com/community/file/1477335071553579816)

## Funcionalidades

### Back-end

- Criação de links com URL original e URL encurtada.
- Validação do formato da URL encurtada.
- Bloqueio de URLs encurtadas duplicadas.
- Listagem de links cadastrados.
- Busca da URL original por meio do encurtamento.
- Remoção de links por `id`.
- Incremento da contagem de acessos por `id`.
- Exportação dos links em CSV.
- Upload do CSV para storage compatível com S3, como Cloudflare R2.
- Documentação da API com Swagger em `/docs`.

### Front-end

- Página inicial (`/`) com formulário de cadastro e lista de links.
- Página de redirecionamento (`/:shortUrl`) que busca o link, incrementa os acessos e redireciona para a URL original.
- Página de link não encontrado para URLs inválidas, inexistentes ou removidas.
- Download do relatório CSV.
- Estados de carregamento, empty state, mensagens de erro e bloqueio de ações durante operações assíncronas.
- Layout responsivo para desktop e mobile.

## Tecnologias

### Server

- TypeScript
- Fastify
- Drizzle ORM
- Postgres
- Zod
- Swagger
- AWS SDK S3 compatible client
- Docker

### Web

- TypeScript
- React
- Vite
- Tailwind CSS
- Phosphor Icons

## Como executar

Os projetos possuem dependências e scripts próprios. Execute os comandos dentro da pasta correspondente.

### Pré-requisitos

- Node.js
- pnpm
- Docker e Docker Compose
- Uma conta/bucket Cloudflare R2 ou outro storage compatível com S3 para exportar CSV

### Back-end

Entre na pasta do servidor:

```bash
cd server
```

Instale as dependências:

```bash
pnpm install
```

Suba o banco Postgres:

```bash
docker compose up -d
```

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Exemplo de configuração local:

```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://docker:docker@localhost:5432/brevly

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

Execute as migrations:

```bash
pnpm db:migrate
```

Inicie a API:

```bash
pnpm dev
```

A API ficará disponível em:

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs`

### Front-end

Em outro terminal, entre na pasta da aplicação web:

```bash
cd web
```

Instale as dependências:

```bash
pnpm install
```

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Exemplo de configuração local:

```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

Inicie a aplicação:

```bash
pnpm dev
```

O front-end ficará disponível em `http://localhost:5173`.

## Endpoints principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/links` | Cria um link encurtado |
| `GET` | `/links` | Lista os links cadastrados |
| `GET` | `/links/:shortUrl` | Busca um link pela URL encurtada |
| `DELETE` | `/links/:id` | Remove um link pelo `id` |
| `PATCH` | `/links/:id/accesses` | Incrementa a contagem de acessos |
| `POST` | `/links/exports` | Gera e retorna a URL do relatório CSV |

## Scripts úteis

### Server

```bash
pnpm dev
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

### Web

```bash
pnpm dev
pnpm build
pnpm preview
```

## Build e produção

Para gerar o build do servidor:

```bash
cd server
pnpm build
```

O servidor também possui um `Dockerfile` multi-stage para gerar a imagem da aplicação.

Para gerar o build do front-end:

```bash
cd web
pnpm build
```

Para servir o build localmente:

```bash
pnpm preview
```

## Estrutura do projeto

```text
.
├── server
│   ├── src
│   │   ├── app
│   │   ├── infra
│   │   └── shared
│   ├── Dockerfile
│   └── docker-compose.yaml
└── web
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── types
    │   └── utils
    └── index.html
```

## Regras do desafio atendidas

- Aplicação FullStack com `web/` e `server/`.
- Back-end em TypeScript, Fastify, Drizzle e Postgres.
- Front-end em TypeScript, React e Vite sem framework.
- Arquivos `.env.example` nos dois projetos.
- Script `db:migrate` no back-end.
- Dockerfile para a aplicação server.
- CORS habilitado na API.
- Exportação de CSV com URL pública via CDN/storage.
