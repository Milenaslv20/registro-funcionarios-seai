require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { query, withTransaction, inicializarBanco } = require("./db");

// ===================== Configuração =====================
const PORT = Number(process.env.PORT || 5000);
const TIMEZONE = process.env.APP_TIMEZONE || "America/Manaus";
const JWT_SECRET = process.env.JWT_SECRET || "troque-este-segredo";
const JWT_EXPIRA = process.env.JWT_EXPIRES_IN || "8h";
const MAX_ARQUIVO_MB = Number(process.env.MAX_FILE_MB || 10);

if (!process.env.JWT_SECRET) {
    console.warn("⚠️  JWT_SECRET não definido: usando um segredo padrão (defina-o em produção).");
}

const app = express();

// CORS_ORIGIN="https://meu-front.onrender.com" (vários separados por vírgula). Sem valor: libera tudo (dev).
const origens = (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: origens.length ? origens : "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Arquivos ficam em memória e são gravados no banco
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_ARQUIVO_MB * 1024 * 1024, files: 51 },
});

// Envolve rotas async: qualquer erro vira resposta 500 em vez de derrubar o processo
const rota = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Data (YYYY-MM-DD) e hora (HH:MM:SS) no fuso da aplicação, independente do locale do servidor
function agora() {
    const d = new Date();
    return {
        data: d.toLocaleDateString("sv-SE", { timeZone: TIMEZONE }),
        hora: d.toLocaleTimeString("pt-BR", { timeZone: TIMEZONE, hour12: false }),
    };
}

// ===================== Mapeamento dos campos =====================
// [coluna no banco, nome do campo na API, tipo]. O nome da API é o mesmo que o front envia e recebe.
const CAMPOS = {
    dados_pessoais: [
        ["sexo", "sexo"], ["data_nasc", "dataNasc", "date"], ["estado_atual", "estadoAtual"],
        ["nacionalidade", "nacionalidade"], ["naturalidade", "naturalidade"], ["raca", "raca"],
        ["telefone", "telefone"], ["email", "email"],
    ],
    dados_familiares: [
        ["nome_pai", "nomePai"], ["cpf_pai", "cpfPai"], ["data_nasc_pai", "dataNascPai", "date"],
        ["nome_mae", "nomeMae"], ["cpf_mae", "cpfMae"], ["data_nasc_mae", "dataNascMae", "date"],
        ["estado_civil", "estadoCivil"], ["nome_conjuge", "nomeEsposoa"], ["filhos", "filhos"],
        ["nome_filhos", "nomeFilhos"],
    ],
    dados_documentos: [
        ["cpf", "cpf"], ["pis_pasep", "pisPasep"], ["cnh", "cnh"], ["rg", "rg"],
        ["rg_data_exped", "rgDataExped", "date"], ["rg_orgao_exped", "rgOrgaoExped"], ["rg_uf", "rgUf"],
        ["titulo", "titulo"], ["titulo_zona", "tituloZona"], ["titulo_secao", "tituloSecao"],
        ["titulo_uf", "tituloUf"], ["doc_militar", "docMilitar"], ["doc_militar_serie", "docMilitarSerie"],
    ],
    dados_endereco: [
        ["bairro", "bairro"], ["num_casa", "numCasa"], ["cep", "cep"], ["rua", "rua"],
        ["logradouro", "logadouro"], ["estado", "estado"], ["cidade", "cidade"],
    ],
    dados_bancarios: [
        ["banco", "banco"], ["banco_agencia", "bancoAgencia"], ["banco_conta", "bancoConta"],
    ],
    dados_escolaridade: [
        ["escolaridade", "escolaridade"], ["cursos", "cursos"], ["curso1", "curso1"],
        ["curso2", "curso2"], ["curso3", "curso3"], ["curso4", "curso4"],
    ],
    dados_vinculo: [
        ["vinculo", "vinculo"], ["setor_departamento", "setorDepartamento"], ["cargo_funcao", "cargoFuncao"],
        ["cargo_efetivo", "cargoEfetivo"], ["status_servidor", "statusServidor"],
        ["matricula_origem", "matriculaOrigem"], ["orgao_origem", "orgaoOrigem"],
        ["matricula_empresa", "matriculaEmpresa"], ["data_entrega_docs", "dataEntregaDocs", "date"],
        ["anotacoes", "anotacoes"],
    ],
};
const ALIAS_TABELA = {
    dados_pessoais: "dp", dados_familiares: "dfam", dados_documentos: "dd", dados_endereco: "de",
    dados_bancarios: "dbc", dados_escolaridade: "dfe", dados_vinculo: "dv",
};

