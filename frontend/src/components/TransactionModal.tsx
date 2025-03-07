import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

interface TransactionModalProps {
  visible: boolean;
  transaction?: Transaction;
  onClose: () => void;
  onSubmit: (data: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionModal({ visible, transaction, onClose, onSubmit, onDelete }: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>({
    type: 'income',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString(),
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  if (!visible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      return { ...prev, [name]: value } as Transaction;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
    }
  };

  const handleDelete = () => {
    if (transaction && onDelete) {
      onDelete(transaction);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Type</label>
          <select title="type" name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded p-2">
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Amount</label>
          <input title="amount" type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <input title="category" type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea title="description" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Date</label>
          <input
            title="date"
            type="datetime-local"
            name="date"
            value={new Date(formData.date).toISOString().substring(0,16)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mt-4 flex justify-end">
          {transaction && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="mr-auto text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
          <button type="button" onClick={onClose} className="mr-2">Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}