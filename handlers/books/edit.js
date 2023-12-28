import { Book } from "../../models/bookModel.js";

export const editBookById = async (req, res) => {
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
          where: { id: bookId }, // Update based on the book ID
        }
      );
  
      if (updatedBook[0] === 1) {
        res.status(200).json({ message: "Book updated successfully" });
      } else {
        res.status(404).json({ message: "Book not found or no changes made" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };