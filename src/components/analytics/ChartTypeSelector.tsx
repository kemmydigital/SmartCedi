
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ChartView = 'category' | 'trend' | 'payment';

interface ChartTypeSelectorProps {
  chartView: ChartView;
  onChartViewChange: (value: ChartView) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ chartView, onChartViewChange }) => {
  return (
    <Select 
      value={chartView} 
      onValueChange={(val: ChartView) => onChartViewChange(val)}
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="category">By Category</SelectItem>
        <SelectItem value="trend">Spending Trend</SelectItem>
        <SelectItem value="payment">Payment Methods</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ChartTypeSelector;
