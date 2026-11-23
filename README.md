# Vértix · Registro de Funcionários

Sistema de cadastro de funcionários (React + Node/Express + PostgreSQL) da empresa fictícia **Vértix Soluções Corporativas**, com interface em português e inglês.

- **Front:** React (CRA), em `src/`
- **API:** Express, em `server/` — fotos e PDFs ficam guardados no próprio banco
- **Banco:** PostgreSQL — tabelas criadas automaticamente pela API ao iniciar (`server/db/schema.sql`)

---

## Acesso web

[ Acessar o sistema ](https://vertix-web.onrender.com)

O sistema se encontra disponível para acesso público via web link Render, onde está hospedado. Há um único link de acesso; o menu muda conforme o perfil do usuário:

| Perfil | Acesso |
|---|---|
| **Usuário** | Registrar funcionário e ver o histórico de funcionários cadastrados |
| **ADM** | Tudo acima + Logs de login, Logs de edição e Cadastro de usuário |

- **User:** adm
- **Password** p@ss3523
---

## Rodar localmente com Docker

```bash
docker compose up -d --build
```

| Serviço  | Endereço                 |
|----------|--------------------------|
| Front    | http://localhost:8080    |
| API      | http://localhost:5000    |
| Postgres | `localhost:5433` (usuário `vertix`, senha `vertix123`, banco `vertix_funcionarios`) |

**Acesso de teste:** usuário `admin`, senha `admin123`.

Recriar o banco do zero (apaga os dados): `docker compose down -v && docker compose up -d --build`

## Rodar sem Docker (desenvolvimento)

```bash
docker compose up -d db                       # só o Postgres
cd server && cp .env.example .env && npm install && npm start   # API na porta 5000
npm install && npm start                      # front na porta 3000 (outro terminal)
```

O front lê a URL da API de `REACT_APP_API_BASE_URL` (arquivo `.env` na raiz).

---

## Variáveis da API

| Variável | Padrão | Uso |
|---|---|---|
| `DATABASE_URL` | Postgres local | Conexão com o banco (Neon: com `?sslmode=require`) |
| `JWT_SECRET` | `troque-este-segredo` | Assinatura do token de login (**defina em produção**) |
| `JWT_EXPIRES_IN` | `8h` | Duração da sessão |
| `CORS_ORIGIN` | (libera tudo) | URL(s) do front autorizadas, separadas por vírgula |
| `ADMIN_USER` / `ADMIN_PASSWORD` | `admin` / `admin123` | Administrador criado quando não há usuários |
| `SEED_DEMO` | `true` | Cria funcionários de exemplo se a tabela estiver vazia |
| `MAX_FILE_MB` | `10` | Tamanho máximo de cada foto/PDF |
| `APP_TIMEZONE` | `America/Manaus` | Fuso usado nos logs |

## Segurança
- Todas as rotas da API (exceto `/login` e `/health`) exigem o token JWT obtido no login.
- Senhas guardadas com hash **bcrypt**.
- O autor dos logs de edição vem do token, não do navegador.
- Logs e cadastro de usuário são restritos a `ADM` também na API (resposta 403 para os demais).

## Personalização
- **Marca:** `src/config/empresa.js` (nome/sigla), `src/svg/logo.svg`, cores em `src/index.css`, cabeçalho do PDF em `src/utils/pdfMarca.js`.
- **Idiomas:** `src/i18n/` — o texto em português é a chave; traduções em `en.js`.
