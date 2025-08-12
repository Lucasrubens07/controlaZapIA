-- Script para criar a tabela de gastos
-- Execute este script no seu banco PostgreSQL

CREATE TABLE IF NOT EXISTS gastos (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
    categoria VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_criado_em ON gastos(criado_em);

-- Comentários para documentação
COMMENT ON TABLE gastos IS 'Tabela para armazenar gastos/despesas';
COMMENT ON COLUMN gastos.id IS 'Identificador único do gasto';
COMMENT ON COLUMN gastos.valor IS 'Valor do gasto (deve ser positivo)';
COMMENT ON COLUMN gastos.categoria IS 'Categoria do gasto (ex: alimentação, transporte)';
COMMENT ON COLUMN gastos.data IS 'Data do gasto';
COMMENT ON COLUMN gastos.criado_em IS 'Data e hora de criação do registro';

-- Dados de exemplo (opcional)
INSERT INTO gastos (valor, categoria, data) VALUES
    (25.50, 'alimentação', '2024-01-15'),
    (45.00, 'transporte', '2024-01-16'),
    (120.00, 'lazer', '2024-01-17'),
    (89.90, 'compras', '2024-01-18'),
    (15.00, 'alimentação', '2024-01-19')
ON CONFLICT DO NOTHING;
