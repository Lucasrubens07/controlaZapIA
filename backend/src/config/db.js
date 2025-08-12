const { Pool } = require('pg');
require('dotenv').config();

// Validação das variáveis de ambiente
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias não encontradas:', missingVars);
  console.error('Por favor, configure o arquivo .env com as seguintes variáveis:');
  missingVars.forEach(varName => console.error(`  ${varName}=valor`));
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Configurações adicionais para melhor performance
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // tempo limite para conexões ociosas
  connectionTimeoutMillis: 2000, // tempo limite para estabelecer conexão
});

// Teste de conexão
pool.connect()
  .then(() => {
    console.log('📦 Conectado ao PostgreSQL');
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
    console.error('   Verifique se o banco está rodando e as credenciais estão corretas');
    process.exit(1);
  });

// Tratamento de erros do pool
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err);
});

module.exports = pool;
