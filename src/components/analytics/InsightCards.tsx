
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/localStorage';

interface CategoryData {
  name: string;
  value: number;
}

interface PaymentData {
  name: string;
  method: string;
  value: number;
}

interface InsightCardsProps {
  categoryData: CategoryData[];
  paymentMethodData: PaymentData[];
  totalSpending: number;
}

const InsightCards: React.FC<InsightCardsProps> = ({ categoryData, paymentMethodData, totalSpending }) => {
  if (categoryData.length === 0 || paymentMethodData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Top Spending Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 && (
            <div>
              <div className="text-lg font-bold">{categoryData[0].name}</div>
              <div>{formatCurrency(categoryData[0].value)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((categoryData[0].value / totalSpending) * 100)}% of total spending
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Preferred Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethodData.length > 0 && (
            <div>
              <div className="text-lg font-bold">{paymentMethodData[0].name}</div>
              <div>{formatCurrency(paymentMethodData[0].value)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((paymentMethodData[0].value / totalSpending) * 100)}% of total spending
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightCards;
