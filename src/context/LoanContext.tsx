import React, { createContext, useContext, useState } from 'react';

interface Loan {
  id: string;
  amount: number;
  startDate: Date;
  status: 'pending' | 'active' | 'completed';
  weeklyPayment: number;
  payments: {
    amount: number;
    date: Date;
  }[];
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
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      amount: 10000,
      startDate: new Date(),
      status: 'active',
      weeklyPayment: (10000 * 1.2) / 15,
      payments: []
    }
  ]);
  const [savings, setSavings] = useState<Savings>({ 
    amount: 1000, 
    weeklyDeposit: 1481 
  });
  const [financials, setFinancials] = useState<Financials>({
    income: { interest: 0, processingFees: 0, otherIncome: 0 },
    expenses: { commission: 0, transportation: 250, salaries: 0, stationery: 0 },
    insurance: 0
  });

  const createLoan = (amount: number) => {
    try {
      const newLoan: Loan = {
        id: Date.now().toString(),
        amount,
        startDate: new Date(),
        status: 'active',
        weeklyPayment: (amount * 1.2) / 15, // Principal + 20% interest over 15 weeks
        payments: []
      };
      
      // Savings calculations (14.81% weekly + 10% initial)
      const weeklySavings = amount * 0.1481;
      const initialSavings = amount * 0.1;

      // Income calculations
      const weeklyInterest = amount * 0.1308; // 13.08% weekly interest
      const processingFee = amount * 0.05; // 5% processing fee
      const insurance = amount * 0.03; // 3% insurance

      setLoans([...loans, newLoan]);
      setSavings({
        amount: initialSavings,
        weeklyDeposit: weeklySavings
      });
      setFinancials({
        income: {
          interest: weeklyInterest,
          processingFees: processingFee,
          otherIncome: financials.income.otherIncome
        },
        expenses: {
          commission: amount * 0.05, // 5% commission
          transportation: 250,
          salaries: financials.expenses.salaries,
          stationery: financials.expenses.stationery
        },
        insurance
      });
      
      return { success: true };
    } catch (error) {
      console.error('Loan creation error:', error);
      return { success: false, error };
    }
  };

  const makePayment = (loanId: string, amount: number) => {
    try {
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId 
            ? {
                ...loan,
                payments: [
                  ...loan.payments,
                  {
                    amount,
                    date: new Date()
                  }
                ]
              }
            : loan
        )
      );
      
      // Update savings with weekly deposit
      setSavings(prev => ({
        ...prev,
        amount: prev.amount + (prev.weeklyDeposit || 0)
      }));

      return { success: true };
    } catch (error) {
      console.error('Payment error:', error);
      return { success: false, error };
    }
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
