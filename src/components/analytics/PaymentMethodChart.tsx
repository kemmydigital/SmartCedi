
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/localStorage';

interface PaymentChartData {
  name: string;
  method: string;
  value: number;
}

interface PaymentMethodChartProps {
  data: PaymentChartData[];
  colors: string[];
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data, colors }) => {
  // Convert the data to a format compatible with the PieChart component
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value
  }));

  return (
    <div className="h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No expense data to display for this period
        </div>
      )}
    </div>
  );
};

export default PaymentMethodChart;
