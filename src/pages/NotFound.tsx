import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg">The page you're looking for doesn't exist.</p>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
