import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Index() {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to SmartCedi</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
