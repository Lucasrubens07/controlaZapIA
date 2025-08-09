const pool = require('../config/db');

async function listarGastos(filtros) {
  let query = `
    SELECT id, valor, categoria, data, criado_em
    FROM gastos
    WHERE 1=1
  `;
  const params = [];
  let i = 1;

  // categoria: case-insensitive + parcial (ILIKE '%texto%')
  if (filtros.categoria) {
    query += ` AND categoria ILIKE $${i++}`;
    params.push(`%${filtros.categoria}%`);
  }

  if (filtros.inicio) {
    query += ` AND data >= $${i++}`;
    params.push(filtros.inicio);
  }

  if (filtros.fim) {
    query += ` AND data <= $${i++}`;
    params.push(filtros.fim);
  }

  if (filtros.sort) {
    const [campo, ordem] = filtros.sort.split('_');
    const okCampo = ['data','valor','categoria','criado_em'].includes(campo);
    const okOrdem = ['asc','desc'].includes(ordem);
    query += ` ORDER BY ${okCampo ? campo : 'data'} ${(okOrdem ? ordem : 'desc').toUpperCase()}`;
  } else {
    query += ` ORDER BY data DESC`;
  }

  const result = await pool.query(query, params);
  return result.rows;
}

async function resumoPorCategoria(filtros) {
  let query = `
    SELECT categoria, SUM(valor)::numeric(14,2) AS total
    FROM gastos
    WHERE 1=1
  `;
  const params = [];
  let i = 1;

  // permite filtrar por um trecho de categoria também, se quiser
  if (filtros.categoria) {
    query += ` AND categoria ILIKE $${i++}`;
    params.push(`%${filtros.categoria}%`);
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
}

async function criarGasto(valor, categoria, data) {
  const cat = String(categoria || '').trim().toLowerCase();
  const result = await pool.query(
    'INSERT INTO gastos (valor, categoria, data) VALUES ($1, $2, $3) RETURNING *',
    [valor, cat, data]
  );
  return result.rows[0];
}

async function atualizarGasto(id, valor, categoria, data) {
  const cat = String(categoria || '').trim().toLowerCase();
  const result = await pool.query(
    'UPDATE gastos SET valor=$1, categoria=$2, data=$3 WHERE id=$4 RETURNING *',
    [valor, cat, data, id]
  );
  return result.rows[0];
}

async function deletarGasto(id) {
  const result = await pool.query('DELETE FROM gastos WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  listarGastos,
  resumoPorCategoria,
  criarGasto,
  atualizarGasto,
  deletarGasto,
};
