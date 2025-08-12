import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3 } from 'lucide-react';

export default function Relatorios() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises detalhadas das suas finanças
          </p>
        </div>
        
        <Button className="bg-gradient-primary shadow-soft">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Placeholder */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta página será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Relatórios Financeiros</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tenha acesso a relatórios completos e insights sobre seus gastos e receitas.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Relatórios por período</p>
              <p>• Análise por categoria</p>
              <p>• Exportação em PDF/CSV</p>
              <p>• Gráficos interativos</p>
              <p>• Comparação entre períodos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}