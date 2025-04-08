import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield } from 'lucide-react';
import { useLoan } from "@/context/LoanContext";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const Dashboard: React.FC = () => {
  const { loans } = useLoan();

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalLoanAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const weeklyLoanPayment = totalLoanAmount > 0 ? (totalLoanAmount * 1.2) / 15 : 0;
  const totalInsurance = totalLoanAmount * 0.03;

  return (
    <div className="space-y-6">
      {/* Only Loan Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} />
              Loan Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Active Loans</div>
                <div className="text-xl font-bold">{activeLoans.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-xl font-bold">{formatCurrency(totalLoanAmount)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Weekly Payment</div>
                <div className="text-xl font-bold">{formatCurrency(weeklyLoanPayment)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Insurance (3%)</div>
                <div className="text-xl font-bold">{formatCurrency(totalInsurance)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col justify-end">
          <Button asChild className="w-full h-full">
            <Link to="/loans" className="flex items-center justify-center h-full">
              View All Loans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
