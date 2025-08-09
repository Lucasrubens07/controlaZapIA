const Gasto = require('../models/gastos.model');

async function getGastos(req, res) {
  try {
    const filtros = {
      categoria: req.query.categoria, // texto parcial, case-insensitive
      inicio: req.query.inicio,
      fim: req.query.fim,
      sort: req.query.sort,           // ex: data_desc, valor_asc
    };
    const dados = await Gasto.listarGastos(filtros);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar gastos' });
  }
}

async function getResumo(req, res) {
  try {
    const filtros = {
      categoria: req.query.categoria, // opcional (match parcial)
      inicio: req.query.inicio,
      fim: req.query.fim,
    };
    const dados = await Gasto.resumoPorCategoria(filtros);
    res.json(dados);
  } catch {
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
}

async function getGastosDeUmaCategoria(req, res) {
  try {
    const filtros = {
      categoria: req.params.categoria, 
      inicio: req.query.inicio,
      fim: req.query.fim,
      sort: req.query.sort,
    };
    const dados = await Gasto.listarGastos(filtros);
    res.json(dados);
  } catch {
    res.status(500).json({ error: 'Erro ao listar gastos da categoria' });
  }
}

async function postGasto(req, res) {
  try {
    const { valor, categoria, data } = req.body;
    if (valor == null || !categoria || !data) {
      return res.status(400).json({ error: 'valor, categoria e data são obrigatórios' });
    }
    const novo = await Gasto.criarGasto(valor, categoria, data);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar gasto' });
  }
}

async function putGasto(req, res) {
  try {
    const { id } = req.params;
    const { valor, categoria, data } = req.body;
    const up = await Gasto.atualizarGasto(id, valor, categoria, data);
    if (!up) return res.status(404).json({ error: 'Gasto não encontrado' });
    res.json(up);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar gasto' });
  }
}

async function deleteGasto(req, res) {
  try {
    const { id } = req.params;
    const del = await Gasto.deletarGasto(id);
    if (!del) return res.status(404).json({ error: 'Gasto não encontrado' });
    res.json({ message: 'Gasto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar gasto' });
  }
}

module.exports = {
  getGastos,
  getResumo,
  postGasto,
  putGasto,
  deleteGasto,
  getGastosDeUmaCategoria, 
};