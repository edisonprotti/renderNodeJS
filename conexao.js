const { Pool } = require('pg');

// Função auxiliar para garantir que textos não venham com espaços ou quebras de linha
const limparObjeto = (texto) => texto ? texto.trim() : '';

let hostLimpo = limparObjeto(process.env.DB_HOST);

// Se por acaso foi colada a URL inteira contendo postgresql://, limpa para deixar só o Host
if (hostLimpo.includes('://')) {
    const partes = hostLimpo.split('@');
    const urlFinal = partes[partes.length - 1];
    hostLimpo = urlFinal.split('/')[0].split(':')[0];
}

const pool = new Pool({
    host: hostLimpo,
    user: limparObjeto(process.env.DB_USER),
    password: limparObjeto(process.env.DB_PASSWORD),
    database: limparObjeto(process.env.DB_NAME),
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false // Exigido pelo Render
    },
    connectionTimeoutMillis: 5000 // Desiste após 5 segundos em vez de travar o app
});

// Captura erros de conexões ociosas para não derrubar o servidor Node
pool.on('error', (err) => {
    console.error('⚠️ Erro inesperado em cliente ocioso do Postgres:', err.message);
});

module.exports = pool;
