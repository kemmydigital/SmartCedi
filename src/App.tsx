import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoanProvider } from "@/context/LoanContext";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage from "./pages/BudgetPage";
import SavingsPage from "./pages/SavingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoansPage from "./pages/LoansPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

document.title = "SmartCedi";

const App = () => (
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <LoanProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/savings" element={<SavingsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/loans" element={<LoansPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AppProvider>
        </LoanProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);

export default App;
