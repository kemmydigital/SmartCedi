
export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string;
  paymentMethod: 'cash' | 'mobileMoney' | 'bank' | 'other';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface AppContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  isOffline: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  updateSavingsGoal: (id: string, amount: number) => void;
  deleteTransaction: (id: string) => void;
  deleteBudget: (id: string) => void;
  deleteSavingsGoal: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}
