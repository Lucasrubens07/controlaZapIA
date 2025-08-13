const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastos.controller');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas de gastos
router.get('/', gastosController.getGastos);
router.get('/paginado', gastosController.getGastosPaginado);
router.get('/categorias/resumo', gastosController.getResumo);
router.get('/estatisticas', gastosController.getEstatisticas);
router.get('/categoria/:categoria', gastosController.getGastosDeUmaCategoria);

// CRUD de gastos
router.post('/', gastosController.postGasto);
router.put('/:id', gastosController.putGasto);
router.delete('/:id', gastosController.deleteGasto);

module.exports = router;