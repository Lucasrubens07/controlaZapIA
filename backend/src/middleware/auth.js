const jwt = require('jsonwebtoken');
const { buscarUsuarioPorId } = require('../models/usuarios.model');

const authMiddleware = async (req, res, next) => {
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
    
    // Buscar usuário no banco
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

    // Adicionar dados do usuário à requisição
    req.user = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      plano: usuario.plano
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: 'Token expirado ou inválido'
    });
  }
};

module.exports = authMiddleware;
