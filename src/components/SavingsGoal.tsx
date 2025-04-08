
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PiggyBank, Trash2, Plus, PlusCircle } from 'lucide-react';

const SavingsGoal: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('');
  
  // Form state
  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [color, setColor] = useState<string>('#1A73E8');

  const handleContribution = (goalId: string) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    updateSavingsGoal(goalId, parseFloat(contributionAmount));

    toast({
      title: "Contribution added",
      description: `GH¢${contributionAmount} added to your savings goal`,
    });

    // Reset
    setContributionAmount('');
    setSelectedGoal(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Missing name",
        description: "Please enter a name for your goal",
        variant: "destructive"
      });
      return;
    }
    
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid target amount",
        variant: "destructive"
      });
      return;
    }

    addSavingsGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Default 90 days
      color
    });

    toast({
      title: "Savings Goal Created",
      description: `${name} goal has been created successfully`,
    });

    // Reset form
    setName('');
    setTargetAmount('');
    setDeadline('');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Savings Goal */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-1" /> Create Savings Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., New Phone, Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Target Amount (GH¢)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline ? deadline.substring(0, 10) : ''}
                  onChange={(e) => setDeadline(new Date(e.target.value).toISOString())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  {['#1A73E8', '#00C853', '#FF9800', '#9C27B0', '#E91E63'].map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      style={{ backgroundColor: colorOption }}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Savings Goals List */}
      <div className="space-y-4">
        <h3 className="font-medium">Your Savings Goals</h3>
        {savingsGoals.length > 0 ? (
          <div className="grid gap-4">
            {savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
              
              return (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                          style={{ backgroundColor: goal.color }}
                        >
                          <PiggyBank className="text-white" size={18} />
                        </div>
                        <div>
                          <div className="font-medium">{goal.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {daysLeft !== null ? (
                              daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'
                            ) : 'No deadline set'}
                          </div>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Savings Goal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the {goal.name} goal? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSavingsGoal(goal.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    <div className="mt-4">
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2"
                        indicatorStyle={{ backgroundColor: goal.color }}
                      />
                      
                      <div className="flex justify-between mt-2">
                        <div className="text-sm">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </div>
                        <div className="text-sm">
                          {isCompleted ? (
                            <span className="text-money-income">Completed!</span>
                          ) : (
                            <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} to go</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        {selectedGoal === goal.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={contributionAmount}
                              onChange={(e) => setContributionAmount(e.target.value)}
                              className="text-sm"
                              autoFocus
                            />
                            <Button size="sm" onClick={() => handleContribution(goal.id)}>Save</Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                setSelectedGoal(null);
                                setContributionAmount('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setSelectedGoal(goal.id)}
                          >
                            <PlusCircle size={14} className="mr-1" /> Add Contribution
                          </Button>
                        )}
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
              No savings goals yet. Create a goal to start saving!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavingsGoal;
