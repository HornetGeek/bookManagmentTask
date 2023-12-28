import { Op } from "sequelize";

import { Book } from "../../models/bookModel.js";

export const searchBook = async (req, res) => {
  try {
    const { title, author, ISBN } = req.query; // Get the search query from request query params
    console.log("query : ");

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
      where: whereClause,
    });

    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
