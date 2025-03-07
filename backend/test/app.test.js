const request = require("supertest");
const app = require("../src/app");
const chai = require("chai");

const { expect } = chai;

describe("app", () => {
  describe("GET /transactions", () => {
    it("should return transactions based on type, from, to, and category", async () => {
      const response = await request(app).get("/transactions");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });

  describe("GET /transactions/:id", () => {
    it("should return a transaction based on id", async () => {
      const response = await request(app).get("/transactions/1");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
    });
  });

  describe("POST /transactions", () => {
    it("should create a new transaction", async () => {
      const response = await request(app).post("/transactions").send({
        amount: 100,
        type: "income",
        category: "salary",
        description: "March salary",
        date: new Date(),
      });

      expect(response.status).to.equal(201);
      expect(response.body).to.be.an("object");
    });
  });
});
