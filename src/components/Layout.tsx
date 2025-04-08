
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MoveUpRight, BarChart3, PiggyBank, AlertCircle, Wallet } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container max-w-lg mx-auto flex items-center">
          <Wallet className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Cedis Tracker</h1>
          <div className="ml-auto">
            {/* Offline indicator */}
            <div className="flex items-center text-xs bg-black/10 px-2 py-1 rounded-full">
              <span className={`w-2 h-2 rounded-full mr-1 ${navigator.onLine ? 'bg-green-400' : 'bg-red-500 animate-pulse-subtle'}`}></span>
              <span>{navigator.onLine ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-lg mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container max-w-lg mx-auto">
          <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 h-16">
              <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center data-[state=active]:text-primary" asChild>
                <a href="/">
                  <BarChart3 size={20} />
                  <span className="text-xs mt-1">Dashboard</span>
                </a>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex flex-col items-center justify-center data-[state=active]:text-primary" asChild>
                <a href="/transactions">
                  <MoveUpRight size={20} />
                  <span className="text-xs mt-1">Transactions</span>
                </a>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex flex-col items-center justify-center data-[state=active]:text-primary" asChild>
                <a href="/budget">
                  <AlertCircle size={20} />
                  <span className="text-xs mt-1">Budget</span>
                </a>
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex flex-col items-center justify-center data-[state=active]:text-primary" asChild>
                <a href="/savings">
                  <PiggyBank size={20} />
                  <span className="text-xs mt-1">Savings</span>
                </a>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Layout;
