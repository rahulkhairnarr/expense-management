const { param, query, header, body, validationResult } = require("express-validator");

const getTransactionsValidator = [
    query("type").optional().isIn(["income", "expense"]).withMessage("type must be either 'income' or 'expense'"),
    query("from").optional().isISO8601().withMessage("from must be a valid ISO8601 date"),
    query("to").optional().isISO8601().withMessage("to must be a valid ISO8601 date"),
    query("category").optional().isString().withMessage("category must be a string"),
];

const getTransactionByIdValidator = [
    param("id").notEmpty().withMessage("Transaction id is required"),
];

const createTransactionValidator = [
    body("amount").exists().withMessage("amount is required")
        .isNumeric().withMessage("amount must be a number")
        .custom(value => value >= 0).withMessage("amount must be non-negative"),
    body("type").exists().withMessage("type is required"),
    body("category").exists().withMessage("category is required"),
    body("date").optional().isISO8601().withMessage("date must be a valid ISO8601 date"),
    body("description").optional().isString().withMessage("description must be a string"),
];

const updateTransactionValidator = [
    param("id").notEmpty().withMessage("Transaction id is required"),
    body("amount").exists().withMessage("amount is required")
        .isNumeric().withMessage("amount must be a number")
        .custom(value => value >= 0).withMessage("amount must be non-negative"),
    body("type").exists().withMessage("type is required"),
    body("category").exists().withMessage("category is required"),
    body("date").optional().isISO8601().withMessage("date must be a valid ISO8601 date"),
    body("description").optional().isString().withMessage("description must be a string"),
];

const deleteTransactionValidator = [
    param("id").notEmpty().withMessage("Transaction id is required"),
];

const getSummaryValidator = [
    query("from").optional().isISO8601().withMessage("from must be a valid ISO8601 date"),
    query("to").optional().isISO8601().withMessage("to must be a valid ISO8601 date"),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    getTransactionsValidator,
    getTransactionByIdValidator,
    createTransactionValidator,
    updateTransactionValidator,
    deleteTransactionValidator,
    getSummaryValidator,
    validateRequest
};