import { Book } from "../../models/bookModel.js";
import { Borrower } from "../../models/borrowerModel.js";


export const borrowerReturnBook = async (req, res) => {
    try {
      const { bookId } = req.body;
  
      const book = await Book.findByPk(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (!book.checkedOutBy) {
        return res.status(400).json({ message: "Book is not checked out" });
      }
  
      const borrowerId = book.checkedOutBy;
  
      await book.update({ checkedOutBy: null });
  
      const borrower = await Borrower.findByPk(borrowerId);
      if (borrower) {
        await borrower.removeBook(book);
      }
  
      res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };