const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); // Faz a API entender JSON
app.use(cors()); // Permite o acesso do Front-end

app.use(express.static(path.join(__dirname, '../frontend')));

const SEGREDO = 'minha_chave_secreta_17'; 

// "Banco de dados"
const usuarioCadastrado = {
    id: 1,
    username: 'Beatriz',
    password: '30062008'
};
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 1. Verifica se o usuário e senha estão corretos
    if (username === usuarioCadastrado.username && password === usuarioCadastrado.password) {
        
        // 2. Cria o payload (dados dentro do token)
        const payload = { userId: usuarioCadastrado.id };

        // 3. Gera o Token (Assina o token com o SEGREDO e define validade de 1 hora)
        const token = jwt.sign(payload, SEGREDO, { expiresIn: '1h' });

        // 4. Devolve o token para o front-end
        return res.json({ auth: true, token: token });
    }

    // Senha incorreta
    return res.status(401).json({ auth: false, message: 'Login inválido!' });
});
function verificarToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // 3. Verifica se o token é válido e foi assinado pelo nosso SEGREDO
    jwt.verify(token, SEGREDO, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }
        
        // Se deu tudo certo, salva o ID do usuário na requisição e deixa passar (next)
        req.userId = decoded.userId;
        next(); 
    });
}
app.get('/grupo', verificarToken, (req, res) => {
    res.json({ 
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000 🚀');
});
