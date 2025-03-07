"use client";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/api/transactions";
import TransactionModal from "@/components/TransactionModal";

export default function Home() {
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTransactions().then(data => {
      setTransactions(data);
      setFilteredTransactions(data);
      setLoading(false);
    }).catch(error => {
      setError("Failed to load transactions.");
      setLoading(false);
      console.error(error);
    });
  }, []);

  useEffect(() => {
    let filtered = transactions;
    if (typeFilter) {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter(tx => tx.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }
    if (dateFrom) {
      filtered = filtered.filter(tx => new Date(tx.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(tx => new Date(tx.date) <= new Date(dateTo));
    }
    setFilteredTransactions(filtered);
  }, [typeFilter, categoryFilter, dateFrom, dateTo, transactions]);

  
  const incomeTotal = filteredTransactions.filter(tx => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const expenseTotal = filteredTransactions.filter(tx => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const netBalance = incomeTotal - expenseTotal;

  // New helper function to handle transaction submit
  const handleTransactionSubmit = async (transaction: Transaction) => {
    try {
      if (transaction.id) {
        // Update existing transaction
        await updateTransaction(transaction);
      } else {
        // Create new transaction
        await createTransaction(transaction);
      }
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
      setShowModal(false);
    } catch (error) {
      console.error("Transaction submission failed", error);
      setError("Transaction submission failed.");
    }
  };

  // New helper function to handle transaction delete
  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      if (!transaction?.id) {
        throw new Error("Invalid transaction ID");
      }
      await deleteTransaction(transaction.id);
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
      setShowModal(false);
    } catch (error) {
      console.error("Transaction deletion failed", error);
      setError("Transaction deletion failed.");
    }
  };

  return (
    <div className="p-8 sm:p-20 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-4">
        <button
          onClick={() => { setSelectedTransaction(undefined); setShowModal(true); }}
          className="p-2 bg-blue-500 text-white rounded"
        >
          New Transaction
        </button>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <select title="Types" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="p-2 border rounded" placeholder="From date" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="p-2 border rounded" placeholder="To date" />
        <input type="text" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2 border rounded" placeholder="Category" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h2 className="font-semibold">Total Income</h2>
              <p>${incomeTotal}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h2 className="font-semibold">Total Expense</h2>
              <p>${expenseTotal}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h2 className="font-semibold">Net Balance</h2>
              <p>${netBalance}</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr 
                    key={tx.id} 
                    className="border-b cursor-pointer" 
                    onClick={() => { setSelectedTransaction(tx); setShowModal(true); }}
                  >
                    <td className="px-4 py-2 text-center">{tx.type.toUpperCase()}</td>
                    <td className="px-4 py-2 text-center">${tx.amount}</td>
                    <td className="px-4 py-2 text-center">{tx.category}</td>
                    <td className="px-4 py-2 text-center">{tx.description}</td>
                    <td className="px-4 py-2 text-center">{new Date(tx.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <TransactionModal 
          transaction={selectedTransaction} 
          onClose={() => setShowModal(false)}
          onSubmit={handleTransactionSubmit}
          onDelete={handleDeleteTransaction}
          visible={showModal}
        />
      )}
    </div>
  );
}
