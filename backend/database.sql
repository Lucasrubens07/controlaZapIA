-- Script para criar as tabelas do sistema de controle financeiro
-- Execute este script no seu banco PostgreSQL

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    plano VARCHAR(20) DEFAULT 'free',
    limite_mensal DECIMAL(10,2) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de gastos (atualizada para multiusuário)
CREATE TABLE IF NOT EXISTS gastos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
    categoria VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) DEFAULT 'despesa' CHECK (tipo IN ('receita', 'despesa')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias personalizadas por usuário
CREATE TABLE IF NOT EXISTS categorias_usuarios (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, nome)
);

-- Tabela de configurações por usuário
CREATE TABLE IF NOT EXISTS configuracoes_usuarios (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    chave VARCHAR(100) NOT NULL,
    valor TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, chave)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_gastos_usuario_id ON gastos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_tipo ON gastos(tipo);
CREATE INDEX IF NOT EXISTS idx_gastos_criado_em ON gastos(criado_em);
CREATE INDEX IF NOT EXISTS idx_categorias_usuarios_usuario_id ON categorias_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_configuracoes_usuarios_usuario_id ON configuracoes_usuarios(usuario_id);

-- Comentários para documentação
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE gastos IS 'Tabela para armazenar gastos/despesas por usuário';
COMMENT ON TABLE categorias_usuarios IS 'Categorias personalizadas por usuário';
COMMENT ON TABLE configuracoes_usuarios IS 'Configurações personalizadas por usuário';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_usuarios_updated_at BEFORE UPDATE ON configuracoes_usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrador padrão
INSERT INTO usuarios (nome, email, senha_hash, plano) VALUES
    ('Administrador', 'admin@controlazap.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir categorias padrão para o admin
INSERT INTO categorias_usuarios (usuario_id, nome, cor, icone) VALUES
    (1, 'alimentação', '#EF4444', 'utensils'),
    (1, 'transporte', '#3B82F6', 'car'),
    (1, 'lazer', '#10B981', 'gamepad-2'),
    (1, 'compras', '#F59E0B', 'shopping-bag'),
    (1, 'saúde', '#8B5CF6', 'heart'),
    (1, 'educação', '#06B6D4', 'book-open'),
    (1, 'moradia', '#84CC16', 'home'),
    (1, 'outros', '#6B7280', 'more-horizontal')
ON CONFLICT (usuario_id, nome) DO NOTHING;

-- Configurações padrão para o admin
INSERT INTO configuracoes_usuarios (usuario_id, chave, valor) VALUES
    (1, 'tema', 'light'),
    (1, 'moeda', 'BRL'),
    (1, 'notificacoes', 'true'),
    (1, 'limite_mensal_alerta', '1000')
ON CONFLICT (usuario_id, chave) DO NOTHING;
