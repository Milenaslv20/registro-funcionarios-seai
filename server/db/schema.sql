-- =========================================================
-- Vértix · Registro de Funcionários — schema PostgreSQL
-- Executado pela API a cada inicialização (idempotente: IF NOT EXISTS).
-- Colunas em snake_case; a API devolve os nomes em camelCase via alias.
-- =========================================================

CREATE TABLE IF NOT EXISTS funcionario (
  id_funcionario   SERIAL PRIMARY KEY,
  nome_funcionario TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dados_pessoais (
  id_funcionario INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  sexo           TEXT,
  data_nasc      DATE,
  estado_atual   TEXT,
  nacionalidade  TEXT,
  naturalidade   TEXT,
  raca           TEXT,
  telefone       TEXT,
  email          TEXT
);

CREATE TABLE IF NOT EXISTS dados_familiares (
  id_funcionario INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  nome_pai       TEXT,
  cpf_pai        TEXT,
  data_nasc_pai  DATE,
  nome_mae       TEXT,
  cpf_mae        TEXT,
  data_nasc_mae  DATE,
  estado_civil   TEXT,
  nome_conjuge   TEXT,
  filhos         TEXT,
  nome_filhos    TEXT
);

CREATE TABLE IF NOT EXISTS dados_documentos (
  id_funcionario    INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  cpf               TEXT,
  pis_pasep         TEXT,
  cnh               TEXT,
  rg                TEXT,
  rg_data_exped     DATE,
  rg_orgao_exped    TEXT,
  rg_uf             TEXT,
  titulo            TEXT,
  titulo_zona       TEXT,
  titulo_secao      TEXT,
  titulo_uf         TEXT,
  doc_militar       TEXT,
  doc_militar_serie TEXT
);
CREATE INDEX IF NOT EXISTS idx_dados_documentos_cpf ON dados_documentos (cpf);

CREATE TABLE IF NOT EXISTS dados_endereco (
  id_funcionario INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  bairro         TEXT,
  num_casa       TEXT,
  cep            TEXT,
  rua            TEXT,
  logradouro     TEXT,
  estado         TEXT,
  cidade         TEXT
);

CREATE TABLE IF NOT EXISTS dados_bancarios (
  id_funcionario INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  banco          TEXT,
  banco_agencia  TEXT,
  banco_conta    TEXT
);

CREATE TABLE IF NOT EXISTS dados_escolaridade (
  id_funcionario INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  escolaridade   TEXT,
  cursos         TEXT,
  curso1         TEXT,
  curso2         TEXT,
  curso3         TEXT,
  curso4         TEXT
);

CREATE TABLE IF NOT EXISTS dados_vinculo (
  id_funcionario     INT PRIMARY KEY REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  vinculo            TEXT,
  setor_departamento TEXT,
  cargo_funcao       TEXT,
  cargo_efetivo      TEXT,
  status_servidor    TEXT,
  matricula_origem   TEXT,
  orgao_origem       TEXT,
  matricula_empresa  TEXT,
  data_entrega_docs  DATE,
  anotacoes          TEXT
);

-- Foto e PDFs guardados no próprio banco (o disco do Render gratuito é temporário)
CREATE TABLE IF NOT EXISTS arquivos (
  id_arquivo     SERIAL PRIMARY KEY,
  id_funcionario INT NOT NULL REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
  tipo           TEXT NOT NULL CHECK (tipo IN ('foto', 'pdf')),
  nome_original  TEXT NOT NULL,
  mime           TEXT NOT NULL,
  tamanho        INT  NOT NULL,
  conteudo       BYTEA NOT NULL,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_arquivos_funcionario ON arquivos (id_funcionario, tipo);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario   SERIAL PRIMARY KEY,
  nome_usuario TEXT NOT NULL UNIQUE,
  senha_hash   TEXT NOT NULL,
  tipo_acesso  TEXT NOT NULL DEFAULT 'Usuário'
);

CREATE TABLE IF NOT EXISTS logs_login (
  id_log       SERIAL PRIMARY KEY,
  nome_usuario TEXT,
  data_login   DATE,
  hora_login   TIME
);

CREATE TABLE IF NOT EXISTS logs_edicao (
  id_log           SERIAL PRIMARY KEY,
  nome_usuario     TEXT,
  registro_editado TEXT,
  data_edit        DATE,
  hora_edit        TIME
);
