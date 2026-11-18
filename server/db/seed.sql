-- Funcionários fictícios de demonstração.
-- A API executa este arquivo só quando a tabela "funcionario" está vazia e SEED_DEMO != 'false'.

INSERT INTO funcionario (id_funcionario, nome_funcionario) VALUES
  (1, 'Mariana Albuquerque Lima'),
  (2, 'Rafael Nogueira Costa'),
  (3, 'Beatriz Fonseca Carvalho');

SELECT setval(pg_get_serial_sequence('funcionario', 'id_funcionario'), (SELECT MAX(id_funcionario) FROM funcionario));

INSERT INTO dados_pessoais VALUES
  (1, 'F', '1992-04-12', 'AM', 'Brasileira', 'Manaus', 'Pardo', '(92) 99111-2233', 'mariana.lima@vertix.example'),
  (2, 'M', '1988-09-30', 'AM', 'Brasileira', 'Belém', 'Branco', '(92) 99222-3344', 'rafael.costa@vertix.example'),
  (3, 'F', '2001-01-18', 'AM', 'Brasileira', 'Manaus', 'Preto', '(92) 99333-4455', 'beatriz.carvalho@vertix.example');

INSERT INTO dados_familiares VALUES
  (1, 'José Lima', '000.000.000-00', '1960-05-02', 'Ana Albuquerque', '000.000.000-00', '1963-07-21', 'Casado', 'Paulo Mendes', '2', 'Lucas, Helena'),
  (2, 'Carlos Costa', '000.000.000-00', '1958-03-11', 'Rita Nogueira', '000.000.000-00', '1961-12-01', 'Solteiro', 'Não Possui', '0', 'Não Possui'),
  (3, 'Marcos Carvalho', '000.000.000-00', '1970-10-10', 'Sônia Fonseca', '000.000.000-00', '1972-02-14', 'Solteiro', 'Não Possui', '0', 'Não Possui');

INSERT INTO dados_documentos VALUES
  (1, '111.222.333-44', '120.12345.67-8', 'Não Possui', '1234567', '2010-05-05', 'SSP/AM', 'AM', '012345678901', '001', '0123', 'AM', 'Não Possui', 'Não Possui'),
  (2, '222.333.444-55', '120.23456.78-9', '04512378901', '2345678', '2006-08-20', 'SSP/AM', 'AM', '023456789012', '002', '0456', 'AM', '123456789', 'A'),
  (3, '333.444.555-66', '120.34567.89-0', 'Não Possui', '3456789', '2019-03-15', 'SSP/AM', 'AM', '034567890123', '003', '0789', 'AM', 'Não Possui', 'Não Possui');

INSERT INTO dados_endereco VALUES
  (1, 'Adrianópolis', '120', '69057-000', 'das Palmeiras', 'Rua', 'AM', 'Manaus'),
  (2, 'Centro', '45', '69010-000', 'Sete de Setembro', 'Avenida', 'AM', 'Manaus'),
  (3, 'Ponta Negra', '780', '69037-000', 'do Turismo', 'Avenida', 'AM', 'Manaus');

INSERT INTO dados_bancarios VALUES
  (1, 'Banco Exemplo', '0001', '12345-6'),
  (2, 'Banco Exemplo', '0002', '23456-7'),
  (3, 'Banco Modelo',  '0310', '34567-8');

INSERT INTO dados_escolaridade VALUES
  (1, 'Pós Graduação', '2', 'Gestão de Pessoas', 'Direito Trabalhista', 'Não Possui', 'Não Possui'),
  (2, 'Ensino Superior', '1', 'Contabilidade Avançada', 'Não Possui', 'Não Possui', 'Não Possui'),
  (3, 'Ensino Médio', '0', 'Não Possui', 'Não Possui', 'Não Possui', 'Não Possui');

INSERT INTO dados_vinculo VALUES
  (1, 'Efetivo', 'Recursos Humanos', 'Coordenadora de RH', 'Analista de RH', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0001', '2024-02-05', 'Documentação completa.'),
  (2, 'Temporário', 'Financeiro', 'Analista Financeiro', 'Não Possui', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0002', '2025-06-10', 'Contrato de 12 meses.'),
  (3, 'Estagiário(a)', 'Tecnologia da Informação', 'Estagiária de Suporte', 'Não Possui', 'Ativo', 'Não Possui', 'Não Possui', 'VTX-0003', '2026-03-01', 'Não Possui');
