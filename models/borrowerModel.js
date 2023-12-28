import { DataTypes } from "sequelize";

import { sequelize } from "../db.js";
import { Book } from "./bookModel.js";

export const Borrower = sequelize.define("Borrower", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  registeredDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Synchronize the model with the database (if needed)
(async () => {
  try {
    await sequelize.sync({ force: true }); // Force sync here is just an example, use it carefully in production
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
})();

Borrower.hasMany(Book);
Book.belongsTo(Borrower);
