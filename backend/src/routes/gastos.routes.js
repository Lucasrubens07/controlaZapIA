const express = require('express');
const router = express.Router();
const {
  getGastos,
  getResumo,
  postGasto,
  putGasto,
  deleteGasto,
  getGastosDeUmaCategoria,
} = require('../controllers/gastos.controller');

router.get('/', getGastos);

// ✅ mantém o resumo no caminho que você queria
router.get('/categorias/resumo', getResumo);

// ✅ listagem individual por categoria (case-insensitive + parcial via model)
router.get('/categorias/:categoria', getGastosDeUmaCategoria);

router.post('/', postGasto);
router.put('/:id', putGasto);
router.delete('/:id', deleteGasto);

module.exports = router;
