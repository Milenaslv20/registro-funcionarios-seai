-- =========================================================
-- Vértix · Registro de Funcionários — schema + dados iniciais
-- Executado automaticamente pelo container MySQL na primeira inicialização
-- (somente quando o volume de dados está vazio).
-- =========================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS vertix_funcionarios
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vertix_funcionarios;

-- ---------- Funcionário (tabela principal) ----------
CREATE TABLE funcionario (
  idFuncionario   INT AUTO_INCREMENT PRIMARY KEY,
  nomeFuncionario VARCHAR(120) NOT NULL
);

CREATE TABLE dadospessoais (
  idFuncionario INT PRIMARY KEY,
  sexo          VARCHAR(10),
  dataNasc      DATE,
  estadoAtual   VARCHAR(20),
  nacionalidade VARCHAR(100),
  naturalidade  VARCHAR(100),
  raca          VARCHAR(20),
  telefone      VARCHAR(20),
  email         VARCHAR(100),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosfamiliares (
  idFuncionario INT PRIMARY KEY,
  nomePai       VARCHAR(100),
  cpfPai        VARCHAR(14),
  dataNascPai   DATE,
  nomeMae       VARCHAR(100),
  cpfMae        VARCHAR(14),
  dataNascMae   DATE,
  estadoCivil   VARCHAR(20),
  nomeEsposoA   VARCHAR(100),
  filhos        VARCHAR(20),
  nomeFilhos    VARCHAR(250),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosdocumentos (
  idFuncionario   INT PRIMARY KEY,
  cpf             VARCHAR(14),
  pisPasep        VARCHAR(20),
  cnh             VARCHAR(20),
  rg              VARCHAR(20),
  rgDataExped     DATE,
  rgOrgaoExped    VARCHAR(20),
  rgUf            VARCHAR(5),
  titulo          VARCHAR(20),
  tituloZona      VARCHAR(10),
  tituloSecao     VARCHAR(10),
  tituloUf        VARCHAR(5),
  docMilitar      VARCHAR(20),
  docMilitarSerie VARCHAR(20),
  INDEX idx_cpf (cpf),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosendereco (
  idFuncionario INT PRIMARY KEY,
  bairro        VARCHAR(50),
  numCasa       VARCHAR(10),
  cep           VARCHAR(10),
  rua           VARCHAR(100),
  logadouro     VARCHAR(20),
  estado        VARCHAR(5),
  cidade        VARCHAR(100),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosbancarios (
  idFuncionario INT PRIMARY KEY,
  banco         VARCHAR(80),
  bancoAgencia  VARCHAR(10),
  bancoConta    VARCHAR(20),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosescolaridade (
  idFuncionario INT PRIMARY KEY,
  escolaridade  VARCHAR(30),
  cursos        VARCHAR(20),
  curso1        VARCHAR(100),
  curso2        VARCHAR(100),
  curso3        VARCHAR(100),
  curso4        VARCHAR(100),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

CREATE TABLE dadosvinculo (
  idFuncionario     INT PRIMARY KEY,
  vinculo           VARCHAR(30),
  setorDepartamento VARCHAR(50),
  cargoFuncao       VARCHAR(50),
  cargoEfetivo      VARCHAR(50),
  statusServidor    VARCHAR(20),
  matriculaOrigem   VARCHAR(20),
  orgaoOrigem       VARCHAR(50),
  matriculaEmpresa  VARCHAR(20),
  dataEntregaDocs   DATE,
  anotacoes         TEXT,
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

-- Caminhos da foto e dos PDFs (arrays em JSON)
CREATE TABLE documentos (
  idDocumento       INT AUTO_INCREMENT PRIMARY KEY,
  idFuncionario     INT NOT NULL,
  originalFileNames TEXT,
  filePath          TEXT,
  imagePath         VARCHAR(255),
  FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario) ON DELETE CASCADE
);

-- ---------- Usuários e logs ----------
CREATE TABLE usuarios (
  idUsuario    INT AUTO_INCREMENT PRIMARY KEY,
  nomeUsuario  VARCHAR(25) NOT NULL UNIQUE,
  senhaUsuario VARCHAR(255) NOT NULL,
  tipoAcesso   VARCHAR(20) NOT NULL DEFAULT 'Usuário'
);

CREATE TABLE logslogin (
  idLog       INT AUTO_INCREMENT PRIMARY KEY,
  nomeUsuario VARCHAR(25),
  dataLogin   DATE,
  horaLogin   TIME
);

CREATE TABLE logsedicao (
  idLog           INT AUTO_INCREMENT PRIMARY KEY,
  nomeUsuario     VARCHAR(25),
  registroEditado VARCHAR(120),
  dataEdit        DATE,
  horaEdit        TIME
);

-- =========================================================
-- Dados iniciais
-- =========================================================

-- Usuário de teste (ADM: pode cadastrar outros usuários)
INSERT INTO usuarios (nomeUsuario, senhaUsuario, tipoAcesso) VALUES
  ('admin', 'admin123', 'ADM');

-- Funcionários fictícios de exemplo
INSERT INTO funcionario (idFuncionario, nomeFuncionario) VALUES
  (1, 'Mariana Albuquerque Lima'),
  (2, 'Rafael Nogueira Costa'),
  (3, 'Beatriz Fonseca Carvalho');

INSERT INTO dadospessoais VALUES
  (1, 'F', '1992-04-12', 'AM', 'Brasileira', 'Manaus', 'Pardo', '(92) 99111-2233', 'mariana.lima@vertix.example'),
  (2, 'M', '1988-09-30', 'AM', 'Brasileira', 'Belém', 'Branco', '(92) 99222-3344', 'rafael.costa@vertix.example'),
  (3, 'F', '2001-01-18', 'AM', 'Brasileira', 'Manaus', 'Preto', '(92) 99333-4455', 'beatriz.carvalho@vertix.example');

INSERT INTO dadosfamiliares VALUES
  (1, 'José Lima', '000.000.000-00', '1960-05-02', 'Ana Albuquerque', '000.000.000-00', '1963-07-21', 'Casado', 'Paulo Mendes', '2', 'Lucas, Helena'),
  (2, 'Carlos Costa', '000.000.000-00', '1958-03-11', 'Rita Nogueira', '000.000.000-00', '1961-12-01', 'Solteiro', 'Não Possui', '0', 'Não Possui'),
  (3, 'Marcos Carvalho', '000.000.000-00', '1970-10-10', 'Sônia Fonseca', '000.000.000-00', '1972-02-14', 'Solteiro', 'Não Possui', '0', 'Não Possui');

INSERT INTO dadosdocumentos VALUES
  (1, '111.222.333-44', '120.12345.67-8', 'Não Possui', '1234567', '2010-05-05', 'SSP/AM', 'AM', '012345678901', '001', '0123', 'AM', 'Não Possui', 'Não Possui'),
  (2, '222.333.444-55', '120.23456.78-9', '04512378901', '2345678', '2006-08-20', 'SSP/AM', 'AM', '023456789012', '002', '0456', 'AM', '123456789', 'A'),
  (3, '333.444.555-66', '120.34567.89-0', 'Não Possui', '3456789', '2019-03-15', 'SSP/AM', 'AM', '034567890123', '003', '0789', 'AM', 'Não Possui', 'Não Possui');

INSERT INTO dadosendereco VALUES
  (1, 'Adrianópolis', '120', '69057-000', 'das Palmeiras', 'Rua', 'AM', 'Manaus'),
  (2, 'Centro', '45', '69010-000', 'Sete de Setembro', 'Avenida', 'AM', 'Manaus'),
  (3, 'Ponta Negra', '780', '69037-000', 'do Turismo', 'Avenida', 'AM', 'Manaus');

INSERT INTO dadosbancarios VALUES
  (1, 'Banco Exemplo', '0001', '12345-6'),
  (2, 'Banco Exemplo', '0002', '23456-7'),
  (3, 'Banco Modelo',  '0310', '34567-8');

INSERT INTO dadosescolaridade VALUES
  (1, 'Pós Graduação', '2', 'Gestão de Pessoas', 'Direito Trabalhista', 'Não Possui', 'Não Possui'),
  (2, 'Ensino Superior', '1', 'Contabilidade Avançada', 'Não Possui', 'Não Possui', 'Não Possui'),
  (3, 'Ensino Médio', '0', 'Não Possui', 'Não Possui', 'Não Possui', 'Não Possui');

INSERT INTO dadosvinculo VALUES
  (1, 'Efetivo', 'Recursos Humanos', 'Coordenadora de RH', 'Analista de RH', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0001', '2024-02-05', 'Documentação completa.'),
  (2, 'Temporário', 'Financeiro', 'Analista Financeiro', 'Não Possui', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0002', '2025-06-10', 'Contrato de 12 meses.'),
  (3, 'Estagiário(a)', 'Tecnologia da Informação', 'Estagiária de Suporte', 'Não Possui', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0003', '2026-03-01', 'Não Possui');

INSERT INTO documentos (idFuncionario, originalFileNames, filePath, imagePath) VALUES
  (1, '[]', '[]', NULL),
  (2, '[]', '[]', NULL),
  (3, '[]', '[]', NULL);
