import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Save, X, AlertCircle } from 'lucide-react';

export type TransactionFormProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: {
    id?: number;
    valor?: number;
    categoria?: string;
    data?: string;
  };
  onClose: () => void;
  onSubmit: (payload: {
    valor: number;
    categoria: string;
    data: string;
    id?: number;
  }) => Promise<void>;
  loading?: boolean;
};

export default function TransactionForm({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    valor: '',
    categoria: '',
    data: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetar form quando abrir/fechar ou mudar dados iniciais
  useEffect(() => {
    if (open) {
      setFormData({
        valor: initial?.valor?.toString() || '',
        categoria: initial?.categoria || '',
        data: initial?.data || new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [open, initial]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar valor
    const valor = parseFloat(formData.valor);
    if (!formData.valor) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(valor) || valor <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    // Validar categoria
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    } else if (formData.categoria.trim().length < 2) {
      newErrors.categoria = 'Categoria deve ter pelo menos 2 caracteres';
    }

    // Validar data
    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.data);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.data = 'Data não pode ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit({
        valor: parseFloat(formData.valor),
        categoria: formData.categoria.trim(),
        data: formData.data,
        id: initial?.id,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Nova Transação
              </>
            ) : (
              <>
                <Edit className="h-5 w-5 text-primary" />
                Editar Transação
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Adicione uma nova despesa ou receita ao seu controle financeiro.'
              : 'Modifique os dados da transação selecionada.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Valor */}
          <div className="space-y-2">
            <Label htmlFor="valor" className="text-sm font-medium">
              Valor *
            </Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              disabled={loading}
              className={errors.valor ? 'border-danger focus:ring-danger' : ''}
            />
            {errors.valor && (
              <div className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle className="h-3 w-3" />
                {errors.valor}
              </div>
            )}
          </div>

          {/* Campo Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-sm font-medium">
              Categoria *
            </Label>
            <Input
              id="categoria"
              type="text"
              placeholder="Ex: Alimentação, Transporte, Lazer..."
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              disabled={loading}
              className={errors.categoria ? 'border-danger focus:ring-danger' : ''}
            />
            {errors.categoria && (
              <div className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle className="h-3 w-3" />
                {errors.categoria}
              </div>
            )}
          </div>

          {/* Campo Data */}
          <div className="space-y-2">
            <Label htmlFor="data" className="text-sm font-medium">
              Data *
            </Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              disabled={loading}
              className={errors.data ? 'border-danger focus:ring-danger' : ''}
            />
            {errors.data && (
              <div className="flex items-center gap-1 text-sm text-danger">
                <AlertCircle className="h-3 w-3" />
                {errors.data}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}