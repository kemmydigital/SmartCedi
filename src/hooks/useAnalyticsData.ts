
import { useMemo } from 'react';
import { Transaction } from '@/types';
import { format, subDays, subMonths, isWithinInterval, parseISO } from 'date-fns';

export type TimeRange = '7days' | '30days' | '90days' | 'all';

export const useAnalyticsData = (
  transactions: Transaction[],
  timeRange: TimeRange
) => {
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
      // Use the actual payment method for the data structure (which conforms to the type)
      const paymentMethod = transaction.paymentMethod;
      
      // Only for display purposes, create a user-friendly name
      const displayName = transaction.paymentMethod === 'mobileMoney' && transaction.mobileMoneyProvider
        ? `${transaction.mobileMoneyProvider} Mobile Money`
        : transaction.paymentMethod;
      
      // Store with the actual payment method as the key
      if (!methodSpending[paymentMethod]) {
        methodSpending[paymentMethod] = 0;
      }
      methodSpending[paymentMethod] += transaction.amount;
    });
    
    // Convert to array for the chart with proper display names
    return Object.entries(methodSpending)
      .map(([method, value]) => {
        // Get provider from the first transaction with this method
        const transaction = filteredTransactions.find(t => t.paymentMethod === method);
        const displayName = method === 'mobileMoney' && transaction?.mobileMoneyProvider
          ? `${transaction.mobileMoneyProvider} Mobile Money`
          : method;
          
        return { name: displayName, method, value };
      })
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

  return {
    filteredTransactions,
    categoryData,
    paymentMethodData,
    trendData,
    totalSpending
  };
};
