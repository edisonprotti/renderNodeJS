const { Pool } = require('pg');

const limparObjeto = (texto) => texto ? texto.trim() : '';

const pool = new Pool({
    host: limparObjeto(process.env.DB_HOST),
    user: limparObjeto(process.env.DB_USER),
    password: limparObjeto(process.env.DB_PASSWORD),
    database: limparObjeto(process.env.DB_NAME),
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: true // Ativa o SSL padrão exigido pelo PostgreSQL do Render
});

// Evita que o processo do Node morra se houver uma queda de conexão ociosa
pool.on('error', (err) => {
    console.error('⚠️ Erro no pool do Postgres:', err);
});

module.exports = pool;
