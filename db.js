import { Sequelize } from 'sequelize';


const databaseUrl = 'postgres://postgres:password@postgres:5432/book_managment';


export const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres', // Specify the database dialect
  });



export const syncModel = async () => {
    try {
      await sequelize.sync({ force: true }); // Sync the model with the database (you may not want to use force:true in production)
      console.log('Book model synchronized successfully.');
    } catch (error) {
      console.error('Unable to sync the Book model:', error);
    }
  };


