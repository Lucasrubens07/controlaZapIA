import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Folder } from 'lucide-react';

export default function Categorias() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias das suas transações
          </p>
        </div>
        
        <Button className="bg-gradient-primary shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Placeholder */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta página será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestão de Categorias</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Aqui você poderá criar, editar e organizar suas categorias de receitas e despesas.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Criar categorias personalizadas</p>
              <p>• Definir cores e ícones</p>
              <p>• Organizar por tipos (receita/despesa)</p>
              <p>• Estatísticas por categoria</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}