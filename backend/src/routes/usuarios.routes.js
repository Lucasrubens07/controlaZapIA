const express = require('express');
const router = express.Router();
const { 
  buscarUsuarioPorId, 
  atualizarUsuario, 
  alterarSenha,
  listarCategoriasUsuario,
  obterConfiguracao,
  definirConfiguracao
} = require('../models/usuarios.model');
const authMiddleware = require('../middleware/auth');

// Rotas que precisam de autenticação
router.use(authMiddleware);

// Obter perfil do usuário
router.get('/perfil', async (req, res) => {
  try {
    const usuario = await buscarUsuarioPorId(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        message: 'Usuário não existe mais'
      });
    }

    res.json({
      success: true,
      data: {
        id: usuario.id,
        name: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        plano: usuario.plano,
        limite_mensal: usuario.limite_mensal,
        criado_em: usuario.criado_em
      },
      message: 'Perfil carregado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao carregar perfil'
    });
  }
});

// Atualizar perfil
router.put('/perfil', async (req, res) => {
  try {
    const { name, email, telefone } = req.body;
    
    const dados = {};
    if (name) dados.nome = name;
    if (email) dados.email = email;
    if (telefone !== undefined) dados.telefone = telefone;

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: 'Nenhum campo para atualizar'
      });
    }

    const usuario = await atualizarUsuario(req.user.id, dados);
    
    res.json({
      success: true,
      data: {
        id: usuario.id,
        name: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        plano: usuario.plano,
        limite_mensal: usuario.limite_mensal
      },
      message: 'Perfil atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    if (error.message.includes('Email já cadastrado')) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado',
        message: 'Este email já está sendo usado por outro usuário'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao atualizar perfil'
    });
  }
});

// Alterar senha
router.put('/senha', async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios',
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Senha inválida',
        message: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    await alterarSenha(req.user.id, senhaAtual, novaSenha);
    
    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    
    if (error.message.includes('Senha atual incorreta')) {
      return res.status(400).json({
        success: false,
        error: 'Senha incorreta',
        message: 'Senha atual está incorreta'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao alterar senha'
    });
  }
});

// Listar categorias do usuário
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await listarCategoriasUsuario(req.user.id);
    
    res.json({
      success: true,
      data: categorias,
      message: 'Categorias carregadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao carregar categorias'
    });
  }
});

// Obter configuração
router.get('/configuracao/:chave', async (req, res) => {
  try {
    const { chave } = req.params;
    const valor = await obterConfiguracao(req.user.id, chave);
    
    res.json({
      success: true,
      data: { chave, valor },
      message: 'Configuração carregada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao obter configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao carregar configuração'
    });
  }
});

// Definir configuração
router.put('/configuracao/:chave', async (req, res) => {
  try {
    const { chave } = req.params;
    const { valor } = req.body;
    
    if (valor === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Valor obrigatório',
        message: 'Valor da configuração é obrigatório'
      });
    }

    await definirConfiguracao(req.user.id, chave, valor);
    
    res.json({
      success: true,
      message: 'Configuração salva com sucesso'
    });
  } catch (error) {
    console.error('Erro ao definir configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao salvar configuração'
    });
  }
});

module.exports = router;
