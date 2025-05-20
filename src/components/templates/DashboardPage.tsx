import React from 'react';
import { Header } from '../organisms/Header';
import { Container } from '../atoms/ui/container';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10">
        <Container>
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Analytics Overview</h2>
              <p className="text-gray-600">View your social media performance at a glance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Scheduled Posts</h2>
              <p className="text-gray-600">Manage your upcoming content.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Engagement</h2>
              <p className="text-gray-600">Monitor and respond to audience interactions.</p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}; 