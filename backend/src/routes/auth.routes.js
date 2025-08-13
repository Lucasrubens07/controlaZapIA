const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  criarUsuario, 
  buscarUsuarioPorEmail, 
  buscarUsuarioPorId 
} = require('../models/usuarios.model');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário no banco
    const usuario = await buscarUsuarioPorEmail(email);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Conta desativada',
        message: 'Sua conta foi desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(password, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Preparar dados do usuário para resposta
    const user = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      plano: usuario.plano
    };

    // Gerar token JWT
    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'secret_key_temporario',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao processar login'
    });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, telefone } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Criar usuário
    const usuario = await criarUsuario(name, email, password, telefone);

    // Preparar dados do usuário para resposta
    const user = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      plano: usuario.plano
    };

    res.status(201).json({
      success: true,
      data: { user },
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    
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
      message: 'Erro ao processar registro'
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido',
        message: 'Token de autenticação é obrigatório'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporario');
    
    // Buscar usuário real no banco
    const usuario = await buscarUsuarioPorId(decoded.userId);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado',
        message: 'Usuário não existe mais'
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Conta desativada',
        message: 'Sua conta foi desativada'
      });
    }

    const user = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      plano: usuario.plano
    };

    res.json({
      success: true,
      data: { user },
      message: 'Token válido'
    });
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: 'Token expirado ou inválido'
    });
  }
});

module.exports = router;
