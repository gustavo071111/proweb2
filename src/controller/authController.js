const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registrarUsuario = (req, res) => {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  if (!['bibliotecario', 'leitor'].includes(perfil)) {
    return res.status(400).json({ mensagem: 'Perfil inválido' });
  }

  // Verificar se email já existe
  const queryCheck = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(queryCheck, [email], (err, results) => {
    if (err) return res.status(500).json({ mensagem: 'Erro no banco de dados' });
    if (results.length > 0) return res.status(409).json({ mensagem: 'Email já cadastrado' });

    // Criptografar senha
    const senhaHash = bcrypt.hashSync(senha, 10);

    const queryInsert = 'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)';
    db.query(queryInsert, [nome, email, senhaHash, perfil], (err2) => {
      if (err2) return res.status(500).json({ mensagem: 'Erro ao registrar usuário' });
      res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
    });
  });
};

exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ mensagem: 'Erro no banco de dados' });
    if (results.length === 0) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const usuario = results[0];
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, perfil: usuario.perfil, nome: usuario.nome });
  });
};
