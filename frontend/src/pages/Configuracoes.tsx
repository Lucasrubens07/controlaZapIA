import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Settings, Palette, Bell, DollarSign, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import http from '@/services/http';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  telefone: string | null;
  plano: string;
  limite_mensal: number | null;
}

interface UserSettings {
  tema: string;
  moeda: string;
  notificacoes: boolean;
  limite_mensal_alerta: number;
}

export default function Configuracoes() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    tema: 'light',
    moeda: 'BRL',
    notificacoes: true,
    limite_mensal_alerta: 1000
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();

  // Carregar dados do usuário
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [profileRes, settingsRes] = await Promise.all([
        http.get('/usuarios/perfil'),
        http.get('/usuarios/configuracao/tema'),
        http.get('/usuarios/configuracao/moeda'),
        http.get('/usuarios/configuracao/notificacoes'),
        http.get('/usuarios/configuracao/limite_mensal_alerta')
      ]);

      if (profileRes.data?.success) {
        setProfile(profileRes.data.data);
      }

      // Carregar configurações
      const tema = await http.get('/usuarios/configuracao/tema');
      const moeda = await http.get('/usuarios/configuracao/moeda');
      const notificacoes = await http.get('/usuarios/configuracao/notificacoes');
      const limiteAlerta = await http.get('/usuarios/configuracao/limite_mensal_alerta');

      setSettings({
        tema: tema.data?.data?.valor || 'light',
        moeda: moeda.data?.data?.valor || 'BRL',
        notificacoes: notificacoes.data?.data?.valor === 'true',
        limite_mensal_alerta: Number(limiteAlerta.data?.data?.valor) || 1000
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar suas informações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const response = await http.put('/usuarios/perfil', {
        name: profile.name,
        email: profile.email,
        telefone: profile.telefone
      });

      if (response.data?.success) {
        updateUser(response.data.data);
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram salvas com sucesso.',
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error.response?.data?.message || 'Erro ao salvar alterações.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A nova senha e a confirmação devem ser iguais.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.novaSenha.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await http.put('/usuarios/senha', {
        senhaAtual: passwordData.senhaAtual,
        novaSenha: passwordData.novaSenha
      });

      if (response.data?.success) {
        toast({
          title: 'Senha alterada',
          description: 'Sua senha foi alterada com sucesso.',
        });
        setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: 'Erro ao alterar senha',
        description: error.response?.data?.message || 'Erro ao alterar senha.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    try {
      await http.put(`/usuarios/configuracao/${key}`, { valor: value.toString() });
      setSettings(prev => ({ ...prev, [key]: value }));
      toast({
        title: 'Configuração salva',
        description: 'Sua preferência foi salva com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a configuração.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie seu perfil e preferências
          </p>
        </div>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="senha" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Senha
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferências
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profile?.name || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      value={profile?.telefone || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, telefone: e.target.value } : null)}
                      className="pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plano">Plano atual</Label>
                  <Input
                    id="plano"
                    value={profile?.plano || 'free'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Button 
                onClick={handleProfileUpdate}
                disabled={saving}
                className="w-full md:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Senha */}
        <TabsContent value="senha" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha atual</Label>
                <Input
                  id="senhaAtual"
                  type="password"
                  value={passwordData.senhaAtual}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova senha</Label>
                <Input
                  id="novaSenha"
                  type="password"
                  value={passwordData.novaSenha}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, novaSenha: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={passwordData.confirmarSenha}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <Button 
                onClick={handlePasswordChange}
                disabled={saving}
                className="w-full md:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  'Alterar senha'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Personalize sua experiência no ControlaZap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema</Label>
                  <Select
                    value={settings.tema}
                    onValueChange={(value) => handleSettingChange('tema', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moeda">Moeda</Label>
                  <Select
                    value={settings.moeda}
                    onValueChange={(value) => handleSettingChange('moeda', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas sobre seus gastos
                    </p>
                  </div>
                  <Switch
                    checked={settings.notificacoes}
                    onCheckedChange={(checked) => handleSettingChange('notificacoes', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limiteAlerta">Limite mensal para alertas</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="limiteAlerta"
                      type="number"
                      value={settings.limite_mensal_alerta}
                      onChange={(e) => handleSettingChange('limite_mensal_alerta', Number(e.target.value))}
                      className="pl-10"
                      placeholder="1000"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você receberá alertas quando ultrapassar este valor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}