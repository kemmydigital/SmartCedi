
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Plus, AlertTriangle, Bell } from 'lucide-react';
import { getCategories } from '@/utils/localStorage';
import { Slider } from '@/components/ui/slider';

const Budget: React.FC = () => {
  const { budgets, addBudget, deleteBudget, checkBudgetAlerts } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [alertThreshold, setAlertThreshold] = useState<number>(80); // Default alert at 80%

  const expenseCategories = getCategories('expense');
  
  // Get budget alerts
  const budgetAlerts = checkBudgetAlerts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    // Check if budget for this category already exists
    if (budgets.some(b => b.category === category)) {
      toast({
        title: "Budget already exists",
        description: "A budget for this category already exists",
        variant: "destructive"
      });
      return;
    }

    addBudget({
      category,
      amount: parseFloat(amount),
      period,
      alertThreshold
    });

    toast({
      title: "Budget added",
      description: `Budget for ${category} added successfully`,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setAlertThreshold(80);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div>Total Budget</div>
            <div className="font-bold">{formatCurrency(budgets.reduce((sum, budget) => sum + budget.amount, 0))}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>Total Spent</div>
            <div className="font-bold">{formatCurrency(budgets.reduce((sum, budget) => sum + budget.spent, 0))}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Remaining</div>
            <div className="font-bold text-money-income">
              {formatCurrency(budgets.reduce((sum, budget) => sum + (budget.amount - budget.spent), 0))}
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
            {budgetAlerts.map((alert) => (
              <div key={alert.category} className="text-sm">
                <span className="font-medium">{alert.category}:</span> Spent {formatCurrency(alert.spent)} of {formatCurrency(alert.amount)} ({Math.round(alert.percentage)}%)
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Budget Button */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-1" /> Add New Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount (GH¢)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Budget Period</Label>
                <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-threshold" className="flex items-center">
                  <Bell size={14} className="mr-1" /> 
                  Alert Threshold: {alertThreshold}%
                </Label>
                <Slider 
                  id="alert-threshold"
                  defaultValue={[alertThreshold]} 
                  max={100} 
                  step={5}
                  onValueChange={(values) => setAlertThreshold(values[0])}
                  className="py-4"
                />
                <div className="text-xs text-muted-foreground">
                  You'll receive alerts when spending reaches this percentage of your budget.
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Budgets */}
      <div className="space-y-4">
        <h3 className="font-medium">Your Budgets</h3>
        {budgets.length > 0 ? (
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const progress = (budget.spent / budget.amount) * 100;
              const isOverBudget = budget.spent > budget.amount;
              const isApproachingLimit = progress >= budget.alertThreshold && !isOverBudget;
              
              return (
                <Card key={budget.id} className={`overflow-hidden ${isApproachingLimit ? 'border-amber-300' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium">{budget.category}</div>
                          <div className="text-xs text-muted-foreground capitalize">{budget.period}</div>
                        </div>
                        {isApproachingLimit && (
                          <div className="ml-2 text-amber-500">
                            <AlertTriangle size={16} />
                          </div>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the {budget.category} budget? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteBudget(budget.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    <div className="mt-4">
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={`h-2 ${isOverBudget ? 'bg-red-200' : isApproachingLimit ? 'bg-amber-200' : ''}`}
                        indicatorClassName={isOverBudget ? 'bg-destructive' : isApproachingLimit ? 'bg-amber-500' : ''}
                      />
                      <div className="flex justify-between mt-2">
                        <div className="text-sm">
                          <span className={isOverBudget ? 'text-destructive' : isApproachingLimit ? 'text-amber-600' : ''}>
                            {formatCurrency(budget.spent)}
                          </span> of {formatCurrency(budget.amount)}
                        </div>
                        <div className="text-sm">
                          {isOverBudget ? (
                            <span className="text-destructive">Over budget!</span>
                          ) : (
                            <span>{formatCurrency(budget.amount - budget.spent)} left</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Alert at {budget.alertThreshold}% of budget
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No budgets set yet. Add a budget to track your spending.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Budget;
