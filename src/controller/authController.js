const db = require('../models/db');  // seu pool MySQL
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length > 0) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, perfil]
    );

    return res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    const usuario = usuarios[0];
    // Comparar senha com hash
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ mensagem: 'Login realizado com sucesso', token, perfil: usuario.perfil });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};