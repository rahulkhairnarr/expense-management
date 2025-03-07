const express = require("express");
const service = require("../../services/transactionService");
const { 
    getTransactionsValidator, 
    getTransactionByIdValidator,
    createTransactionValidator,
    updateTransactionValidator,
    deleteTransactionValidator,
    getSummaryValidator,
    validateRequest 
} = require("./validator");
const router = express.Router();

router.get("/", getTransactionsValidator, validateRequest, async (req, res) => {
    try {
        const { type, from, to, category } = req.query;
        const transactions = await service.getTransactions({
            type,
            from,
            to,
            category
        });
        return res.json(transactions);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get("/summary", getSummaryValidator, validateRequest, async (req, res) => {
    try {
        const { from, to } = req.query;
        const summary = await service.getSummary(
            { from, to }
        );
        return res.json(summary);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:id", getTransactionByIdValidator, validateRequest, async (req, res) => {
    try {
        const transaction = await service.getTransactionById(
            req.params.id
        );
        return res.json(transaction);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", createTransactionValidator, validateRequest, async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;
        const newTransaction = await service.createTransaction(
            { amount, type, category, description, date }
        );
        return res.status(201).json(newTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put("/:id", updateTransactionValidator, validateRequest, async (req, res) => {
    try {
        const updates = req.body;
        const updatedTransaction = await service.updateTransaction(
            req.params.id,
            updates,
        );
        return res.json(updatedTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/:id", deleteTransactionValidator, validateRequest, async (req, res) => {
    try {
        await service.deleteTransaction(req.params.id);
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
