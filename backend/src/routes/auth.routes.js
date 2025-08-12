const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

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

    // Buscar usuário no banco (simulado por enquanto)
    // TODO: Implementar tabela de usuários
    if (email === 'admin@controlazap.com' && password === '123456') {
      // Usuário válido (simulado)
      const user = {
        id: 1,
        name: 'Administrador',
        email: email
      };

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
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
    } else {
      res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao processar login'
    });
  }
});

// Registro (simulado)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // TODO: Implementar criação real de usuário
    res.status(501).json({
      success: false,
      error: 'Funcionalidade não implementada',
      message: 'Registro de usuários será implementado em breve'
    });
  } catch (error) {
    console.error('Erro no registro:', error);
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
    
    // TODO: Buscar usuário real no banco
    const user = {
      id: decoded.userId,
      name: 'Administrador',
      email: decoded.email
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
