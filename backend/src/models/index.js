const sequelize = require("../config/db");

const Transaction = require("./Transactions")(sequelize);

const models = {
  sequelize,
  Transaction,
};

module.exports = models;