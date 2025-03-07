const transactionRepository = require('../repositories/Transaction');

const getTransactions = async ({ type, from, to, category }) => {
    return transactionRepository.getTransactions({ type, from, to, category });
}

const getTransactionById = async id => {
    return transactionRepository.getTransactionById(id);
}

const createTransaction = async ({ amount, type, category, description, date }) => {
    return transactionRepository.createTransaction({ amount, type, category, description, date });
}

const updateTransaction = async (id, updates) => {
    return transactionRepository.updateTransaction(id, updates);
}

const deleteTransaction = async id => {
    return transactionRepository.deleteTransaction(id);
}

const getSummary = async ({ from, to } = {}) => {
    return transactionRepository.getSummary({ from, to });
}

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
};
