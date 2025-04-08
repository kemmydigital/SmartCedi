import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoan } from "@/context/LoanContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export default function LoansPage() {
  const { loans } = useLoan();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Loan Portfolio</h1>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
          {loans.map(loan => (
            <Card key={loan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Loan #{loan.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Amount: {formatCurrency(loan.amount)}</p>
                <p>Status: <span className="capitalize">{loan.status}</span></p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
