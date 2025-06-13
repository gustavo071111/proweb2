const db = require('../models/db');

exports.listarLivros = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const [rows] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ mensagem: 'Livro não encontrado' });
      }
      return res.status(200).json(rows[0]);
    } else {
      const [rows] = await db.query('SELECT * FROM livros');
      return res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar livros' });
  }
};

exports.adicionarLivro = async (req, res) => {
  try {
    const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
    if (!titulo || !autor || quantidade_disponivel == null) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios faltando' });
    }
    const query = 'INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)';
    await db.query(query, [titulo, autor, ano_publicacao, quantidade_disponivel]);
    res.status(201).json({ mensagem: 'Livro adicionado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao adicionar livro' });
  }
};

exports.atualizarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
    const query = 'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ? WHERE id = ?';

    const [result] = await db.query(query, [titulo, autor, ano_publicacao, quantidade_disponivel, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
    res.json({ mensagem: 'Livro atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao atualizar livro' });
  }
};

exports.removerLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM livros WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
    res.json({ mensagem: 'Livro removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao remover livro' });
  }
};
