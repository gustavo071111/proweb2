const db = require('../models/db');

exports.meusEmprestimos = (req, res) => {
  const leitor_id = req.usuario?.id;
  if (!leitor_id) return res.status(401).json({ mensagem: 'Usuário não autenticado' });

  console.log("Leitor ID (do token):", leitor_id);

  const query = `
    SELECT e.id, l.titulo, e.data_emprestimo, e.data_devolucao_prevista, 
           e.data_devolucao_real, e.status
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

            res.json({ mensagem: 'Devolução registrada e status atualizado para finalizado com sucesso' });
          }
        );
      }
    );
  });
};
