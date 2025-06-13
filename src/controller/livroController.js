const db = require('../models/db');

exports.listarLivros = (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao listar livros' });
    res.json(results);
  });
};

exports.adicionarLivro = (req, res) => {
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
  if (!titulo || !autor || quantidade_disponivel == null) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios faltando' });
  }
  const query = 'INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)';
  db.query(query, [titulo, autor, ano_publicacao, quantidade_disponivel], (err) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao adicionar livro' });
    res.status(201).json({ mensagem: 'Livro adicionado com sucesso' });
  });
};

exports.atualizarLivro = (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;

  const query = 'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ? WHERE id = ?';
  db.query(query, [titulo, autor, ano_publicacao, quantidade_disponivel, id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao atualizar livro' });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Livro não encontrado' });
    res.json({ mensagem: 'Livro atualizado com sucesso' });
  });
};

exports.removerLivro = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao remover livro' });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Livro não encontrado' });
    res.json({ mensagem: 'Livro removido com sucesso' });
  });
};
