import { Book } from "../../models/bookModel.js";

export const addBook = async (req, res) => {
    try {
      const newBook = await Book.create({
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        availableQuantity: req.body.availableQuantity,
        shelfLocation: req.body.shelfLocation,
      });
  
      res.status(201).json(newBook);
    } catch (error) {
      console.log("wewe");
      res.status(500).json({ message: error.message });
    }
  };