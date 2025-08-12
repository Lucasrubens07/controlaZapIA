const pool = require('../config/db');

async function listarGastos(filtros) {
  try {
    let query = `
      SELECT id, valor, categoria, data, criado_em
      FROM gastos
      WHERE 1=1
    `;
    const params = [];
    let i = 1;

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

async function resumoPorCategoria(filtros) {
  try {
    let query = `
      SELECT categoria, SUM(valor)::numeric(14,2) AS total
      FROM gastos
      WHERE 1=1
    `;
    const params = [];
    let i = 1;

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

async function criarGasto(valor, categoria, data) {
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

    const cat = String(categoria || '').trim().toLowerCase();
    const result = await pool.query(
      'INSERT INTO gastos (valor, categoria, data) VALUES ($1, $2, $3) RETURNING *',
      [valor, cat, data]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    throw error;
  }
}

async function atualizarGasto(id, valor, categoria, data) {
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

    const cat = String(categoria || '').trim().toLowerCase();
    const result = await pool.query(
      'UPDATE gastos SET valor=$1, categoria=$2, data=$3 WHERE id=$4 RETURNING *',
      [valor, cat, data, id]
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

async function deletarGasto(id) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('ID inválido');
    }

    const result = await pool.query('DELETE FROM gastos WHERE id=$1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Gasto não encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar gasto:', error);
    throw error;
  }
}

module.exports = {
  listarGastos,
  resumoPorCategoria,
  criarGasto,
  atualizarGasto,
  deletarGasto,
};
