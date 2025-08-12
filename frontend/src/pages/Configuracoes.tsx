import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e conta
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta página será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Configurações da Conta</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Personalize sua experiência e gerencie suas preferências do sistema.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Alterar dados pessoais</p>
              <p>• Configurar tema (claro/escuro)</p>
              <p>• Integração com WhatsApp</p>
              <p>• Notificações e alertas</p>
              <p>• Preferências de exportação</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}