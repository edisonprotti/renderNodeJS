const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false // Exigido pelo Render para conexões seguras externas
    },
    connectionTimeoutMillis: 10000 // Timeout de 10 segundos
});

module.exports = {
    query: async (text, params) => {
        // Força o bloco a capturar o erro exato de conexão se ele acontecer
        try {
            return await pool.query(text, params);
        } catch (error) {
            throw new Error(error.message); 
        }
    }
};
