
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAnalyticsData, TimeRange } from '@/hooks/useAnalyticsData';
import TimeRangeSelector from './analytics/TimeRangeSelector';
import ChartTypeSelector, { ChartView } from './analytics/ChartTypeSelector';
import TotalSpendingCard from './analytics/TotalSpendingCard';
import ChartContainer from './analytics/ChartContainer';
import InsightCards from './analytics/InsightCards';

const SpendingAnalytics: React.FC = () => {
  const { transactions } = useAppContext();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [chartView, setChartView] = useState<ChartView>('category');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  // Use our custom hook to get all analytics data
  const { 
    filteredTransactions, 
    categoryData, 
    paymentMethodData, 
    trendData, 
    totalSpending 
  } = useAnalyticsData(transactions, timeRange);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Spending Analytics</h1>
      
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <TimeRangeSelector 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange} 
          />
        </div>
        
        <div>
          <ChartTypeSelector 
            chartView={chartView} 
            onChartViewChange={setChartView} 
          />
        </div>
      </div>
      
      <TotalSpendingCard 
        amount={totalSpending} 
        timeRange={timeRange} 
      />
      
      <ChartContainer 
        chartView={chartView}
        categoryData={categoryData}
        paymentMethodData={paymentMethodData}
        trendData={trendData}
        colors={COLORS}
      />
      
      {filteredTransactions.length > 0 && (
        <InsightCards 
          categoryData={categoryData} 
          paymentMethodData={paymentMethodData}
          totalSpending={totalSpending}
        />
      )}
    </div>
  );
};

export default SpendingAnalytics;
