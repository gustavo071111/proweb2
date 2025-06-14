const db = require('../models/db');

exports.criarEmprestimo = async (req, res) => {
  const usuario = req.usuario; // do token JWT
  const { livro_id, data_devolucao_prevista } = req.body;

  if (!livro_id || !data_devolucao_prevista) {
    return res.status(400).json({ mensagem: 'Campos livro_id e data_devolucao_prevista são obrigatórios.' });
  }

  try {
    // Verifica se o livro existe e tem quantidade disponível
    const [livros] = await db.query('SELECT * FROM livros WHERE id = ?', [livro_id]);
    if (livros.length === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    const livro = livros[0];
    if (livro.quantidade_disponivel < 1) {
      return res.status(400).json({ mensagem: 'Livro indisponível para empréstimo.' });
    }

    // Criar empréstimo com status 'ativo'
    const dataHoje = new Date().toISOString().split('T')[0];
    await db.query(
      `INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status)
       VALUES (?, ?, ?, ?, 'ativo')`,
      [livro_id, usuario.id, dataHoje, data_devolucao_prevista]
    );

    // Diminuir quantidade disponível do livro
    await db.query(
      `UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?`,
      [livro_id]
    );

    res.status(201).json({ mensagem: 'Empréstimo realizado com sucesso.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao realizar empréstimo.' });
  }
};


exports.listarEmprestimos = async (req, res) => {
  try {
    // Busca todos os empréstimos juntando dados do livro e do leitor
    const [emprestimos] = await db.query(`
      SELECT e.id, e.livro_id, e.leitor_id, e.data_emprestimo, e.data_devolucao_prevista, e.data_devolucao_real, e.status,
             l.titulo, u.nome AS nome_leitor
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN usuarios u ON e.leitor_id = u.id
      ORDER BY e.data_emprestimo DESC
    `);

    res.json(emprestimos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar empréstimos.' });
  }
};

exports.meusEmprestimos = (req, res) => {
  const leitor_id = req.usuario.id;

  const query = `
    SELECT e.id, l.titulo, e.data_emprestimo, e.data_devolucao_prevista, e.data_devolucao_real, e.status
    FROM emprestimos e
    JOIN livros l ON e.livro_id = l.id
    WHERE e.leitor_id = ?
    ORDER BY e.data_emprestimo DESC
  `;

  db.query(query, [leitor_id], (err, results) => {
    if (err) {
      console.error("Erro ao listar empréstimos do leitor:", err);
      return res.status(500).json({ mensagem: 'Erro ao listar seus empréstimos' });
    }

    const emprestimos = results.map(emp => {
      if (
        emp.status === 'ativo' &&
        new Date(emp.data_devolucao_prevista) < new Date() &&
        !emp.data_devolucao_real
      ) {
        emp.status = 'atrasado';
      }
      return emp;
    });

    res.json(emprestimos);
  });
};


exports.marcarDevolucao = (req, res) => {
  const { id } = req.params;
  const data_devolucao_real = new Date().toISOString().slice(0, 10);

  db.query('SELECT livro_id, status FROM emprestimos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar empréstimo:", err);
      return res.status(500).json({ mensagem: 'Erro no banco' });
    }
    if (results.length === 0) return res.status(404).json({ mensagem: 'Empréstimo não encontrado' });
    if (results[0].status !== 'ativo') return res.status(400).json({ mensagem: 'Empréstimo já finalizado' });

    const livro_id = results[0].livro_id;

    db.query(
      'UPDATE emprestimos SET status = ?, data_devolucao_real = ? WHERE id = ?',
      ['finalizado', data_devolucao_real, id],
      (err2) => {
        if (err2) {
          console.error("Erro ao atualizar empréstimo:", err2);
          return res.status(500).json({ mensagem: 'Erro ao atualizar empréstimo' });
        }

        db.query(
          'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?',
          [livro_id],
          (err3) => {
            if (err3) {
              console.error("Erro ao atualizar estoque:", err3);
              return res.status(500).json({ mensagem: 'Erro ao atualizar estoque' });
            }
            res.json({ mensagem: 'Devolução registrada com sucesso' });
          }
        );
      }
    );
  });
};
