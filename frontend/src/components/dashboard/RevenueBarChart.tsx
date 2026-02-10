import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueBarChartProps {
  data: Array<{ month: string; paid: number; pending: number }>;
}

export default function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Receitas por Mês
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value) => {
              const numericValue = Number(value);
              if (!Number.isFinite(numericValue)) {
                return 'R$ 0,00';
              }

              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(numericValue);
            }}
          />
          <Legend />
          <Bar dataKey="paid" fill="#10b981" name="Pago" />
          <Bar dataKey="pending" fill="#f59e0b" name="Pendente" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
