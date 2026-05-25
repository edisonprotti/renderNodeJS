const { Pool } = require('pg');

// Configuração do pool de conexões utilizando variáveis de ambiente
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false // Obrigatório para conexões seguras na nuvem (SSL)
    }
});

module.exports = pool;
