const express = require("express");
const router = express.Router();
const transactionRouter = require("./transaction/transaction");

router.use("/transactions", transactionRouter);

module.exports = router;
