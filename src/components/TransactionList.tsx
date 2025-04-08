
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/utils/localStorage';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState<string>('');

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => 
      t.description.toLowerCase().includes(search.toLowerCase()) || 
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GH', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="income">Income Only</SelectItem>
            <SelectItem value="expense">Expenses Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-mono text-sm">
                        {formatDate(transaction.date)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.paymentMethod === 'mobileMoney' ? 'MoMo' : transaction.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`font-medium ${transaction.type === 'income' ? 'text-money-income' : 'text-money-expense'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-xs text-muted-foreground hover:text-destructive mt-1 flex items-center">
                            <Trash2 size={12} className="mr-1" /> Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this {transaction.amount} {transaction.type}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTransaction(transaction.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
