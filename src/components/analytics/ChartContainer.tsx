
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryChart from './CategoryChart';
import PaymentMethodChart from './PaymentMethodChart';
import TrendChart from './TrendChart';
import { ChartView } from './ChartTypeSelector';

interface ChartContainerProps {
  chartView: ChartView;
  categoryData: Array<{name: string; value: number}>;
  paymentMethodData: Array<{name: string; method: string; value: number}>;
  trendData: Array<{date: string; amount: number}>;
  colors: string[];
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  chartView,
  categoryData,
  paymentMethodData,
  trendData,
  colors
}) => {
  const getChartTitle = () => {
    switch(chartView) {
      case 'category': return 'Spending by Category';
      case 'trend': return 'Spending Trend';
      case 'payment': return 'Payment Methods';
      default: return '';
    }
  };

  const renderChart = () => {
    switch(chartView) {
      case 'category':
        return <CategoryChart data={categoryData} colors={colors} />;
      case 'trend':
        return <TrendChart data={trendData} />;
      case 'payment':
        return <PaymentMethodChart data={paymentMethodData} colors={colors} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{getChartTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
