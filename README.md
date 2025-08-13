# ControlaZap - Sistema de Controle Financeiro

Uma plataforma completa de controle financeiro com integração WhatsApp via n8n, desenvolvida para ser comercializada como SaaS multiusuário.

## 🚀 Funcionalidades

### Core Features
- **Controle de Gastos**: Registro e categorização de despesas
- **Dashboard Interativo**: Visualização de dados com gráficos e estatísticas
- **Sistema Multiusuário**: Cada usuário tem seus próprios dados isolados
- **Integração WhatsApp**: Recebimento de gastos via mensagens do WhatsApp
- **Categorização Inteligente**: Categorias personalizáveis por usuário
- **Relatórios**: Análises detalhadas de gastos por período

### Sistema de Usuários
- **Registro e Login**: Sistema completo de autenticação
- **Perfis Personalizáveis**: Dados pessoais e configurações
- **Planos de Assinatura**: Sistema preparado para diferentes planos
- **Configurações**: Tema, moeda, notificações e alertas

### Integração WhatsApp
- **Recebimento Automático**: Gastos enviados via WhatsApp são registrados automaticamente
- **Resposta Inteligente**: Confirmação automática com categoria detectada
- **Processamento via n8n**: Workflow automatizado para processamento de mensagens

## 🛠️ Tecnologias

### Backend
- **Node.js** com Express
- **PostgreSQL** para banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **CORS** configurado

### Frontend
- **React** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router** para navegação
- **Zustand** para gerenciamento de estado
- **React Hook Form** com Zod para validação

### Integração
- **n8n** para automação do WhatsApp
- **API REST** para comunicação

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn
- n8n (para integração WhatsApp)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd controlaZapIa
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlazap
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Banco de Dados

Execute o script SQL para criar as tabelas:
```bash
psql -U seu_usuario -d controlazap -f database.sql
```

### 4. Configurar Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 5. Executar o Projeto

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 📱 Uso

### 1. Primeiro Acesso
- Acesse `http://localhost:5173`
- Clique em "Criar conta" para registrar um novo usuário
- Faça login com suas credenciais

### 2. Dashboard
- Visualize seus gastos em tempo real
- Use os filtros para analisar períodos específicos
- Veja gráficos de distribuição por categoria

### 3. Configurações
- Acesse "Configurações" no menu lateral
- Personalize seu perfil
- Configure preferências do sistema
- Altere sua senha

### 4. Integração WhatsApp
- Configure o n8n para receber mensagens do WhatsApp
- Envie gastos no formato: "50 mercado" ou "R$ 50 mercado"
- O sistema processará automaticamente e responderá com confirmação

## 🔧 Configuração n8n

### Workflow WhatsApp
1. Configure um webhook no n8n
2. Conecte com a API do WhatsApp Business
3. Processe as mensagens recebidas
4. Envie para a API do ControlaZap
5. Retorne a confirmação para o usuário

### Exemplo de Payload
```json
{
  "valor": 50.00,
  "categoria": "mercado",
  "data": "2024-01-15",
  "usuario_id": 1
}
```

## 🏗️ Estrutura do Projeto

```
controlaZapIa/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── gastos.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── gastos.model.js
│   │   │   └── usuarios.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── gastos.routes.js
│   │   │   └── usuarios.routes.js
│   │   └── app.js
│   ├── database.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Hash de Senhas**: bcryptjs para proteção de senhas
- **Isolamento de Dados**: Cada usuário acessa apenas seus dados
- **Validação de Entrada**: Validação rigorosa de todos os dados
- **CORS Configurado**: Proteção contra requisições não autorizadas

## 📊 Banco de Dados

### Tabelas Principais
- **usuarios**: Dados dos usuários
- **gastos**: Transações financeiras
- **categorias_usuarios**: Categorias personalizadas
- **configuracoes_usuarios**: Preferências do usuário

### Relacionamentos
- Cada gasto pertence a um usuário
- Categorias são específicas por usuário
- Configurações são personalizadas

## 🚀 Deploy

### Backend (Produção)
```bash
# Build
npm run build

# Start
npm start
```

### Frontend (Produção)
```bash
# Build
npm run build

# Servir arquivos estáticos
npm run preview
```

## 🔮 Próximas Funcionalidades

- [ ] Sistema de planos e assinaturas
- [ ] Relatórios avançados (PDF/Excel)
- [ ] Integração com bancos
- [ ] Notificações push
- [ ] App mobile
- [ ] Dashboard administrativo
- [ ] API para terceiros

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email ou abra uma issue no repositório.

---

**ControlaZap** - Transformando o controle financeiro em uma experiência simples e integrada! 💰📱
