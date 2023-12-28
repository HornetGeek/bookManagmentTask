import { Book } from "../../models/bookModel.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    console.log(books);
    res.status(201).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
