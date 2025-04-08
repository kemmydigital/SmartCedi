import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-bold">SmartCedi</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <main className="container py-4">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
