import { DataTypes } from "sequelize";

import { sequelize } from "../db.js";

export const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shelfLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkedOutBy: {
      type: DataTypes.INTEGER, // Assuming it stores the Borrower's ID
      allowNull: true,
    },

    dueDate: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["title", "author", "ISBN."], // Creating an index on the 'title, author, ISBN' field
      },
    ],
  }
);
