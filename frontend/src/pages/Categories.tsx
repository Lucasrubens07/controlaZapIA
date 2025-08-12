import { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export default function Categories() {
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  // Mock data - será substituído pela API
  const categories = [
    {
      id: '1',
      name: 'Salário',
      type: 'income' as const,
      color: '#16A34A',
      transactionCount: 12
    },
    {
      id: '2',
      name: 'Freelance',
      type: 'income' as const,
      color: '#059669',
      transactionCount: 8
    },
    {
      id: '3',
      name: 'Alimentação',
      type: 'expense' as const,
      color: '#DC2626',
      transactionCount: 23
    },
    {
      id: '4',
      name: 'Transporte',
      type: 'expense' as const,
      color: '#EA580C',
      transactionCount: 15
    },
    {
      id: '5',
      name: 'Saúde',
      type: 'expense' as const,
      color: '#7C3AED',
      transactionCount: 7
    },
    {
      id: '6',
      name: 'Lazer',
      type: 'expense' as const,
      color: '#DB2777',
      transactionCount: 11
    }
  ];

  const filteredCategories = categories.filter(category => 
    selectedType === 'all' || category.type === selectedType
  );

  const getTypeLabel = (type: 'income' | 'expense') => {
    return type === 'income' ? 'Receita' : 'Despesa';
  };

  const getTypeBadgeClass = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? 'bg-success/10 text-success border-success/20' 
      : 'bg-danger/10 text-danger border-danger/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Organize suas transações por categoria
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Categoria</DialogTitle>
              <DialogDescription>
                Adicione uma nova categoria para organizar suas transações.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">Formulário em desenvolvimento...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedType('all')}
          size="sm"
        >
          Todas
        </Button>
        <Button
          variant={selectedType === 'income' ? 'default' : 'outline'}
          onClick={() => setSelectedType('income')}
          size="sm"
          className={selectedType === 'income' ? 'bg-success hover:bg-success/90' : ''}
        >
          Receitas
        </Button>
        <Button
          variant={selectedType === 'expense' ? 'default' : 'outline'}
          onClick={() => setSelectedType('expense')}
          size="sm"
          className={selectedType === 'expense' ? 'bg-danger hover:bg-danger/90' : ''}
        >
          Despesas
        </Button>
      </div>

      {/* Grid de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="shadow-soft border-border/50 hover:shadow-medium transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Tag 
                      className="h-5 w-5" 
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      {category.transactionCount} transações
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getTypeBadgeClass(category.type)}
                >
                  {getTypeLabel(category.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-danger hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Total de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {categories.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {categories.filter(c => c.type === 'income').length} receitas, {categories.filter(c => c.type === 'expense').length} despesas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Mais Utilizada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {categories.reduce((prev, current) => 
                prev.transactionCount > current.transactionCount ? prev : current
              ).name}
            </div>
            <p className="text-sm text-muted-foreground">
              {categories.reduce((prev, current) => 
                prev.transactionCount > current.transactionCount ? prev : current
              ).transactionCount} transações
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Receitas</span>
                <span>{Math.round((categories.filter(c => c.type === 'income').length / categories.length) * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Despesas</span>
                <span>{Math.round((categories.filter(c => c.type === 'expense').length / categories.length) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}