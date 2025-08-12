# ControlaZap IA - Sistema de Controle Financeiro

Sistema completo de controle financeiro com backend Node.js/Express e frontend React/TypeScript.

## 🚀 Estrutura do Projeto

```
controlaZapIa/
├── backend/          # API Node.js/Express
├── frontend/         # Aplicação React/TypeScript
└── README.md         # Este arquivo
```

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

## 🛠️ Instalação e Configuração

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações de banco
```

**Configuração do arquivo `.env`:**
```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlazap
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações do Servidor
PORT=3000

# Configurações de JWT (se implementar autenticação)
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=24h
```

**Configurar banco de dados:**
```bash
# Conecte ao PostgreSQL e execute:
psql -U seu_usuario -d controlazap -f database.sql
```

**Iniciar o servidor:**
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional)
# Crie um arquivo .env.local se necessário
```

**Iniciar a aplicação:**
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🗄️ Banco de Dados

### Tabela `gastos`

| Campo      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | SERIAL       | Identificador único          |
| valor      | DECIMAL(10,2)| Valor do gasto               |
| categoria  | VARCHAR(100) | Categoria do gasto           |
| data       | DATE         | Data do gasto                |
| criado_em  | TIMESTAMP    | Data/hora de criação         |

### Scripts SQL

Execute o arquivo `backend/database.sql` para criar a estrutura do banco.

## 🔧 Funcionalidades

### Backend
- ✅ API RESTful para gestão de gastos
- ✅ Validação de dados
- ✅ Tratamento de erros padronizado
- ✅ Filtros por categoria, data e ordenação
- ✅ Resumo por categoria
- ✅ CORS configurado
- ✅ Logging de requisições

### Frontend
- ✅ Dashboard com resumo financeiro
- ✅ Tabela de transações com paginação
- ✅ Filtros por data e categoria
- ✅ Formulário para criar/editar transações
- ✅ Gráfico de pizza por categoria
- ✅ Interface responsiva
- ✅ Sistema de notificações

## 📡 Endpoints da API

### Gastos
- `GET /gastos` - Listar gastos com filtros
- `POST /gastos` - Criar novo gasto
- `PUT /gastos/:id` - Atualizar gasto
- `DELETE /gastos/:id` - Excluir gasto

### Resumos
- `GET /gastos/categorias/resumo` - Resumo por categoria
- `GET /gastos/categorias/:categoria` - Gastos de uma categoria específica

### Health Check
- `GET /health` - Status da aplicação

## 🚨 Tratamento de Erros

A API retorna respostas padronizadas:

**Sucesso:**
```json
{
  "success": true,
  "data": [...],
  "message": "Operação realizada com sucesso"
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Descrição detalhada"
}
```

## 🔒 Segurança

- Validação de entrada em todos os endpoints
- Sanitização de parâmetros SQL
- CORS configurado para desenvolvimento
- Tratamento de erros sem exposição de informações sensíveis

## 🧪 Testando a API

### Exemplo de criação de gasto:
```bash
curl -X POST http://localhost:3000/gastos \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 25.50,
    "categoria": "alimentação",
    "data": "2024-01-20"
  }'
```

### Exemplo de listagem:
```bash
curl "http://localhost:3000/gastos?categoria=alimentação&sort=valor_desc"
```

## 🐛 Solução de Problemas

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -h localhost -U seu_usuario -d controlazap`

### Frontend não carrega dados
- Verifique se o backend está rodando na porta 3000
- Confirme se a URL da API está correta
- Verifique o console do navegador para erros

### Erros de CORS
- Confirme se a URL do frontend está configurada no backend
- Verifique se o middleware CORS está ativo

## 📝 Logs

O backend registra todas as requisições e erros no console:
```
2024-01-20T10:30:00.000Z - GET /gastos
2024-01-20T10:30:01.000Z - POST /gastos
```

## 🔮 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar sistema de usuários
- [ ] Implementar receitas (entradas)
- [ ] Adicionar relatórios avançados
- [ ] Sistema de metas financeiras
- [ ] Notificações por email/SMS

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme a configuração do banco de dados
3. Teste os endpoints individualmente
4. Verifique se todas as dependências estão instaladas

## 📄 Licença

Este projeto é de uso interno para controle financeiro.
