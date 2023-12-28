import { Book } from "../../models/bookModel.js";

export const listAllBorrowedBooks = async (req, res) => {
    try {
      const { id } = req.params; // Assuming borrowerId is provided in the URL params
      console.log(id);
  
      const checkedOutBooks = await Book.findAll({
        where: { checkedOutBy: id },
      });
  
      res.status(200).json({ checkedOutBooks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };