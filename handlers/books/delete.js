import { Book } from "../../models/bookModel.js";

export const deleteBookByid = async (req, res) => {
    try {
      const bookId = req.params.id; // Extract the book ID from the URL params
      const deletedBookCount = await Book.destroy({
        where: { id: bookId }, // Delete based on the book ID
      });
  
      if (deletedBookCount === 1) {
        res.status(200).json({ message: "Book deleted successfully" });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };