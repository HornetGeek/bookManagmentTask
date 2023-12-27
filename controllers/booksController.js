const Book = require('../models/bookModel')
const { Op } = require('sequelize');


const getAllBooks = async (req, res) => {
    try{
        const books =  await Book.findAll();
        console.log(books)
        res.status(201).json(books);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
   
}

const addBook = async (req,res) => {
    try{
        console.log("inside addbook")
        const newBook = await Book.create({ 
            title: req.body.title, 
            author: req.body.author,
            ISBN:req.body.ISBN,
            availableQuantity: req.body.availableQuantity, 
            shelfLocation: req.body.shelfLocation 
        });
        
        res.status(201).json(newBook);
    }
    catch (error) {
        console.log("wewe")
        res.status(500).json({ message: error.message });
  }
    
}


const editBookById = async (req,res) =>{
    try {
        const bookId = req.params.id; // Assuming the book ID is passed in the URL params

        const updatedBook = await Book.update(
          {
            title: req.body.title,
            author: req.body.author,
            ISBN: req.body.ISBN,
            availableQuantity: req.body.availableQuantity,
            shelfLocation: req.body.shelfLocation,
          },
          { 
            where: { id: bookId } // Update based on the book ID
          }
        );
    
        if (updatedBook[0] === 1) {
          res.status(200).json({ message: 'Book updated successfully' });
        } else {
          res.status(404).json({ message: 'Book not found or no changes made' });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const deleteBookByid = async (req, res) => {
    try {
      const bookId = req.params.id; // Extract the book ID from the URL params
      const deletedBookCount = await Book.destroy({
        where: { id: bookId } // Delete based on the book ID
      });
  
      if (deletedBookCount === 1) {
        res.status(200).json({ message: 'Book deleted successfully' });
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const searchBook = async (req, res) => {
    try {
        const { title, author, ISBN } = req.query; // Get the search query from request query params
        console.log("query : ")

        const whereClause = {};
        if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
        }
        if (author) {
        whereClause.author = { [Op.iLike]: `%${author}%` };
        }
        if (ISBN) {
        whereClause.ISBN = { [Op.iLike]: `%${ISBN}%` };
        }

        const books = await Book.findAll({
        where: whereClause
        });



        if (books.length > 0) {
        res.status(200).json(books);
        } else {
        res.status(404).json({ message: 'No books found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }


module.exports = {getAllBooks, addBook, editBookById, deleteBookByid, searchBook}