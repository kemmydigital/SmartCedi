import { createClient } from '@supabase/supabase-js';
import { Transaction, Budget, SavingsGoal, Loan } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Transactions API
export const transactionAPI = {
  getTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return { data, error };
  },
  addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select();
    return { data, error };
  },
  deleteTransaction: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Budgets API
export const budgetAPI = {
  getBudgets: async (userId: string) => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },
  addBudget: async (budget: Omit<Budget, 'id'|'spent'>) => {
    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...budget, spent: 0 })
      .select();
    return { data, error };
  }
};

// Savings API
export const savingsAPI = {
  getSavingsGoals: async (userId: string) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },
  addSavingsGoal: async (goal: Omit<SavingsGoal, 'id'|'current_amount'>) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...goal, current_amount: 0 })
      .select();
    return { data, error };
  }
};

// Loans API
export const loanAPI = {
  getLoans: async (userId: string) => {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },
  createLoan: async (loan: Omit<Loan, 'id'|'status'>) => {
    const { data, error } = await supabase
      .from('loans')
      .insert({ ...loan, status: 'active' })
      .select();
    return { data, error };
  }
};
