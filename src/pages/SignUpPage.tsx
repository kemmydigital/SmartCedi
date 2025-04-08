import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  document.documentElement.classList.remove('dark');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);
    
    if (error) {
      showToast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      showToast({
        title: "Signup Successful",
        description: "Please check your email to verify your account"
      });
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-2 pt-4">
          <Link 
            to="/login" 
            className="w-full text-center py-2 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Already have an account? Sign In
          </Link>
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
