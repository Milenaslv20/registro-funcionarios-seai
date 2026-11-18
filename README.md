# Vértix · Registro de Funcionários

Sistema de cadastro de funcionários (React + Node/Express + MySQL) da empresa fictícia **Vértix Soluções Corporativas**.

## Rodando com Docker

Pré-requisito: Docker com Docker Compose.

```bash
docker compose up -d --build
```

| Serviço  | Endereço                 | Descrição                          |
|----------|--------------------------|------------------------------------|
| Frontend | http://localhost:8080    | Aplicação React (nginx)            |
| API      | http://localhost:5000    | Servidor Node/Express              |
| MySQL    | `localhost:3307`         | Banco `vertix_funcionarios`        |

### Acesso de teste

| Usuário | Senha      | Perfil |
|---------|------------|--------|
| `admin` | `admin123` | ADM    |

O perfil ADM também é exigido para confirmar o cadastro de novos usuários em `/cadastroUsuario`.
Outras telas sem link no menu: `/visualizarLogsLogin` e `/visualizarLogsEdicao`.

### Banco de dados

- O schema e os dados de exemplo estão em `database/init.sql`. O MySQL executa esse script **apenas na primeira vez**, quando o volume está vazio.
- Credenciais do banco: usuário `vertix`, senha `vertix123` (root: `root123`).
- Para recriar o banco do zero (apaga todos os dados e uploads):

  ```bash
  docker compose down -v
  docker compose up -d --build
  ```

### Variáveis opcionais

Podem ser definidas num arquivo `.env` na raiz ou no ambiente antes do `docker compose up`:

| Variável           | Padrão                  | Uso                                                       |
|--------------------|-------------------------|-----------------------------------------------------------|
| `DB_USER`          | `vertix`                | Usuário do MySQL                                          |
| `DB_PASSWORD`      | `vertix123`             | Senha do MySQL                                            |
| `DB_ROOT_PASSWORD` | `root123`               | Senha root do MySQL                                       |
| `JWT_SECRET`       | `troque-este-segredo`   | Segredo de assinatura do token                            |
| `API_PUBLIC_URL`   | `http://localhost:5000` | URL da API usada pelo navegador (embutida no build do front) |

## Rodando sem Docker (desenvolvimento)

```bash
# banco: suba só o MySQL do compose
docker compose up -d db

# API (porta 5000)
cd server && npm install && npm start

# Frontend (porta 3000), em outro terminal
npm install && npm start
```

O frontend lê a URL da API de `REACT_APP_API_BASE_URL` no `.env` da raiz.

## Marca

Nome, nome completo e sigla da empresa ficam em `src/config/empresa.js`; o logo em `src/svg/logo.svg`;
as cores em `src/index.css`. O cabeçalho/rodapé dos PDFs é desenhado em `src/utils/pdfMarca.js`.
