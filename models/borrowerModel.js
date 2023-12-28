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

Borrower.hasMany(Book);
Book.belongsTo(Borrower);