// O cadastro e a edição mandam alguns campos com nomes diferentes; aqui eles são unificados
function normalizarCorpo(body) {
    return {
        ...body,
        nomeFuncionario: body.nomeFuncionario ?? body.nome,
        dataNasc: body.dataNasc ?? body.data_nasc,
        estado: body.estadoSelecionado ?? body.estado,
        cidade: body.cidadeSelecionada ?? body.cidade,
    };
}

function valorCampo(valor, tipo) {
    if (valor === undefined || valor === null) return null;
    if (tipo === "date" && (valor === "" || valor === "null" || valor === "undefined")) return null;
    return valor;
}

// Grava (insere ou atualiza) os dados de todas as tabelas do funcionário
async function salvarDadosFuncionario(client, idFuncionario, dados) {
    for (const [tabela, campos] of Object.entries(CAMPOS)) {
        const colunas = campos.map(([coluna]) => coluna);
        const valores = campos.map(([, chave, tipo]) => valorCampo(dados[chave], tipo));
        const marcadores = valores.map((_, i) => `$${i + 2}`).join(", ");
        const atualizacao = colunas.map((c) => `${c} = EXCLUDED.${c}`).join(", ");
        await client.query(
            `INSERT INTO ${tabela} (id_funcionario, ${colunas.join(", ")}) VALUES ($1, ${marcadores})
             ON CONFLICT (id_funcionario) DO UPDATE SET ${atualizacao}`,
            [idFuncionario, ...valores]
        );
    }
}

const SELECT_FUNCIONARIOS = `
    SELECT f.id_funcionario AS "idFuncionario", f.nome_funcionario AS "nomeFuncionario",
    ${Object.entries(CAMPOS)
        .flatMap(([tabela, campos]) => campos.map(([coluna, chave]) => `${ALIAS_TABELA[tabela]}.${coluna} AS "${chave}"`))
        .join(",\n    ")}
    FROM funcionario f
    ${Object.entries(ALIAS_TABELA)
        .map(([tabela, alias]) => `LEFT JOIN ${tabela} ${alias} ON ${alias}.id_funcionario = f.id_funcionario`)
        .join("\n    ")}
    ORDER BY f.id_funcionario`;

// ===================== Arquivos (foto e PDFs no banco) =====================
async function salvarFoto(client, idFuncionario, arquivo) {
    await client.query("DELETE FROM arquivos WHERE id_funcionario = $1 AND tipo = 'foto'", [idFuncionario]);
    await client.query(
        `INSERT INTO arquivos (id_funcionario, tipo, nome_original, mime, tamanho, conteudo)
         VALUES ($1, 'foto', $2, $3, $4, $5)`,
        [idFuncionario, arquivo.originalname, arquivo.mimetype, arquivo.size, arquivo.buffer]
    );
}

async function salvarPdfs(client, idFuncionario, arquivos, substituir) {
    if (substituir) {
        await client.query("DELETE FROM arquivos WHERE id_funcionario = $1 AND tipo = 'pdf'", [idFuncionario]);
    }
    for (const arquivo of arquivos) {
        await client.query(
            `INSERT INTO arquivos (id_funcionario, tipo, nome_original, mime, tamanho, conteudo)
             VALUES ($1, 'pdf', $2, $3, $4, $5)`,
            [idFuncionario, arquivo.originalname, arquivo.mimetype || "application/pdf", arquivo.size, arquivo.buffer]
        );
    }
}

const camposUpload = upload.fields([{ name: "imagem", maxCount: 1 }, { name: "pdfs", maxCount: 50 }]);

async function processarUpload(req, substituirPdfs) {
    const idFuncionario = Number(req.body.idFuncionario);
    if (!idFuncionario) {
        const erro = new Error("ID do funcionário obrigatório");
        erro.status = 400;
        throw erro;
    }
    const imagem = req.files?.imagem?.[0];
    const pdfs = (req.files?.pdfs || []).filter((f) => f.mimetype === "application/pdf");

    await withTransaction(async (client) => {
        if (imagem) await salvarFoto(client, idFuncionario, imagem);
        if (pdfs.length) await salvarPdfs(client, idFuncionario, pdfs, substituirPdfs);
    });
    return { imagem: !!imagem, pdfs: pdfs.length };
}

