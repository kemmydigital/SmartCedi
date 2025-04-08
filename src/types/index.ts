export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
  payment_method?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  spent: number;
  alert_threshold?: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  term_weeks: number;
  weekly_payment: number;
  start_date: string;
  status: 'active' | 'completed' | 'defaulted';
}

export type PaymentMethod = 
  | 'cash' 
  | 'mobileMoney' 
  | 'bankTransfer' 
  | 'card';
