import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export type Row = {
  id: number;
  valor: number;
  categoria: string;
  data: string;
  criado_em?: string;
};

export type TransactionsTableProps = {
  rows: Row[];
  page: number;
  perPage: number;
  total?: number;
  onPageChange?: (page: number) => void;
  sort?: string;
  onSortChange?: (sort: string) => void;
  onEdit?: (row: Row) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
  emptyMessage?: string;
};

const sortOptions = {
  data_desc: 'Data (mais recente)',
  data_asc: 'Data (mais antiga)',
  valor_desc: 'Valor (maior)',
  valor_asc: 'Valor (menor)',
  categoria_asc: 'Categoria (A-Z)',
  categoria_desc: 'Categoria (Z-A)',
  criado_em_desc: 'Criado (mais recente)',
  criado_em_asc: 'Criado (mais antigo)',
};

export default function TransactionsTable({
  rows,
  page,
  perPage,
  total = 0,
  onPageChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'Nenhuma transação encontrada',
}: TransactionsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getSortIcon = (field: string) => {
    if (sort === `${field}_asc`) return <ChevronUp className="h-4 w-4" />;
    if (sort === `${field}_desc`) return <ChevronDown className="h-4 w-4" />;
    return null;
  };

  const handleSort = (field: string) => {
    const currentDirection = sort?.includes(field) && sort.includes('_asc') ? 'asc' : 'desc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    onSortChange?.(`${field}_${newDirection}`);
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      onDelete?.(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancelar confirmação após 3 segundos
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  // Skeleton rows para loading
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('data')}
              >
                <div className="flex items-center gap-2">
                  Data
                  {getSortIcon('data')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('categoria')}
              >
                <div className="flex items-center gap-2">
                  Categoria
                  {getSortIcon('categoria')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/70 transition-colors text-right"
                onClick={() => handleSort('valor')}
              >
                <div className="flex items-center justify-end gap-2">
                  Valor
                  {getSortIcon('valor')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('criado_em')}
              >
                <div className="flex items-center gap-2">
                  Criado em
                  {getSortIcon('criado_em')}
                </div>
              </TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: perPage }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    {formatDate(row.data)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {row.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={row.valor < 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>
                      {row.valor < 0 ? '-' : ''}{formatCurrency(row.valor)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.criado_em ? formatDate(row.criado_em) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(row)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                        className={`h-8 w-8 p-0 ${
                          deleteConfirm === row.id 
                            ? 'bg-danger text-danger-foreground hover:bg-danger/90' 
                            : 'hover:bg-danger/10 hover:text-danger'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * perPage) + 1} a {Math.min(page * perPage, total)} de {total} registros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
              {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}