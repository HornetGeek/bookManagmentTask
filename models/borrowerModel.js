const { DataTypes } = require('sequelize');
const {sequelize,syncModel} = require('../db');


const Book = require('./bookModel');


const Borrower = sequelize.define('Borrower', {
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


//syncModel();
Borrower.hasMany(Book);
Book.belongsTo(Borrower);


module.exports = Borrower;