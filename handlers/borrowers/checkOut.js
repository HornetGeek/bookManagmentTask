import { Book } from "../../models/bookModel.js";
import { Borrower } from "../../models/borrowerModel.js";


export const borrowerCheckout = async (req, res) => {
    try {
      const { bookId, borrowerId, dueDate } = req.body;
  
      const book = await Book.findByPk(bookId);
      const borrower = await Borrower.findByPk(borrowerId);
  
      if (!book || !borrower) {
        return res.status(404).json({ message: "Book or borrower not found" });
      }
  
      if (book.checkedOutBy) {
        const borrower = await Borrower.findByPk(book.checkedOutBy);
        console.log(borrower);
        return res
          .status(400)
          .json({ message: `Book already checked out By ${borrower.name}` });
      }
  
      await book.update({ checkedOutBy: borrowerId, dueDate });
  
      await borrower.addBook(book);
  
      res.status(200).json({ message: "Book checked out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };