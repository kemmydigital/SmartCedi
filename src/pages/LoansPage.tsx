import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoan } from "@/context/LoanContext";

// Simple currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export default function LoansPage() {
  const { loans } = useLoan();

  return (
    <Layout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loan Management</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </Layout>
  );
}
