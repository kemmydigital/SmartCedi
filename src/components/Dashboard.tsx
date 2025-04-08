
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Plus, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/utils/localStorage';
import TransactionForm from './TransactionForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { transactions, budgets, savingsGoals, balance, totalIncome, totalExpenses, checkBudgetAlerts } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Get recent transactions
  const recentTransactions = transactions
    .slice(0, 5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate budget and savings progress
  const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalBudgetSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetProgress = totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0;

  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavingsAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const savingsProgress = totalSavingsTarget > 0 ? (totalSavingsAmount / totalSavingsTarget) * 100 : 0;

  // Get budget alerts
  const budgetAlerts = checkBudgetAlerts();

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="relative overflow-hidden">
        <div className="ghana-pattern absolute inset-0 opacity-5"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
          <div className="flex mt-4 gap-2">
            <div className="flex items-center gap-1 text-sm text-money-income">
              <ArrowUpRight size={16} />
              <span>{formatCurrency(totalIncome)}</span>
            </div>
            <div className="mx-2 text-muted-foreground">|</div>
            <div className="flex items-center gap-1 text-sm text-money-expense">
              <ArrowDownRight size={16} />
              <span>{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle size={16} className="mr-2 text-amber-600" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {budgetAlerts.slice(0, 3).map((alert) => (
              <div key={alert.category} className="text-sm">
                <span className="font-medium">{alert.category}:</span> Spent {formatCurrency(alert.spent)} of {formatCurrency(alert.amount)} ({Math.round(alert.percentage)}%)
              </div>
            ))}
            {budgetAlerts.length > 3 && (
              <div className="text-sm text-amber-600">
                <Link to="/budget">View all {budgetAlerts.length} alerts</Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Add Transaction */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="relative overflow-hidden bg-primary hover:bg-primary/90">
              <Plus size={16} className="mr-1" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Record your income or expense
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onComplete={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget and Savings Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={budgetProgress} 
              className="h-2 mb-2"
              indicatorClassName={budgetProgress > 90 ? "bg-red-500" : budgetProgress > 75 ? "bg-amber-500" : ""}
            />
            <div className="text-sm text-muted-foreground mt-1">
              {formatCurrency(totalBudgetSpent)} of {formatCurrency(totalBudgetAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={savingsProgress} className="h-2 mb-2" indicatorClassName="bg-green-500" />
            <div className="text-sm text-muted-foreground mt-1">
              {formatCurrency(totalSavingsAmount)} of {formatCurrency(totalSavingsTarget)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length > 0 ? (
            <div className="divide-y">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                      {transaction.mobileMoneyProvider && ` • ${transaction.mobileMoneyProvider}`}
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.type === 'income' ? 'text-money-income' : 'text-money-expense'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No recent transactions</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
