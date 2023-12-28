

import { Op } from "sequelize";

import { Book } from "../../models/bookModel.js";

export const listOverdueBooks = async (req, res) => {
    try {
      const today = new Date();
      const overdueBooks = await Book.findAll({
        where: {
          checkedOutBy: { [Op.ne]: null }, // Filter only checked-out books
          dueDate: { [Op.lt]: today }, // Due date is less than today's date (overdue)
        },
        attributes: ["id", "title", "author", "ISBN", "dueDate"], // Fetch specific book attributes
      });
  
      res.status(200).json({ overdueBooks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };