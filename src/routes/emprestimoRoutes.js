const express = require("express");
const router = express.Router();

const emprestimoController = require("../controller/emprestimoController");
const { autenticar, verificarPerfil } = require("../middleware/authMiddleware");

// Apenas bibliotecário pode ver todos os empréstimos
router.get("/", autenticar, verificarPerfil(["bibliotecario"]), emprestimoController.listarEmprestimos);

// Leitor vê apenas seus próprios empréstimos
router.get("/meus", autenticar, verificarPerfil(["leitor"]), emprestimoController.meusEmprestimos);

// Leitor pode criar empréstimos
router.post("/", autenticar, verificarPerfil(["leitor"]), emprestimoController.criarEmprestimo);

// Bibliotecário marca devolução
router.put("/:id/devolver", autenticar, verificarPerfil(["bibliotecario"]), emprestimoController.marcarDevolucao);

module.exports = router;