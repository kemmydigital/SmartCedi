
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getCategories } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface TransactionFormProps {
  onComplete?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onComplete }) => {
  const { addTransaction } = useAppContext();
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobileMoney' | 'bank' | 'other'>('mobileMoney');

  const categories = getCategories(type);

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

    addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
      description: description || category,
      paymentMethod,
    });

    toast({
      title: "Transaction added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of GH¢${amount} added successfully`,
    });

    // Reset form
    setAmount('');
    setDescription('');
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type */}
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <RadioGroup 
          value={type} 
          onValueChange={(val) => {
            setType(val as 'income' | 'expense');
            setCategory(''); // Reset category when type changes
          }}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="cursor-pointer">Income</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (GH¢)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobileMoney">Mobile Money</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What was this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Add {type === 'income' ? 'Income' : 'Expense'}
      </Button>
    </form>
  );
};

export default TransactionForm;
