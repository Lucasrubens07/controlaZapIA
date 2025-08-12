import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export type CategoryPieProps = {
  data: { categoria: string; total: number }[];
  height?: number;
};

// Cores do gráfico seguindo o design system
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--primary-light))',
  'hsl(var(--primary-dark))',
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
        <p className="font-medium text-popover-foreground">{data.categoria}</p>
        <p className="text-sm text-primary font-semibold">
          {formatCurrency(data.total)}
        </p>
        <p className="text-xs text-muted-foreground">
          {((data.total / payload[0].payload.totalSum) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CategoryPie({ data, height = 300 }: CategoryPieProps) {
  // Calcular total para porcentagens no tooltip
  const totalSum = data.reduce((sum, item) => sum + item.total, 0);
  const dataWithTotal = data.map(item => ({ ...item, totalSum }));

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
            <PieChart className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhum dado disponível</p>
          <p className="text-xs text-muted-foreground mt-1">
            Os dados aparecerão aqui quando houver transações
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
            strokeWidth={2}
            stroke="hsl(var(--background))"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Resumo textual */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{formatCurrency(totalSum)}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {data.length} categoria{data.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}