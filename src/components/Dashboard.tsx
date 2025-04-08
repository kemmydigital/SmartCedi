import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';
import { useLoan } from '@/context/LoanContext';
import { formatCurrency } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { loans, savings } = useLoan();

  // Calculate loan metrics
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalLoanAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const weeklyLoanPayment = totalLoanAmount > 0 ? (totalLoanAmount * 1.2) / 15 : 0;
  const weeklySavings = totalLoanAmount * 0.1481;
  const totalInsurance = totalLoanAmount * 0.03;

  return (
    <div className="space-y-6 p-4">
      {/* Loan System Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp size={16} />
            15-Week Loan System
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Active Loans</div>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Loan Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Weekly Payment</div>
            <div className="text-2xl font-bold">{formatCurrency(weeklyLoanPayment)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Account */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign size={16} />
            Savings Account
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Balance</div>
            <div className="text-2xl font-bold">{formatCurrency(savings.amount)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Weekly Savings</div>
            <div className="text-2xl font-bold">{formatCurrency(weeklySavings)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Account */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield size={16} />
            Insurance Account (3%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInsurance)}</div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/loans" className="flex items-center gap-2">
            Manage Loans
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/savings" className="flex items-center gap-2">
            View Savings
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
