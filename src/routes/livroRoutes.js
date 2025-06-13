const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const { autenticar, verificarPerfil } = require('../middleware/authMiddleware');

router.get('/', livroController.listarLivros);
router.post('/', autenticar, verificarPerfil(['bibliotecario']), livroController.adicionarLivro);
router.put('/:id', autenticar, verificarPerfil(['bibliotecario']), livroController.atualizarLivro);
router.delete('/:id', autenticar, verificarPerfil(['bibliotecario']), livroController.removerLivro);

module.exports = router;
