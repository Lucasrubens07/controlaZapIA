import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, RefreshCw, X } from 'lucide-react';

export type ToolbarProps = {
  categoria?: string;
  onCategoriaChange: (categoria: string) => void;
  sort?: string;
  onSortChange: (sort: string) => void;
  onRefresh: () => void;
  onClear: () => void;
  loading?: boolean;
};

const sortOptions = [
  { value: 'data_desc', label: 'Data (mais recente)' },
  { value: 'data_asc', label: 'Data (mais antiga)' },
  { value: 'valor_desc', label: 'Valor (maior)' },
  { value: 'valor_asc', label: 'Valor (menor)' },
  { value: 'categoria_asc', label: 'Categoria (A-Z)' },
  { value: 'categoria_desc', label: 'Categoria (Z-A)' },
  { value: 'criado_em_desc', label: 'Criado (mais recente)' },
  { value: 'criado_em_asc', label: 'Criado (mais antigo)' },
];

export default function Toolbar({
  categoria = '',
  onCategoriaChange,
  sort = 'data_desc',
  onSortChange,
  onRefresh,
  onClear,
  loading = false,
}: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex-1 space-y-2">
        <Label htmlFor="categoria-search" className="text-sm font-medium">
          Buscar categoria
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="categoria-search"
            placeholder="Digite para buscar categoria..."
            value={categoria}
            onChange={(e) => onCategoriaChange(e.target.value)}
            disabled={loading}
            className="pl-10"
          />
          {categoria && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoriaChange('')}
              disabled={loading}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-select" className="text-sm font-medium">
          Ordenar por
        </Label>
        <Select
          value={sort}
          onValueChange={onSortChange}
          disabled={loading}
        >
          <SelectTrigger id="sort-select" className="w-full sm:w-48">
            <SelectValue placeholder="Selecione a ordenação" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 items-end">
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Carregando...' : 'Atualizar'}
        </Button>
        
        <Button
          onClick={onClear}
          disabled={loading}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
}