function enviarArquivo(res, arquivo) {
    res.set({
        "Content-Type": arquivo.mime,
        "Content-Length": arquivo.tamanho,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(arquivo.nome_original)}`,
        "Cache-Control": "private, no-cache",
    });
    res.send(arquivo.conteudo);
}

// ===================== Autenticação =====================
// Token no cabeçalho "Authorization: Bearer ..." ou em ?token= (usado por <img> e links de PDF)
function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization || "";
    const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : req.query.token;
    if (!token) return res.status(401).json({ message: "Não autenticado" });
    try {
        req.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Sessão expirada ou inválida" });
    }
}

// ===================== Rotas públicas =====================
app.get("/health", rota(async (req, res) => {
    await query("SELECT 1");
    res.json({ status: "ok" });
}));

app.post("/login", rota(async (req, res) => {
    const { nomeUsuario, senhaUsuario } = req.body;
    const { rows } = await query(
        "SELECT id_usuario, nome_usuario, senha_hash, tipo_acesso FROM usuarios WHERE nome_usuario = $1",
        [nomeUsuario]
    );
    const usuario = rows[0];
    const valido = usuario && senhaUsuario && (await bcrypt.compare(String(senhaUsuario), usuario.senha_hash));

    if (!valido) {
        console.log(`☒ Erro de login em usuário: ${nomeUsuario}`);
        return res.json({ sucess: false });
    }

    const token = jwt.sign(
        { id: usuario.id_usuario, nomeUsuario: usuario.nome_usuario, tipoAcesso: usuario.tipo_acesso },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRA }
    );
    const { data, hora } = agora();
    await query("INSERT INTO logs_login (nome_usuario, data_login, hora_login) VALUES ($1, $2, $3)", [usuario.nome_usuario, data, hora]);
    console.log(`☑ Usuário ${usuario.nome_usuario} logado em ${data} ${hora}`);
    res.json({ sucess: true, token });
}));

// Daqui para baixo, todas as rotas exigem login
app.use(autenticar);

// ===================== Funcionários =====================
app.post("/cadastrar", rota(async (req, res) => {
    const dados = normalizarCorpo(req.body);
    if (!dados.nomeFuncionario) return res.status(400).json({ message: "Nome do funcionário obrigatório" });

    const idFuncionario = await withTransaction(async (client) => {
        const { rows } = await client.query(
            "INSERT INTO funcionario (nome_funcionario) VALUES ($1) RETURNING id_funcionario",
            [dados.nomeFuncionario]
        );
        const id = rows[0].id_funcionario;
        await salvarDadosFuncionario(client, id, dados);
        return id;
    });

    console.log(`✔ Funcionário ${idFuncionario} cadastrado`);
    res.status(200).json({ idFuncionario });
}));

app.post("/editRegister", upload.none(), rota(async (req, res) => {
    const dados = normalizarCorpo(req.body);
    const idFuncionario = Number(dados.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ message: "ID do funcionário obrigatório" });

    const encontrado = await withTransaction(async (client) => {
        const { rowCount } = await client.query(
            "UPDATE funcionario SET nome_funcionario = $1 WHERE id_funcionario = $2",
            [dados.nomeFuncionario, idFuncionario]
        );
        if (rowCount === 0) return false;
        await salvarDadosFuncionario(client, idFuncionario, dados);
        return true;
    });

    if (!encontrado) return res.status(404).json({ message: "Funcionário não encontrado" });
    console.log(`✔ Funcionário ${idFuncionario} editado`);
    res.status(200).json({ idFuncionario });
}));

app.get("/getRegisters", rota(async (req, res) => {
    const { rows } = await query(SELECT_FUNCIONARIOS);
    res.json(rows);
}));

app.get("/getRegisterstot", rota(async (req, res) => {
    const { rows } = await query("SELECT COUNT(*)::int AS \"totalFunc\" FROM funcionario");
    res.json({ totalFunc: rows[0].totalFunc });
}));

app.post("/existenciaUsuario", rota(async (req, res) => {
    const { rowCount } = await query("SELECT 1 FROM dados_documentos WHERE cpf = $1 LIMIT 1", [req.body.cpf]);
    res.json({ success: rowCount > 0, message: rowCount > 0 ? "Usuário Existe" : "Usuário não encontrado" });
}));

app.delete("/deleteRegister/:id", rota(async (req, res) => {
    const id = Number(req.params.id);
    // As tabelas de dados e os arquivos são apagados em cascata
    const { rowCount } = await query("DELETE FROM funcionario WHERE id_funcionario = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ message: "Funcionário não encontrado" });

    const { rows } = await query("SELECT COUNT(*)::int AS total FROM funcionario");
    res.status(200).json({ message: "Funcionário excluido com sucesso", affectedRows: rowCount, totalFunc: rows[0].total });
}));

// ===================== Arquivos =====================
app.post("/uploads", camposUpload, rota(async (req, res) => {
    const resultado = await processarUpload(req, false);
    res.status(200).json({ message: "Arquivos enviados e salvos no banco de dados", ...resultado });
}));

// Na edição, PDFs novos substituem os anteriores (mesmo comportamento da versão com disco)
app.post("/uploadsEdit", camposUpload, rota(async (req, res) => {
    const resultado = await processarUpload(req, true);
    res.status(200).json({ message: "Arquivos atualizados com sucesso", ...resultado });
}));

// Mantém o formato antigo: filePath e originalFileNames são arrays em JSON
app.get("/getFiles/:idFuncionario", rota(async (req, res) => {
    const { rows } = await query(
        "SELECT id_arquivo, nome_original FROM arquivos WHERE id_funcionario = $1 AND tipo = 'pdf' ORDER BY id_arquivo",
        [req.params.idFuncionario]
    );
    res.json([{
        filePath: JSON.stringify(rows.map((r) => `arquivo/${r.id_arquivo}`)),
        originalFileNames: JSON.stringify(rows.map((r) => r.nome_original)),
    }]);
}));

app.get("/foto/:idFuncionario", rota(async (req, res) => {
    const { rows } = await query(
        "SELECT nome_original, mime, tamanho, conteudo FROM arquivos WHERE id_funcionario = $1 AND tipo = 'foto' ORDER BY id_arquivo DESC LIMIT 1",
        [req.params.idFuncionario]
    );
    if (!rows.length) return res.status(404).json({ message: "Sem foto" });
    enviarArquivo(res, rows[0]);
}));

app.get("/arquivo/:id", rota(async (req, res) => {
    const { rows } = await query(
        "SELECT nome_original, mime, tamanho, conteudo FROM arquivos WHERE id_arquivo = $1",
        [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Arquivo não encontrado" });
    enviarArquivo(res, rows[0]);
}));

// ===================== Usuários =====================
app.post("/validateUser", rota(async (req, res) => {
    const { usuario, senha } = req.body;
    const { rows } = await query(
        "SELECT senha_hash FROM usuarios WHERE nome_usuario = $1 AND tipo_acesso = 'ADM'",
        [usuario]
    );
    const valido = rows[0] && senha && (await bcrypt.compare(String(senha), rows[0].senha_hash));
    if (valido) return res.status(200).json({ success: true, message: "Usuário ADM validado" });
    res.status(401).json({ success: false, message: "Usuário não autorizado" });
}));

app.post("/cadastrarUsuario", rota(async (req, res) => {
    const { nomeUsuario, senhaUsuario, tipoAcesso } = req.body;
    if (!nomeUsuario || !senhaUsuario) return res.status(400).json({ message: "Usuário e senha obrigatórios" });

    try {
        await query(
            "INSERT INTO usuarios (nome_usuario, senha_hash, tipo_acesso) VALUES ($1, $2, $3)",
            [nomeUsuario, await bcrypt.hash(String(senhaUsuario), 10), tipoAcesso || "Usuário"]
        );
    } catch (err) {
        if (err.code === "23505") return res.status(409).json({ message: "Usuário já existe" });
        throw err;
    }
    console.log(`✔ Usuário ${nomeUsuario} cadastrado`);
    res.status(200).json({ message: "Usuário cadastrado com sucesso" });
}));

// ===================== Logs =====================
app.get("/getLogsLogin", rota(async (req, res) => {
    const { rows } = await query(`
        SELECT nome_usuario AS "nomeUsuario",
               to_char(data_login, 'FMDD/MM/YY') AS "dataLogin",
               to_char(hora_login, 'HH24:MI:SS') AS "horaLogin"
        FROM logs_login ORDER BY id_log DESC`);
    res.json(rows);
}));

app.get("/getLogsEdit", rota(async (req, res) => {
    const { rows } = await query(`
        SELECT nome_usuario AS "nomeUsuario",
               to_char(data_edit, 'FMDD/MM/YY') AS "dataEdit",
               registro_editado AS "registroEditado",
               to_char(hora_edit, 'HH24:MI:SS') AS "horaEdit"
        FROM logs_edicao ORDER BY id_log DESC`);
    res.json(rows);
}));

// O autor do log vem do token (não do que o navegador envia)
app.post("/logEdicao", rota(async (req, res) => {
    const { data, hora } = agora();
    await query(
        "INSERT INTO logs_edicao (nome_usuario, registro_editado, data_edit, hora_edit) VALUES ($1, $2, $3, $4)",
        [req.usuario.nomeUsuario, req.body.nomeFuncionario, data, hora]
    );
    res.status(200).json({ message: "Log edição cadastrado com sucesso" });
}));

// ===================== Erros =====================
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({ message: `Erro no upload: ${err.message} (máx. ${MAX_ARQUIVO_MB} MB por arquivo)` });
    }
    console.error("Erro na requisição:", req.method, req.path, err);
    res.status(err.status || 500).json({ message: err.status ? err.message : "Erro interno do servidor" });
});

// ===================== Inicialização =====================
inicializarBanco()
    .then(() => {
        console.log("⚯  Banco de dados pronto ⚯");
        app.listen(PORT, "0.0.0.0", () => console.log(`↺ Serv rodando, porta ${PORT} ↺`));
    })
    .catch((err) => {
        console.error("Falha ao inicializar o banco de dados:", err);
        process.exit(1);
    });
