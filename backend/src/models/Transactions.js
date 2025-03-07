const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    class Transaction extends Sequelize.Model {}
	Transaction.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: Sequelize.ENUM('income', 'expense'),
            allowNull: false
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: { min: 0 }
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            defaultValue: ''
        }
    },{
        sequelize,
        modelName: "Transaction",
      });

    return Transaction;
};