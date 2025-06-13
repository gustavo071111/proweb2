const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensagem: 'Token mal formatado' });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload token:", usuario);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(403).json({ mensagem: 'Token inválido' });
  }
}

function verificarPerfil(perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { autenticar, verificarPerfil };
