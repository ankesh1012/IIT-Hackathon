import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Coins, PlusCircle, ArrowDownCircle } from 'lucide-react';

// Mock Data for transactions
const transactions = [
  { id: 1, type: 'earn', description: "Completed 'Garden Help' for Jane D.", amount: 50, date: '2025-11-12' },
  { id: 2, type: 'redeem', description: "Redeemed for 'Plumbing' from John S.", amount: -100, date: '2025-11-10' },
  { id: 3, type: 'earn', description: "Participated in 'Community Cleanup'", amount: 10, date: '2025-11-05' },
];

const currentBalance = 530; // TODO: Fetch from API

/**
 * Credits Page (Incentive Credits)
 * The user's "wallet" to manage and view their credits.
 */
export default function Credits() {
  
  // TODO: Fetch balance and transactions from API

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">My Credits</h1>
        <p className="text-lg text-gray-600">Earn, manage, and redeem your community credits.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{currentBalance}</div>
            <p className="text-xs text-gray-500">credits available</p>
            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                <ArrowDownCircle className="mr-2 h-4 w-4" /> Redeem
              </Button>
              <Button variant="outline" className="flex-1">
                <PlusCircle className="mr-2 h-4 w-4" /> Earn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

