import { Op } from "sequelize";
import xlsx from "xlsx";
import createCsvWriter from "csv-writer";

import { Book } from "../../models/bookModel.js";
import { Borrower } from "../../models/borrowerModel.js";


export const exportLastMonthOverdue = async (req, res) => {
    try {
      const currentDate = new Date();
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1); // Calculate last month's date
  
      console.log(lastMonthDate);
      const overdueBorrows = await Book.findAll({
        where: {
          checkedOutBy: { [Op.ne]: null }, // Filter only checked-out books
          dueDate: { [Op.lt]: currentDate, [Op.gt]: lastMonthDate }, // Due date within last month and earlier than current date
        },
        include: [
          {
            model: Borrower,
            attributes: ["id", "name", "email"],
          },
        ],
      });
  
      // Export data to CSV file
      const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: "overdue_borrows_last_month.csv",
        header: [
          { id: "id", title: "Book ID" },
          { id: "title", title: "Book Title" },
          { id: "author", title: "Author" },
          { id: "ISBN", title: "ISBN" },
          { id: "dueDate", title: "Due Date" },
          { id: "BorrowerId", title: "Borrower ID" },
          { id: "BorrowerName", title: "Borrower Name" },
          { id: "BorrowerEmail", title: "Borrower Email" },
        ],
      });
  
      await csvWriter.writeRecords(
        overdueBorrows.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          ISBN: book.ISBN,
          dueDate: book.dueDate,
          BorrowerId: book.Borrower.id,
          BorrowerName: book.Borrower.name,
          BorrowerEmail: book.Borrower.email,
        }))
      );
  
      // Export data to Xlsx file
      const ws = xlsx.utils.json_to_sheet(
        overdueBorrows.map((book) => ({
          "Book ID": book.id,
          "Book Title": book.title,
          Author: book.author,
          ISBN: book.ISBN,
          "Due Date": book.dueDate,
          "Borrower ID": book.Borrower.id,
          "Borrower Name": book.Borrower.name,
          "Borrower Email": book.Borrower.email,
        }))
      );
  
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Overdue Borrows Last Month");
      xlsx.writeFile(wb, "overdue_borrows_last_month.xlsx");
  
      res
        .status(200)
        .json({ message: "Overdue borrows of last month exported successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  