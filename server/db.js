const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { Pool, types } = require("pg");

// DATE volta como 'YYYY-MM-DD' (sem virar Date/UTC, o que deslocaria o dia no fuso do Brasil)
types.setTypeParser(1082, (valor) => valor);

// Neon: use a connection string com "?sslmode=require" (o pg ativa o SSL a partir dela)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://vertix:vertix123@localhost:5432/vertix_funcionarios",
    max: Number(process.env.DB_POOL_MAX || 5),
    idleTimeoutMillis: 30000,
});

// O Neon encerra conexões ociosas; sem este handler o processo cairia
pool.on("error", (err) => console.error("Conexão ociosa do banco encerrada:", err.message));

const query = (texto, params) => pool.query(texto, params);

async function withTransaction(fn) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const resultado = await fn(client);
        await client.query("COMMIT");
        return resultado;
    } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

const lerSql = (arquivo) => fs.readFileSync(path.join(__dirname, "db", arquivo), "utf8");

// Cria as tabelas (se não existirem), o usuário administrador e os dados de demonstração
async function inicializarBanco() {
    await query(lerSql("schema.sql"));

    // Administrador: com ADMIN_PASSWORD definido, a senha é sincronizada a cada inicialização
    // (trocar a variável no painel do Render e reiniciar já atualiza a senha).
    // Sem a variável, cria "admin/admin123" apenas se ainda não houver nenhum usuário (uso local).
    const nome = (process.env.ADMIN_USER || "admin").trim();
    const senhaEnv = (process.env.ADMIN_PASSWORD || "").trim(); // remove espaço/quebra de linha acidental
    if (senhaEnv) {
        const { rows } = await query(
            `INSERT INTO usuarios (nome_usuario, senha_hash, tipo_acesso) VALUES ($1, $2, 'ADM')
             ON CONFLICT (nome_usuario) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, tipo_acesso = 'ADM'
             RETURNING (xmax = 0) AS criado`,
            [nome, await bcrypt.hash(senhaEnv, 10)]
        );
        console.log(`👤 Administrador "${nome}" ${rows[0].criado ? "criado" : "com senha sincronizada (ADMIN_PASSWORD)"}`);
    } else {
        const { rows: [{ total }] } = await query("SELECT COUNT(*)::int AS total FROM usuarios");
        if (total === 0) {
            await query(
                "INSERT INTO usuarios (nome_usuario, senha_hash, tipo_acesso) VALUES ($1, $2, 'ADM')",
                [nome, await bcrypt.hash("admin123", 10)]
            );
            console.log(`👤 Administrador "${nome}" criado com a senha padrão (defina ADMIN_PASSWORD em produção)`);
        }
    }

    if (process.env.SEED_DEMO !== "false") {
        const { rows: [{ total: funcionarios }] } = await query("SELECT COUNT(*)::int AS total FROM funcionario");
        if (funcionarios === 0) {
            await withTransaction((client) => client.query(lerSql("seed.sql")));
            console.log("🌱 Funcionários de demonstração criados");
        }
    }
}

module.exports = { pool, query, withTransaction, inicializarBanco };
