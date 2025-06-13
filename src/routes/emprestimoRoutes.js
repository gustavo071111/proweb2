const express = require('express');
const router = express.Router();
const emprestimoController = require('../controller/emprestimoController');
const { autenticar, verificarPerfil } = require('../middleware/authMiddleware');

router.post('/', autenticar, verificarPerfil(['leitor']), emprestimoController.criarEmprestimo);
router.get('/', autenticar, verificarPerfil(['bibliotecario']), emprestimoController.listarEmprestimos);
router.get('/meus', autenticar, verificarPerfil(['leitor']), emprestimoController.meusEmprestimos);
router.put('/:id', autenticar, verificarPerfil(['bibliotecario']), emprestimoController.marcarDevolucao);

module.exports = router;
