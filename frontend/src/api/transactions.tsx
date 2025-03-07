import { Transaction } from '@/types/transaction';
import axios from 'axios';

const baseUrl = process.env.API_URL;

export const getTransactions = async () => {
    const response = await axios.get(`${baseUrl}/transactions`);
    return response.data;
};

export const createTransaction = async (transaction: Transaction) => {
    const response = await axios.post(`${baseUrl}/transactions`, transaction);
    return response.data;
};

export const updateTransaction = async (transaction: Transaction) => {
    const response = await axios.put(`${baseUrl}/transactions/${transaction.id}`, transaction);
    return response.data;
};

export const deleteTransaction = async (id: number) => {
    const response = await axios.delete(`${baseUrl}/transactions/${id}`);
    return response.data;
};

export const getTransactionById = async (id: number) => {
    const response = await axios.get(`${baseUrl}/transactions/${id}`);
    return response.data;
};

export const getTransactionsSummary = async (from: string, to: string) => {
    const response = await axios.get(`${baseUrl}/transactions/summary?from=${from}&to=${to}`);
    return response.data;
};