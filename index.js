const http = require('http');
const db = require('./conexao');

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

    // Remove espaços, barras duplicadas e normaliza a rota visitada
    const urlLimpa = req.url.split('?')[0].replace(/\/$/, "");

    // Se a rota for vazia "", "/" ou "/usuarios", ele processa a busca
    if (urlLimpa === "" || urlLimpa === "/usuarios" || req.url === "/") {
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
                detalhe: erro.message
            }, null, 2));
        }
    } else {
        // Se cair aqui, mostra a rota que o Render tentou acessar para diagnóstico
        res.statusCode = 404;
        res.end(JSON.stringify({ 
            erro: "Rota não encontrada", 
            url_recebida: req.url,
            url_processada: urlLimpa
        }, null, 2));
    }
});

prepararBanco().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Servidor ativo na porta ${PORT}`);
    });
});
