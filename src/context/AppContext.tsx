
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, SavingsGoal, AppContextType } from '../types';
import {
  getTransactions,
  getBudgets,
  getSavingsGoals,
  saveTransactions,
  saveBudgets,
  saveSavingsGoals,
  generateId,
} from '../utils/localStorage';

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Load data from localStorage on initial render
  useEffect(() => {
    setTransactions(getTransactions());
    setBudgets(getBudgets());
    setSavingsGoals(getSavingsGoals());
  }, []);

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    saveSavingsGoals(savingsGoals);
  }, [savingsGoals]);

  // Calculate financial totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Check for budget alerts
  const checkBudgetAlerts = () => {
    return budgets.filter(budget => {
      const percentage = budget.spent / budget.amount * 100;
      return percentage >= budget.alertThreshold;
    }).map(budget => ({
      category: budget.category,
      spent: budget.spent,
      amount: budget.amount,
      percentage: (budget.spent / budget.amount * 100)
    }));
  };

  // Actions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update budget spent amount if it's an expense
    if (transaction.type === 'expense') {
      setBudgets(prev =>
        prev.map(budget =>
          budget.category === transaction.category
            ? { ...budget, spent: budget.spent + transaction.amount }
            : budget
        )
      );
    }
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = { 
      ...budget, 
      id: generateId(), 
      spent: 0,
      alertThreshold: budget.alertThreshold || 80 // Default alert at 80% if not provided
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal = { ...goal, id: generateId(), currentAmount: 0 };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );

    // Add as expense transaction
    const savingsGoal = savingsGoals.find(goal => goal.id === id);
    if (savingsGoal) {
      addTransaction({
        amount,
        type: 'expense',
        category: 'Savings',
        date: new Date().toISOString(),
        description: `Savings: ${savingsGoal.name}`,
        paymentMethod: 'mobileMoney',
      });
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction && transaction.type === 'expense') {
      // Update budget spent amount
      setBudgets(prev =>
        prev.map(budget =>
          budget.category === transaction.category
            ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
            : budget
        )
      );
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const value: AppContextType = {
    transactions,
    budgets,
    savingsGoals,
    isOffline,
    addTransaction,
    addBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteTransaction,
    deleteBudget,
    deleteSavingsGoal,
    totalIncome,
    totalExpenses,
    balance,
    checkBudgetAlerts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
