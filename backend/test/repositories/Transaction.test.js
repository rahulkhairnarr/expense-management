const { expect } = require("chai");
const sinon = require("sinon");
const { Transaction, sequelize } = require("../../src/models");
const TransactionRepository = require("../../src/repositories/Transaction");

describe("TransactionRepository", () => {
  describe("getTransactions", () => {
    let findAllStub;

    beforeEach(() => {
      findAllStub = sinon.stub(Transaction, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
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
      findAllStub.resolves(mockTransactions);
      const filters = {
        type: "income",
        from: new Date(),
        to: new Date(),
        category: "salary",
      };

      const result = await TransactionRepository.getTransactions(filters);

      expect(result).to.deep.equal(mockTransactions);
      expect(findAllStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      findAllStub.rejects(error);
      const filters = {
        type: "income",
        from: new Date(),
        to: new Date(),
        category: "salary",
      };
      try {
        await TransactionRepository.getTransactions(filters);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(findAllStub.calledOnce).to.be.true;
    });
  });

  describe("getTransactionById", () => {
    let findByPkStub;

    beforeEach(() => {
      findByPkStub = sinon.stub(Transaction, "findByPk");
    });

    afterEach(() => {
      findByPkStub.restore();
    });

    it("should return transaction based on id", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
      };
      findByPkStub.resolves(mockTransaction);

      const result = await TransactionRepository.getTransactionById(1);

      expect(result).to.deep.equal(mockTransaction);
      expect(findByPkStub.calledOnce).to.be.true;
    });

    it("should return null when transaction is not found", async () => {
      findByPkStub.resolves(null);

      const result = await TransactionRepository.getTransactionById(1);

      expect(result).to.be.null;
      expect(findByPkStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      findByPkStub.rejects(error);
      try {
        await TransactionRepository.getTransactionById(1);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(findByPkStub.calledOnce).to.be.true;
    });
  });

  describe("createTransaction", () => {
    let createStub;

    beforeEach(() => {
      createStub = sinon.stub(Transaction, "create");
    });

    afterEach(() => {
      createStub.restore();
    });

    it("should create a new transaction", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
      };
      createStub.resolves(mockTransaction);
      const transactionData = {
        type: "income",
        amount: 100,
        category: "salary",
      };

      const result = await TransactionRepository.createTransaction(
        transactionData
      );

      expect(result).to.deep.equal(mockTransaction);
      expect(createStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      createStub.rejects(error);
      const transactionData = {
        type: "income",
        amount: 100,
        category: "salary",
      };
      try {
        await TransactionRepository.createTransaction(transactionData);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(createStub.calledOnce).to.be.true;
    });
  });

  describe("updateTransaction", () => {
    let findByPkStub;
    let updateStub;

    beforeEach(() => {
      findByPkStub = sinon.stub(Transaction, "findByPk");
      updateStub = sinon.stub(Transaction.prototype, "update");
    });

    afterEach(() => {
      findByPkStub.restore();
      updateStub.restore();
    });

    it("should update transaction based on id", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
        update: sinon.stub().resolvesThis(),
      };

      findByPkStub.resolves(mockTransaction);

      const updates = { amount: 200, category: "bonus" };

      const result = await TransactionRepository.updateTransaction(1, updates);

      expect(result).to.deep.equal(mockTransaction);
      expect(findByPkStub.calledOnce).to.be.true;
      expect(mockTransaction.update.calledOnceWith(updates)).to.be.true;
    });

    it("should return null when transaction is not found", async () => {
      findByPkStub.resolves(null);

      const result = await TransactionRepository.updateTransaction(1, {});

      expect(result).to.be.null;
      expect(findByPkStub.calledOnce).to.be.true;
      expect(updateStub.called).to.be.false;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      findByPkStub.rejects(error);
      try {
        await TransactionRepository.updateTransaction(1, {});
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(findByPkStub.calledOnce).to.be.true;
      expect(updateStub.called).to.be.false;
    });
  });

  describe("deleteTransaction", () => {
    let findByPkStub;
    let destroyStub;

    beforeEach(() => {
      findByPkStub = sinon.stub(Transaction, "findByPk");
      destroyStub = sinon.stub(Transaction.prototype, "destroy");
    });

    afterEach(() => {
      findByPkStub.restore();
      destroyStub.restore();
    });

    it("should delete transaction based on id", async () => {
      const mockTransaction = {
        id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        date: new Date(),
        destroy: sinon.stub().resolvesThis(),
      };

      findByPkStub.resolves(mockTransaction);

      await TransactionRepository.deleteTransaction(1);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(mockTransaction.destroy.calledOnce).to.be.true;
    });

    it("should return null when transaction is not found", async () => {
      findByPkStub.resolves(null);

      await TransactionRepository.deleteTransaction(1);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(destroyStub.called).to.be.false;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      findByPkStub.rejects(error);
      try {
        await TransactionRepository.deleteTransaction(1);
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(findByPkStub.calledOnce).to.be.true;
      expect(destroyStub.called).to.be.false;
    });
  });

  describe("getSummary", () => {
    let queryStub;

    beforeEach(() => {
      queryStub = sinon.stub(sequelize, "query");
    });

    afterEach(() => {
      queryStub.restore();
    });

    it("should return summary of transactions", async () => {
      const mockSummary = [
        { type: "income", total: 100 },
        { type: "expense", total: 50 },
      ];
      queryStub.resolves(mockSummary);

      const result = await TransactionRepository.getSummary();
      expect(queryStub.calledOnce).to.be.true;
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      queryStub.rejects(error);
      try {
        await TransactionRepository.getSummary();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(queryStub.calledOnce).to.be.true;
    });
  });
});
