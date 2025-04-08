import { useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Index() {
  const { user } = useAuth();

  useEffect(() => {
    // Restore user's theme preference
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Redirect to dashboard if logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
