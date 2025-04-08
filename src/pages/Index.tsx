import React from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <Layout>
      <main className="container py-4">
        <Dashboard />
      </main>
    </Layout>
  );
};

export default Index;
