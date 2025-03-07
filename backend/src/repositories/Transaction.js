const { Transaction, sequelize } = require("../models");
const { Op } = require("sequelize");

const getTransactions = async ({ type, from, to, category }) => {
  try {
    const where = {};
    if (type) where.type = type;
    if (from && to) where.date = { [Op.between]: [from, to] };
    if (category) where.category = category;

    return await Transaction.findAll({ where });
  } catch (error) {
    throw error;
  }
};

const getTransactionById = async (id) => {
  try {
    return await Transaction.findByPk(id);
  } catch (error) {
    throw error;
  }
};

const createTransaction = async ({
  amount,
  type,
  category,
  description,
  date,
}) => {
  try {
    return Transaction.create({
      amount,
      type,
      category,
      description,
      date: date || new Date(),
    });
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

const updateTransaction = async (id, updates) => {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;

    return await transaction.update(updates);
  } catch (error) {
    throw error;
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;
    await transaction.destroy();
  } catch (error) {
    throw error;
  }
};

const getSummary = async ({ from, to } = {}) => {
  try {

    const whereCondition = {};
    if (from && to) whereCondition.date = { [Op.between]: [from, to] };


    const transactions = await Transaction.findAll({
      attributes: [
        "type",
        [sequelize.fn("COALESCE", sequelize.fn("SUM", sequelize.col("amount")), 0), "total"]
      ],
      where: whereCondition,
      group: ["type"],
      raw: true,
    });

    let income = 0, expense = 0;

    transactions.forEach(t => {
      if (t.type === "income") income = Number(t.total);
      if (t.type === "expense") expense = Number(t.total);
    });

    const result = {
      income,
      expense,
      balance: income - expense,
    };

    return result;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
};





module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
