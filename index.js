const http = require('http');
const db = require('./conexao'); // Este é o nosso pool do pg

const PORT = process.env.PORT || 3000;

async function prepararBanco() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(50) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tabela 'usuarios' verificada via Node.js.");
    } catch (error) {
        console.error("⚠️ Erro no boot do banco:", error.message);
    }
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Aceita a raiz '/' ou '/usuarios'
    if (req.url === '/' || req.url === '/usuarios') {
        try {
            const resultado = await db.query('SELECT id, usuario, criado_em FROM usuarios');
            
            res.statusCode = 200;
            res.end(JSON.stringify({
                sucesso: true,
                linguagem: "Node.js",
                mensagem: "Lendo o mesmo banco de dados PostgreSQL que o PHP!",
                dados: resultado.rows
            }, null, 2));

        } catch (erro) {
            res.statusCode = 500;
            res.end(JSON.stringify({
                sucesso: false,
                erro: "Erro ao consultar tabela integrada.",
                detalhe: erro.message || erro.code || "Erro de conexão bruto ou credenciais inválidas"
            }, null, 2));
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ erro: "Rota não encontrada" }));
    }
});

prepararBanco().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Servidor ativo na porta ${PORT}`);
    });
});
