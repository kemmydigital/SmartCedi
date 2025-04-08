
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/utils/localStorage';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { format, subDays, subMonths, isWithinInterval, parseISO } from 'date-fns';

const SpendingAnalytics: React.FC = () => {
  const { transactions } = useAppContext();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [chartView, setChartView] = useState<'category' | 'trend' | 'payment'>('category');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    // Only consider expenses for analytics
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    if (timeRange === 'all') return expenseTransactions;
    
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = timeRange === '90days' ? subMonths(now, 3) : subDays(now, days);
    
    return expenseTransactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: startDate, end: now });
    });
  }, [transactions, timeRange]);

  // Category spending data for pie chart
  const categoryData = useMemo(() => {
    const categorySpending: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      if (!categorySpending[transaction.category]) {
        categorySpending[transaction.category] = 0;
      }
      categorySpending[transaction.category] += transaction.amount;
    });
    
    return Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Payment method data
  const paymentMethodData = useMemo(() => {
    const methodSpending: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      let method = transaction.paymentMethod;
      if (method === 'mobileMoney' && transaction.mobileMoneyProvider) {
        method = transaction.mobileMoneyProvider;
      }
      
      if (!methodSpending[method]) {
        methodSpending[method] = 0;
      }
      methodSpending[method] += transaction.amount;
    });
    
    return Object.entries(methodSpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Trend data (by day or week)
  const trendData = useMemo(() => {
    if (filteredTransactions.length === 0) return [];
    
    const dateFormat = timeRange === '7days' ? 'EEE' : 'dd MMM';
    const groupByDate: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = format(parseISO(transaction.date), dateFormat);
      if (!groupByDate[date]) {
        groupByDate[date] = 0;
      }
      groupByDate[date] += transaction.amount;
    });
    
    // Sort by date
    return Object.entries(groupByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        // If in 7-day mode with day names, sort by day of week
        if (timeRange === '7days') {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days.indexOf(a.date) - days.indexOf(b.date);
        }
        return a.date.localeCompare(b.date);
      });
  }, [filteredTransactions, timeRange]);

  // Calculate total spending
  const totalSpending = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [filteredTransactions]);

  // Get chart config based on current view
  const getChartContent = () => {
    switch (chartView) {
      case 'category':
        return (
          <div className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        
      case 'trend':
        return (
          <div className="h-80">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `GH¢${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No expense data to display for this period
              </div>
            )}
          </div>
        );
        
      case 'payment':
        return (
          <div className="h-80">
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Spending Analytics</h1>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <Select value={timeRange} onValueChange={(val: any) => setTimeRange(val)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={chartView} onValueChange={(val: any) => setChartView(val)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="trend">Spending Trend</SelectItem>
              <SelectItem value="payment">Payment Methods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Total Spending Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalSpending)}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {timeRange === 'all' ? 'All time' : 
              timeRange === '7days' ? 'Last 7 days' :
              timeRange === '30days' ? 'Last 30 days' : 'Last 90 days'}
          </div>
        </CardContent>
      </Card>
      
      {/* Chart Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            {chartView === 'category' ? 'Spending by Category' :
             chartView === 'trend' ? 'Spending Trend' : 'Payment Methods'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getChartContent()}
        </CardContent>
      </Card>
      
      {/* Insight Cards */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Category */}
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
          
          {/* Preferred Payment Method */}
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
      )}
    </div>
  );
};

export default SpendingAnalytics;
