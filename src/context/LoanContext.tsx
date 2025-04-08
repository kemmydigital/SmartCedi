import React, { createContext, useContext, useState } from 'react';

interface Loan {
  id: string;
  amount: number;
  startDate: Date;
  status: 'pending' | 'active' | 'completed';
}

interface Savings {
  amount: number;
  weeklyDeposit: number;
}

interface Financials {
  income: {
    interest: number;
    processingFees: number;
    otherIncome: number;
  };
  expenses: {
    commission: number;
    transportation: number;
    salaries: number;
    stationery: number;
  };
  insurance: number;
}

interface LoanContextType {
  loans: Loan[];
  savings: Savings;
  financials: Financials;
  createLoan: (amount: number) => void;
  makePayment: (loanId: string, amount: number) => void;
  updateFinancials: (type: keyof Financials, value: number) => void;
}

const LoanContext = createContext<LoanContextType | null>(null);

export const LoanProvider = ({ children }: { children: React.ReactNode }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [savings, setSavings] = useState<Savings>({ amount: 0, weeklyDeposit: 0 });
  const [financials, setFinancials] = useState<Financials>({
    income: { interest: 0, processingFees: 0, otherIncome: 0 },
    expenses: { commission: 0, transportation: 250, salaries: 0, stationery: 0 },
    insurance: 0
  });

  const createLoan = (amount: number) => {
    const newLoan: Loan = {
      id: Date.now().toString(),
      amount,
      startDate: new Date(),
      status: 'active'
    };
    
    // Calculate required values
    const interest = amount * 0.2;
    const weeklyPayment = (amount + interest) / 15;
    const weeklySavings = amount * 0.1481;
    const initialSavings = amount * 0.1;
    const processingFee = amount * 0.05;
    const insurance = amount * 0.03;

    setLoans([...loans, newLoan]);
    setSavings({
      amount: initialSavings,
      weeklyDeposit: weeklySavings
    });
    setFinancials({
      ...financials,
      income: {
        ...financials.income,
        processingFees: processingFee,
        interest: amount * 0.1308 // Weekly interest
      },
      insurance
    });
  };

  const makePayment = (loanId: string, amount: number) => {
    // Implementation for weekly payments
  };

  const updateFinancials = (type: keyof Financials, value: number) => {
    setFinancials(prev => ({ ...prev, [type]: value }));
  };

  return (
    <LoanContext.Provider value={{ loans, savings, financials, createLoan, makePayment, updateFinancials }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};
