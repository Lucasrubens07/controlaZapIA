import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Wallet, Receipt, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Componentes
import DatePresets from '@/components/DatePresets';
import TransactionsTable, { Row } from '@/components/TransactionsTable';
import CategoryPie from '@/components/CategoryPie';
import Toolbar from '@/components/Toolbar';
import TransactionForm from '@/components/TransactionForm';

// Services
import http from '@/services/http';

// Types
interface SummaryData {
  totalExpense: number;
  transactionCount: number;
  balance: number;
}

interface CategoryData {
  categoria: string;
  total: number;
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Estados da URL
  const categoria = searchParams.get('categoria') || '';
  const inicio = searchParams.get('inicio') || '';
  const fim = searchParams.get('fim') || '';
  const sort = searchParams.get('sort') || 'data_desc';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  // Estados locais
  const [transactions, setTransactions] = useState<Row[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalExpense: 0,
    transactionCount: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Estados do formulário
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingTransaction, setEditingTransaction] = useState<Row | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  // Fetch de dados
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (categoria) params.append('categoria', categoria);
      if (inicio) params.append('inicio', inicio);
      if (fim) params.append('fim', fim);
      if (sort) params.append('sort', sort);

      // Fetch paralelo de transações e resumo por categoria
      const [transactionsResponse, categoryResponse] = await Promise.all([
        http.get(`/gastos?${params.toString()}&page=${page}&limit=${perPage}`),
        http.get(`/gastos/categorias/resumo?${params.toString()}`),
      ]);

      const transactionsData = transactionsResponse.data?.data || [];
      const categoryDataResponse = categoryResponse.data?.data || [];

      setTransactions(transactionsData);
      setCategoryData(categoryDataResponse);
      setTotalTransactions(transactionsResponse.data?.total || transactionsData.length);

      // Calcular resumo
      const totalExpense = transactionsData.reduce((sum: number, t: Row) => sum + Math.abs(t.valor), 0);
      setSummaryData({
        totalExpense,
        transactionCount: transactionsData.length,
        balance: 0, // TODO: Implementar cálculo do saldo real
      });

    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [categoria, inicio, fim, sort, page, perPage]);

  // Effect para carregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleDateChange = (range: { inicio?: string; fim?: string }) => {
    updateParams(range);
  };

  const handleToolbarChange = (field: string, value: string) => {
    updateParams({ [field]: value, page: '1' }); // Reset page when filters change
  };

  const handleClear = () => {
    updateParams({
      categoria: null,
      inicio: null,
      fim: null,
      sort: 'data_desc',
      page: '1',
    });
  };

  const handleCreateTransaction = () => {
    setFormMode('create');
    setEditingTransaction(null);
    setFormOpen(true);
  };

  const handleEditTransaction = (transaction: Row) => {
    setFormMode('edit');
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await http.delete(`/gastos/${id}`);
      toast({
        title: 'Transação excluída',
        description: 'A transação foi removida com sucesso.',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir a transação.',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (payload: {
    valor: number;
    categoria: string;
    data: string;
    id?: number;
  }) => {
    setFormLoading(true);
    try {
      if (formMode === 'create') {
        await http.post('/gastos', {
          valor: payload.valor,
          categoria: payload.categoria,
          data: payload.data,
        });
        toast({
          title: 'Transação criada',
          description: 'Nova transação adicionada com sucesso.',
        });
      } else {
        await http.put(`/gastos/${payload.id}`, {
          valor: payload.valor,
          categoria: payload.categoria,
          data: payload.data,
        });
        toast({
          title: 'Transação atualizada',
          description: 'As alterações foram salvas com sucesso.',
        });
      }
      
      fetchData();
      setFormOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a transação.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Controle financeiro completo
          </p>
        </div>
        
        <Button onClick={handleCreateTransaction} className="bg-gradient-primary shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ 0,00
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando implementação
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">
              {formatCurrency(summaryData.totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total do período
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summaryData.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo atual
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transações
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Registros encontrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DatePresets
          inicio={inicio}
          fim={fim}
          onChange={handleDateChange}
          onApply={fetchData}
          onClear={handleClear}
          loading={loading}
        />
        
        <Toolbar
          categoria={categoria}
          onCategoriaChange={(value) => handleToolbarChange('categoria', value)}
          sort={sort}
          onSortChange={(value) => handleToolbarChange('sort', value)}
          onRefresh={fetchData}
          onClear={handleClear}
          loading={loading}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Transações */}
        <div className="lg:col-span-2">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Transações</CardTitle>
              <CardDescription>
                Histórico detalhado de movimentações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                rows={transactions}
                page={page}
                perPage={perPage}
                total={totalTransactions}
                onPageChange={(newPage) => updateParams({ page: newPage.toString() })}
                sort={sort}
                onSortChange={(newSort) => handleToolbarChange('sort', newSort)}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                loading={loading}
                emptyMessage="Nenhuma transação encontrada para os filtros aplicados"
              />
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Categorias */}
        <div>
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>
                Distribuição dos gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPie data={categoryData} height={300} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Transação */}
      <TransactionForm
        open={formOpen}
        mode={formMode}
        initial={editingTransaction ? {
          id: editingTransaction.id,
          valor: editingTransaction.valor,
          categoria: editingTransaction.categoria,
          data: editingTransaction.data,
        } : undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
}