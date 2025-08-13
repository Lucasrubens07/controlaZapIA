const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function criarUsuario(nome, email, senha, telefone = null) {
  try {
    // Validação dos dados
    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    if (senha.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Verificar se email já existe
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir usuário
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, telefone) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone, plano, criado_em',
      [nome, email.toLowerCase(), senhaHash, telefone]
    );

    const usuario = result.rows[0];

    // Criar categorias padrão para o usuário
    await criarCategoriasPadrao(usuario.id);

    // Criar configurações padrão
    await criarConfiguracoesPadrao(usuario.id);

    return usuario;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

async function buscarUsuarioPorEmail(email) {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash, telefone, plano, ativo, criado_em FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    throw error;
  }
}

async function buscarUsuarioPorId(id) {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, plano, ativo, criado_em FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
}

async function atualizarUsuario(id, dados) {
  try {
    const { nome, email, telefone, plano, limite_mensal } = dados;
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (nome) {
      updates.push(`nome = $${paramIndex++}`);
      params.push(nome);
    }

    if (email) {
      updates.push(`email = $${paramIndex++}`);
      params.push(email.toLowerCase());
    }

    if (telefone !== undefined) {
      updates.push(`telefone = $${paramIndex++}`);
      params.push(telefone);
    }

    if (plano) {
      updates.push(`plano = $${paramIndex++}`);
      params.push(plano);
    }

    if (limite_mensal !== undefined) {
      updates.push(`limite_mensal = $${paramIndex++}`);
      params.push(limite_mensal);
    }

    if (updates.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, nome, email, telefone, plano, limite_mensal, criado_em`,
      params
    );

    if (result.rowCount === 0) {
      throw new Error('Usuário não encontrado');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

async function alterarSenha(id, senhaAtual, novaSenha) {
  try {
    // Buscar usuário atual
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Buscar hash da senha atual
    const result = await pool.query(
      'SELECT senha_hash FROM usuarios WHERE id = $1',
      [id]
    );

    const senhaHashAtual = result.rows[0].senha_hash;

    // Verificar senha atual
    const senhaCorreta = await bcrypt.compare(senhaAtual, senhaHashAtual);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await pool.query(
      'UPDATE usuarios SET senha_hash = $1 WHERE id = $2',
      [novaSenhaHash, id]
    );

    return true;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
}

async function criarCategoriasPadrao(usuarioId) {
  const categoriasPadrao = [
    { nome: 'alimentação', cor: '#EF4444', icone: 'utensils' },
    { nome: 'transporte', cor: '#3B82F6', icone: 'car' },
    { nome: 'lazer', cor: '#10B981', icone: 'gamepad-2' },
    { nome: 'compras', cor: '#F59E0B', icone: 'shopping-bag' },
    { nome: 'saúde', cor: '#8B5CF6', icone: 'heart' },
    { nome: 'educação', cor: '#06B6D4', icone: 'book-open' },
    { nome: 'moradia', cor: '#84CC16', icone: 'home' },
    { nome: 'outros', cor: '#6B7280', icone: 'more-horizontal' }
  ];

  for (const categoria of categoriasPadrao) {
    await pool.query(
      'INSERT INTO categorias_usuarios (usuario_id, nome, cor, icone) VALUES ($1, $2, $3, $4) ON CONFLICT (usuario_id, nome) DO NOTHING',
      [usuarioId, categoria.nome, categoria.cor, categoria.icone]
    );
  }
}

async function criarConfiguracoesPadrao(usuarioId) {
  const configuracoesPadrao = [
    { chave: 'tema', valor: 'light' },
    { chave: 'moeda', valor: 'BRL' },
    { chave: 'notificacoes', valor: 'true' },
    { chave: 'limite_mensal_alerta', valor: '1000' }
  ];

  for (const config of configuracoesPadrao) {
    await pool.query(
      'INSERT INTO configuracoes_usuarios (usuario_id, chave, valor) VALUES ($1, $2, $3) ON CONFLICT (usuario_id, chave) DO NOTHING',
      [usuarioId, config.chave, config.valor]
    );
  }
}

async function listarCategoriasUsuario(usuarioId) {
  try {
    const result = await pool.query(
      'SELECT id, nome, cor, icone, ativo FROM categorias_usuarios WHERE usuario_id = $1 ORDER BY nome',
      [usuarioId]
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar categorias do usuário:', error);
    throw error;
  }
}

async function obterConfiguracao(usuarioId, chave) {
  try {
    const result = await pool.query(
      'SELECT valor FROM configuracoes_usuarios WHERE usuario_id = $1 AND chave = $2',
      [usuarioId, chave]
    );
    return result.rows[0]?.valor || null;
  } catch (error) {
    console.error('Erro ao obter configuração:', error);
    throw error;
  }
}

async function definirConfiguracao(usuarioId, chave, valor) {
  try {
    await pool.query(
      'INSERT INTO configuracoes_usuarios (usuario_id, chave, valor) VALUES ($1, $2, $3) ON CONFLICT (usuario_id, chave) DO UPDATE SET valor = EXCLUDED.valor, atualizado_em = CURRENT_TIMESTAMP',
      [usuarioId, chave, valor]
    );
    return true;
  } catch (error) {
    console.error('Erro ao definir configuração:', error);
    throw error;
  }
}

module.exports = {
  criarUsuario,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  atualizarUsuario,
  alterarSenha,
  listarCategoriasUsuario,
  obterConfiguracao,
  definirConfiguracao
};
