const { Transaction } = require("../src/models/index");

seed();

async function seed() {
  // create tables
  await Transaction.sync({ force: true });
  //insert data
  await Promise.all([
    Transaction.create({
      type: "income",
      amount: 5000,
      category: "Salary",
      date: new Date("2025-03-07"),
      description: "Monthly salary credited",
    }),
    Transaction.create({
      type: "expense",
      amount: 1500,
      category: "Rent",
      date: new Date("2025-03-01"),
      description: "Monthly house rent payment",
    }),
    Transaction.create({
      type: "income",
      amount: 200,
      category: "Freelance",
      date: new Date("2025-03-05"),
      description: "Freelance project payment",
    }),
    Transaction.create({
      type: "expense",
      amount: 100,
      category: "Groceries",
      date: new Date("2025-03-06"),
      description: "Weekly grocery shopping",
    }),
    Transaction.create({
      type: "income",
      amount: 300,
      category: "Gift",
      date: new Date("2025-03-04"),
      description: "Birthday gift from a friend",
    }),
  ]);
}
