
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/localStorage';
import { TimeRange } from '@/hooks/useAnalyticsData';

interface TotalSpendingCardProps {
  amount: number;
  timeRange: TimeRange;
}

const TotalSpendingCard: React.FC<TotalSpendingCardProps> = ({ amount, timeRange }) => {
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case '90days': return 'Last 90 days';
      case 'all': return 'All time';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Total Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formatCurrency(amount)}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {getTimeRangeLabel()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalSpendingCard;
