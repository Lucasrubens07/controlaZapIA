const pool = require('../config/db');

async function listarGastos(filtros, usuarioId) {
  try {
    let query = `
      SELECT id, valor, categoria, data, descricao, tipo, criado_em
      FROM gastos
      WHERE usuario_id = $1
    `;
    const params = [usuarioId];
    let i = 2;

    // categoria: case-insensitive + parcial (ILIKE '%texto%')
    if (filtros.categoria && filtros.categoria.trim()) {
      query += ` AND categoria ILIKE $${i++}`;
      params.push(`%${filtros.categoria.trim()}%`);
    }

    if (filtros.inicio) {
      query += ` AND data >= $${i++}`;
      params.push(filtros.inicio);
    }

    if (filtros.fim) {
      query += ` AND data <= $${i++}`;
      params.push(filtros.fim);
    }

    // Validação e sanitização do sort
    if (filtros.sort) {
      const [campo, ordem] = filtros.sort.split('_');
      const camposPermitidos = ['data', 'valor', 'categoria', 'criado_em'];
      const ordensPermitidas = ['asc', 'desc'];
      
      if (camposPermitidos.includes(campo) && ordensPermitidas.includes(ordem)) {
        query += ` ORDER BY ${campo} ${ordem.toUpperCase()}`;
      } else {
        query += ` ORDER BY data DESC`;
      }
    } else {
      query += ` ORDER BY data DESC`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar gastos:', error);
    throw new Error('Falha ao buscar gastos no banco de dados');
  }
}

async function resumoPorCategoria(filtros, usuarioId) {
  try {
    let query = `
      SELECT categoria, SUM(valor)::numeric(14,2) AS total
      FROM gastos
      WHERE usuario_id = $1
    `;
    const params = [usuarioId];
    let i = 2;

    // permite filtrar por um trecho de categoria também, se quiser
    if (filtros.categoria && filtros.categoria.trim()) {
      query += ` AND categoria ILIKE $${i++}`;
      params.push(`%${filtros.categoria.trim()}%`);
    }

    if (filtros.inicio) {
      query += ` AND data >= $${i++}`;
      params.push(filtros.inicio);
    }

    if (filtros.fim) {
      query += ` AND data <= $${i++}`;
      params.push(filtros.fim);
    }

    query += ` GROUP BY categoria ORDER BY total DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao gerar resumo por categoria:', error);
    throw new Error('Falha ao gerar resumo por categoria');
  }
}

async function criarGasto(valor, categoria, data, usuarioId, descricao = null, tipo = 'despesa') {
  try {
    // Validação dos dados
    if (!valor || isNaN(valor) || valor <= 0) {
      throw new Error('Valor deve ser um número positivo');
    }
    
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length < 2) {
      throw new Error('Categoria deve ter pelo menos 2 caracteres');
    }
    
    if (!data || !Date.parse(data)) {
      throw new Error('Data inválida');
    }

    if (!usuarioId || isNaN(usuarioId) || usuarioId <= 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    const cat = String(categoria || '').trim().toLowerCase();
    const result = await pool.query(
      'INSERT INTO gastos (valor, categoria, data, usuario_id, descricao, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [valor, cat, data, usuarioId, descricao, tipo]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    throw error;
  }
}

async function atualizarGasto(id, valor, categoria, data, usuarioId, descricao = null, tipo = 'despesa') {
  try {
    // Validação dos dados
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('ID inválido');
    }
    
    if (!valor || isNaN(valor) || valor <= 0) {
      throw new Error('Valor deve ser um número positivo');
    }
    
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length < 2) {
      throw new Error('Categoria deve ter pelo menos 2 caracteres');
    }
    
    if (!data || !Date.parse(data)) {
      throw new Error('Data inválida');
    }

    if (!usuarioId || isNaN(usuarioId) || usuarioId <= 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    const cat = String(categoria || '').trim().toLowerCase();
    const result = await pool.query(
      'UPDATE gastos SET valor=$1, categoria=$2, data=$3, descricao=$4, tipo=$5 WHERE id=$6 AND usuario_id=$7 RETURNING *',
      [valor, cat, data, descricao, tipo, id, usuarioId]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Gasto não encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar gasto:', error);
    throw error;
  }
}

async function deletarGasto(id, usuarioId) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('ID inválido');
    }

    if (!usuarioId || isNaN(usuarioId) || usuarioId <= 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    const result = await pool.query('DELETE FROM gastos WHERE id=$1 AND usuario_id=$2 RETURNING *', [id, usuarioId]);
    
    if (result.rowCount === 0) {
      throw new Error('Gasto não encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar gasto:', error);
    throw error;
  }
}
async function listarGastosPaginado({ categoria, inicio, fim, sort, pagina = 1, limite = 20 }, usuarioId) {
  const offset = (pagina - 1) * limite;

  const params = [usuarioId];
  let i = 2;
  let where = 'WHERE usuario_id = $1';

  if (categoria) { where += ` AND categoria ILIKE $${i++}`; params.push(`%${categoria}%`); }
  if (inicio)    { where += ` AND data >= $${i++}`;        params.push(inicio); }
  if (fim)       { where += ` AND data <= $${i++}`;        params.push(fim); }

  const [campo='data', ord='desc'] = (sort || 'data_desc').split('_');
  const okCampo = ['data','valor','categoria','criado_em'].includes(campo);
  const okOrd   = ['asc','desc'].includes(ord);
  const orderBy = `${okCampo ? campo : 'data'} ${okOrd ? ord.toUpperCase() : 'DESC'}`;

  const itensQ = `
    SELECT id, valor, categoria, data, descricao, tipo, criado_em
    FROM gastos
    ${where}
    ORDER BY ${orderBy}
    LIMIT ${limite} OFFSET ${offset}
  `;
  const totalQ = `SELECT COUNT(*)::int AS total FROM gastos ${where}`;

  const [itens, tot] = await Promise.all([
    pool.query(itensQ, params),
    pool.query(totalQ, params),
  ]);

  return { itens: itens.rows, pagina, limite, total: tot.rows[0].total };
}

// totais do período (para cards)
async function estatisticasPeriodo({ inicio, fim, categoria }, usuarioId) {
  const params = [usuarioId];
  let i = 2;
  let where = 'WHERE usuario_id = $1';

  if (categoria) { where += ` AND categoria ILIKE $${i++}`; params.push(`%${categoria}%`); }
  if (inicio)    { where += ` AND data >= $${i++}`;        params.push(inicio); }
  if (fim)       { where += ` AND data <= $${i++}`;        params.push(fim); }

  const q = await pool.query(
    `SELECT COALESCE(SUM(valor),0)::numeric(14,2) AS total_gasto,
            COUNT(*)::int AS total_registros
     FROM gastos
     ${where}`,
    params
  );

  return {
    totalGasto: q.rows[0].total_gasto,
    totalRegistros: q.rows[0].total_registros,
  };
}

module.exports = {
  // já existentes:
  listarGastos,
  resumoPorCategoria,
  criarGasto,
  atualizarGasto,
  deletarGasto,
  // novos:
  listarGastosPaginado,
  estatisticasPeriodo,
};
