
import { Transaction, Budget, SavingsGoal } from '../types';

// Keys for local storage
const TRANSACTIONS_KEY = 'cedis_tracker_transactions';
const BUDGETS_KEY = 'cedis_tracker_budgets';
const SAVINGS_GOALS_KEY = 'cedis_tracker_savings_goals';

// Save transactions to local storage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

// Get transactions from local storage
export const getTransactions = (): Transaction[] => {
  try {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting transactions from localStorage:', error);
    return [];
  }
};

// Save budgets to local storage
export const saveBudgets = (budgets: Budget[]): void => {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets to localStorage:', error);
  }
};

// Get budgets from local storage
export const getBudgets = (): Budget[] => {
  try {
    const budgets = localStorage.getItem(BUDGETS_KEY);
    return budgets ? JSON.parse(budgets) : [];
  } catch (error) {
    console.error('Error getting budgets from localStorage:', error);
    return [];
  }
};

// Save savings goals to local storage
export const saveSavingsGoals = (savingsGoals: SavingsGoal[]): void => {
  try {
    localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(savingsGoals));
  } catch (error) {
    console.error('Error saving savings goals to localStorage:', error);
  }
};

// Get savings goals from local storage
export const getSavingsGoals = (): SavingsGoal[] => {
  try {
    const savingsGoals = localStorage.getItem(SAVINGS_GOALS_KEY);
    return savingsGoals ? JSON.parse(savingsGoals) : [];
  } catch (error) {
    console.error('Error getting savings goals from localStorage:', error);
    return [];
  }
};

// Format currency in Ghana Cedis
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get categories for transactions
export const getCategories = (type: 'income' | 'expense'): string[] => {
  if (type === 'income') {
    return [
      'Salary',
      'Freelance',
      'Business',
      'Gift',
      'Mobile Money',
      'Other',
    ];
  }

  return [
    'Food',
    'Transport',
    'Housing',
    'Utilities',
    'Education',
    'Shopping',
    'Entertainment',
    'Mobile Data',
    'Health',
    'Other',
  ];
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
