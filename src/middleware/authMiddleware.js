const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch {
    res.status(403).json({ mensagem: 'Token inválido' });
  }
}

function verificarPerfil(perfisPermitidos) {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { autenticar, verificarPerfil };