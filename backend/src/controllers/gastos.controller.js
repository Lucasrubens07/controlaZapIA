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
    res.json({
      success: true,
      data: dados,
      total: dados.length,
      message: 'Gastos listados com sucesso'
    });
  } catch (err) {
    console.error('Erro no controller getGastos:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar gastos',
      message: err.message || 'Erro interno do servidor'
    });
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
    res.json({
      success: true,
      data: dados,
      message: 'Resumo gerado com sucesso'
    });
  } catch (err) {
    console.error('Erro no controller getResumo:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao gerar resumo',
      message: err.message || 'Erro interno do servidor'
    });
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
    res.json({
      success: true,
      data: dados,
      total: dados.length,
      message: `Gastos da categoria '${req.params.categoria}' listados com sucesso`
    });
  } catch (err) {
    console.error('Erro no controller getGastosDeUmaCategoria:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar gastos da categoria',
      message: err.message || 'Erro interno do servidor'
    });
  }
}

async function postGasto(req, res) {
  try {
    const { valor, categoria, data } = req.body;
    
    // Validação dos campos obrigatórios
    if (valor == null || valor === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'Campo obrigatório ausente',
        message: 'Valor é obrigatório'
      });
    }
    
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Campo obrigatório inválido',
        message: 'Categoria deve ter pelo menos 2 caracteres'
      });
    }
    
    if (!data) {
      return res.status(400).json({ 
        success: false,
        error: 'Campo obrigatório ausente',
        message: 'Data é obrigatória'
      });
    }

    const novo = await Gasto.criarGasto(valor, categoria, data);
    res.status(201).json({
      success: true,
      data: novo,
      message: 'Gasto criado com sucesso'
    });
  } catch (err) {
    console.error('Erro no controller postGasto:', err);
    
    if (err.message.includes('Valor deve ser') || 
        err.message.includes('Categoria deve ter') || 
        err.message.includes('Data inválida')) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Erro ao criar gasto',
      message: err.message || 'Erro interno do servidor'
    });
  }
}

async function putGasto(req, res) {
  try {
    const { id } = req.params;
    const { valor, categoria, data } = req.body;
    
    // Validação do ID
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido',
        message: 'ID deve ser um número positivo'
      });
    }
    
    const up = await Gasto.atualizarGasto(id, valor, categoria, data);
    res.json({
      success: true,
      data: up,
      message: 'Gasto atualizado com sucesso'
    });
  } catch (err) {
    console.error('Erro no controller putGasto:', err);
    
    if (err.message === 'Gasto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Gasto não encontrado',
        message: 'Não foi possível encontrar o gasto especificado'
      });
    }
    
    if (err.message.includes('Valor deve ser') || 
        err.message.includes('Categoria deve ter') || 
        err.message.includes('Data inválida')) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Erro ao atualizar gasto',
      message: err.message || 'Erro interno do servidor'
    });
  }
}

async function deleteGasto(req, res) {
  try {
    const { id } = req.params;
    
    // Validação do ID
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido',
        message: 'ID deve ser um número positivo'
      });
    }
    
    const del = await Gasto.deletarGasto(id);
    res.json({ 
      success: true,
      data: del,
      message: 'Gasto removido com sucesso' 
    });
  } catch (err) {
    console.error('Erro no controller deleteGasto:', err);
    
    if (err.message === 'Gasto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Gasto não encontrado',
        message: 'Não foi possível encontrar o gasto especificado'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Erro ao deletar gasto',
      message: err.message || 'Erro interno do servidor'
    });
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