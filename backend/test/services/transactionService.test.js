const { expect } = require("chai");
const sinon = require("sinon");
const transactionService = require("../../src/services/transactionService");
const transactionRepository = require("../../src/repositories/Transaction");

describe("TransactionService", () => {
  describe("getTransactions", () => {
    let getTransactionsStub;

    beforeEach(() => {
      getTransactionsStub = sinon.stub(
        transactionRepository,
        "getTransactions"
      );
    });

    afterEach(() => {
      getTransactionsStub.restore();
    });

    it("should return transactions based on type, from, to, and category", async () => {
      const mockTransactions = [
        {
          id: 1,
          type: "income",
          amount: 100,
          category: "salary",
          date: new Date(),
        },
        {
          id: 2,
          type: "expense",
          amount: 50,
          category: "groceries",
          date: new Date(),
        },
      ];
      getTransactionsStub.resolves(mockTransactions);
      const filters = {
        type: "income",
        from: new Date(),
        to: new Date(),
        category: "salary",
      };

      const result = await transactionService.getTransactions(filters);

      expect(result).to.deep.equal(mockTransactions);
      expect(getTransactionsStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      getTransactionsStub.rejects(error);
      const filters = {
        type: "income",
        from: new Date(),
        to: new Date(),
        category: "salary",
      };
      try {
        await transactionService.getTransactions(filters);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("getTransactionById", () => {
    let getTransactionByIdStub;

    beforeEach(() => {
      getTransactionByIdStub = sinon.stub(
        transactionRepository,
        "getTransactionById"
      );
    });

    afterEach(() => {
      getTransactionByIdStub.restore();
    });

    it("should return transaction based on id", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
      };
      getTransactionByIdStub.resolves(mockTransaction);

      const result = await transactionService.getTransactionById(1);

      expect(result).to.deep.equal(mockTransaction);
      expect(getTransactionByIdStub.calledOnce).to.be.true;
    });

    it("should return null when transaction is not found", async () => {
      getTransactionByIdStub.resolves(null);

      const result = await transactionService.getTransactionById(1);

      expect(result).to.be.null;
      expect(getTransactionByIdStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      getTransactionByIdStub.rejects(error);
      try {
        await transactionService.getTransactionById(1);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("createTransaction", () => {
    let createTransactionStub;

    beforeEach(() => {
      createTransactionStub = sinon.stub(
        transactionRepository,
        "createTransaction"
      );
    });

    afterEach(() => {
      createTransactionStub.restore();
    });

    it("should create a new transaction", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
      };
      createTransactionStub.resolves(mockTransaction);

      const result = await transactionService.createTransaction(
        mockTransaction
      );

      expect(result).to.deep.equal(mockTransaction);
      expect(createTransactionStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      createTransactionStub.rejects(error);
      try {
        await transactionService.createTransaction({});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("updateTransaction", () => {
    let updateTransactionStub;

    beforeEach(() => {
      updateTransactionStub = sinon.stub(
        transactionRepository,
        "updateTransaction"
      );
    });

    afterEach(() => {
      updateTransactionStub.restore();
    });

    it("should update an existing transaction", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
      };
      updateTransactionStub.resolves(mockTransaction);

      const result = await transactionService.updateTransaction(
        1,
        mockTransaction
      );

      expect(result).to.deep.equal(mockTransaction);
      expect(updateTransactionStub.calledOnce).to.be.true;
    });

    it("should return null when transaction is not found", async () => {
      updateTransactionStub.resolves(null);

      const result = await transactionService.updateTransaction(1, {});

      expect(result).to.be.null;
      expect(updateTransactionStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      updateTransactionStub.rejects(error);
      try {
        await transactionService.updateTransaction(1, {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("deleteTransaction", () => {
    let deleteTransactionStub;

    beforeEach(() => {
      deleteTransactionStub = sinon.stub(
        transactionRepository,
        "deleteTransaction"
      );
    });

    afterEach(() => {
      deleteTransactionStub.restore();
    });

    it("should delete an existing transaction", async () => {
      deleteTransactionStub.resolves();

      await transactionService.deleteTransaction(1);

      expect(deleteTransactionStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      deleteTransactionStub.rejects(error);
      try {
        await transactionService.deleteTransaction(1);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("getSummary", () => {
    let getSummaryStub;

    beforeEach(() => {
      getSummaryStub = sinon.stub(transactionRepository, "getSummary");
    });

    afterEach(() => {
      getSummaryStub.restore();
    });

    it("should return summary of transactions", async () => {
      const mockSummary = {
        income: 100,
        expense: 50,
        balance: 50,
      };
      getSummaryStub.resolves(mockSummary);

      const result = await transactionService.getSummary();

      expect(result).to.deep.equal(mockSummary);
      expect(getSummaryStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      getSummaryStub.rejects(error);
      try {
        await transactionService.getSummary();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database error");
      }
    });
  });
});
