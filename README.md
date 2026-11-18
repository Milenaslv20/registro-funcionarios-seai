# Vértix · Registro de Funcionários

Sistema de cadastro de funcionários (React + Node/Express + PostgreSQL) da empresa fictícia **Vértix Soluções Corporativas**, com interface em português e inglês.

- **Front:** React (CRA), em `src/`
- **API:** Express, em `server/` — fotos e PDFs ficam guardados no próprio banco
- **Banco:** PostgreSQL — tabelas criadas automaticamente pela API ao iniciar (`server/db/schema.sql`)

---

## Publicar no Render + Neon (gratuito)

### 1. Banco no Neon
1. Crie uma conta em [neon.tech](https://neon.tech) e um projeto (região mais próxima, ex.: São Paulo).
2. Copie a **connection string** (formato `postgresql://...neon.tech/neondb?sslmode=require`).

Não é preciso rodar SQL: na primeira inicialização a API cria as tabelas, o usuário administrador e os funcionários de exemplo.

### 2. Serviços no Render
1. Envie o código para o GitHub.
2. No Render: **New → Blueprint** → escolha o repositório. O arquivo `render.yaml` cria dois serviços:
   - `vertix-api` (Web Service, Node)
   - `vertix-web` (Static Site, React)
3. Preencha as variáveis pedidas:

   | Serviço | Variável | Valor |
   |---|---|---|
   | vertix-api | `DATABASE_URL` | connection string do Neon |
   | vertix-api | `ADMIN_PASSWORD` | senha do usuário `admin` |
   | vertix-api | `CORS_ORIGIN` | URL do front, ex.: `https://vertix-web.onrender.com` |
   | vertix-web | `REACT_APP_API_BASE_URL` | URL da API, ex.: `https://vertix-api.onrender.com` |

   As URLs seguem o padrão `https://<nome-do-serviço>.onrender.com`. Se o nome já estiver em uso, o Render acrescenta um sufixo: nesse caso, ajuste as duas variáveis de URL depois do primeiro deploy (em **Environment**) e faça **Manual Deploy** dos dois serviços.

4. Acesse a URL do `vertix-web` e entre com `admin` e a senha definida em `ADMIN_PASSWORD`.

### Limitações do plano gratuito
- A API **"dorme" após ~15 min sem acesso**; o primeiro acesso seguinte leva de 30 s a 1 min.
- O Neon gratuito tem cerca de **0,5 GB**; fotos e PDFs ocupam esse espaço (limite de 10 MB por arquivo, ajustável em `MAX_FILE_MB`).

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

## Personalização
- **Marca:** `src/config/empresa.js` (nome/sigla), `src/svg/logo.svg`, cores em `src/index.css`, cabeçalho do PDF em `src/utils/pdfMarca.js`.
- **Idiomas:** `src/i18n/` — o texto em português é a chave; traduções em `en.js`.
