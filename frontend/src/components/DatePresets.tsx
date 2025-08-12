import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, RotateCcw, Filter } from 'lucide-react';

export type DatePresetsProps = {
  inicio?: string;
  fim?: string;
  onChange: (range: { inicio?: string; fim?: string }) => void;
  onApply?: () => void;
  onClear?: () => void;
  loading?: boolean;
};

// Utilitárias para cálculo de ranges
export const getDateRanges = () => {
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  return {
    hoje: {
      inicio: formatDate(today),
      fim: formatDate(today),
    },
    seteDias: {
      inicio: formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
      fim: formatDate(today),
    },
    esseMes: {
      inicio: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      fim: formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    },
    esseAno: {
      inicio: formatDate(new Date(today.getFullYear(), 0, 1)),
      fim: formatDate(new Date(today.getFullYear(), 11, 31)),
    },
  };
};

export default function DatePresets({
  inicio,
  fim,
  onChange,
  onApply,
  onClear,
  loading = false,
}: DatePresetsProps) {
  const ranges = getDateRanges();

  const handlePresetClick = (range: { inicio: string; fim: string }) => {
    onChange(range);
    onApply?.();
  };

  const handleDateChange = (field: 'inicio' | 'fim', value: string) => {
    onChange({
      inicio: field === 'inicio' ? value : inicio,
      fim: field === 'fim' ? value : fim,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Filtros de Período</h3>
      </div>

      {/* Presets rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(ranges.hoje)}
          disabled={loading}
          className="text-xs"
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(ranges.seteDias)}
          disabled={loading}
          className="text-xs"
        >
          7 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(ranges.esseMes)}
          disabled={loading}
          className="text-xs"
        >
          Este mês
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(ranges.esseAno)}
          disabled={loading}
          className="text-xs"
        >
          Este ano
        </Button>
      </div>

      {/* Seleção customizada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inicio" className="text-sm font-medium">
            Data início
          </Label>
          <Input
            id="inicio"
            type="date"
            value={inicio || ''}
            onChange={(e) => handleDateChange('inicio', e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fim" className="text-sm font-medium">
            Data fim
          </Label>
          <Input
            id="fim"
            type="date"
            value={fim || ''}
            onChange={(e) => handleDateChange('fim', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={onApply}
          disabled={loading}
          size="sm"
          className="flex-1"
        >
          <Filter className="h-4 w-4 mr-2" />
          Aplicar
        </Button>
        <Button
          variant="outline"
          onClick={onClear}
          disabled={loading}
          size="sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}