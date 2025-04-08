import React from 'react';
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoanProvider } from "@/context/LoanContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
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
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LoanProvider>
            <Toaster />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/loans" element={<LoansPage />} />
              </Route>
            </Routes>
          </LoanProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
