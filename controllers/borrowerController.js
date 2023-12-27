const { Op } = require('sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Book = require('../models/bookModel');
const Borrower = require('../models/borrowerModel');
const fs = require('fs');
const xlsx = require('xlsx');

const today = new Date()


const registerBorrower = async (req, res) => {
    try {
      const { name, email } = req.body;
  
      const newBorrower = await Borrower.create({ name, email });
  
      res.status(201).json(newBorrower);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const listBorrower = async (req,res)=>{
    try{
        const borrower = await Borrower.findAll()
        console.log(borrower)
        res.status(201).json(borrower);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
}

const updateBorrower = async (req, res) => {
    try {
      const borrowerId = req.params.id; // Extract borrower ID from the URL params
  
      const updatedBorrower = await Borrower.update(
        {
          name: req.body.name,
          email: req.body.email,
          // Other fields you want to update...
        },
        {
          where: { id: borrowerId }, // Update based on the borrower ID
          returning: true, // Ensure Sequelize returns the updated record
        }
      );
  
      if (updatedBorrower[0] === 1) {
        res.status(200).json({ message: 'Borrower updated successfully' });
      } else {
        res.status(404).json({ message: 'Borrower not found or no changes made' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const deletedBorrower = async (req, res) => {
    try {
      const borrowerId = req.params.id; // Extract borrower ID from the URL params
  
      const deletedBorrowerCount = await Borrower.destroy({
        where: { id: borrowerId }, // Delete based on the borrower ID
      });
  
      if (deletedBorrowerCount === 1) {
        res.status(200).json({ message: 'Borrower deleted successfully' });
      } else {
        res.status(404).json({ message: 'Borrower not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


const borrowerCheckout = async (req, res) => {
    try {
      const { bookId, borrowerId,dueDate } = req.body;
  
      const book = await Book.findByPk(bookId);
      const borrower = await Borrower.findByPk(borrowerId);
  
      if (!book || !borrower) {
        return res.status(404).json({ message: 'Book or borrower not found' });
      }
  
      if (book.checkedOutBy) {

        const borrower = await Borrower.findByPk(book.checkedOutBy)
        console.log(borrower)
        return res.status(400).json({ message: `Book already checked out By ${borrower.name}` });
      }
  
      await book.update({ checkedOutBy: borrowerId, dueDate });
  
      await borrower.addBook(book);
  
      res.status(200).json({ message: 'Book checked out successfully' });
    } catch (error) {

      res.status(500).json({ message: error.message });
    }
  }

const borrowerReturnBook =  async (req, res) => {
    try {
      const { bookId } = req.body;

      const book = await Book.findByPk(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (!book.checkedOutBy) {
        return res.status(400).json({ message: 'Book is not checked out' });
      }
  
      const borrowerId = book.checkedOutBy;
  
      await book.update({ checkedOutBy: null });
  
      const borrower = await Borrower.findByPk(borrowerId);
      if (borrower) {
        await borrower.removeBook(book);
      }
  
      res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const borrowercheckedOutBooks = async (req, res) => {
    try {
        const { id } = req.params; // Assuming borrowerId is provided in the URL params
        console.log(id)

        const checkedOutBooks = await Book.findAll({
            where: { checkedOutBy: id },
        });

        res.status(200).json({ checkedOutBooks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const listOverdueBooks = async (req, res) => {
    try {
      const overdueBooks = await Book.findAll({
        where: {
          checkedOutBy: { [Op.ne]: null }, // Filter only checked-out books
          dueDate: { [Op.lt]: today }, // Due date is less than today's date (overdue)
        },
        attributes: ['id', 'title', 'author', 'ISBN', 'dueDate'], // Fetch specific book attributes
      });
  
      res.status(200).json({ overdueBooks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


const generateBorrowingReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Start and end dates for the period
  
      const borrowingData = await Book.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate], // Filter books created within the period
          },
        },
        include: [{
          model: Borrower,
          attributes: ['id', 'name', 'email'],
        }],
        order: [['createdAt', 'DESC']], // Order by creation date in descending order
      });
      console.log("borrowing data")
      
      const x = borrowingData.map(book => ({
        'Book ID': book.id,
        'Book Title': book.title,
        'Author': book.author,
        'ISBN': book.ISBN,
        'Due Date': book.dueDate,
        'Borrower ID': book.Borrower.id,
        'Borrower Name': book.Borrower.name,
        'Borrower Email': book.Borrower.email,
      }))
      console.log(x)
      
      // Export data to CSV file
      const csvWriter = createCsvWriter({
        path: 'borrowing_report.csv',
        header: [
          { id: 'id', title: 'Book ID' },
          { id: 'title', title: 'Book Title' },
          { id: 'author', title: 'Author' },
          { id: 'ISBN', title: 'ISBN' },
          { id: 'dueDate', title: 'Due Date' },
          { id: 'BorrowerId', title: 'Borrower ID' },
          { id: 'BorrowerName', title: 'Borrower Name' },
          { id: 'BorrowerEmail', title: 'Borrower Email' },
        ]
      });
  
      await csvWriter.writeRecords(borrowingData.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        dueDate: book.dueDate,
        BorrowerId: book.Borrower.id,
        BorrowerName: book.Borrower.name,
        BorrowerEmail: book.Borrower.email,
        
      })));
  
      // Export data to Xlsx file
      const ws = xlsx.utils.json_to_sheet(borrowingData.map(book => ({
        'Book ID': book.id,
        'Book Title': book.title,
        'Author': book.author,
        'ISBN': book.ISBN,
        'Due Date': book.dueDate,
        'Borrower ID': book.Borrower.id,
        'Borrower Name': book.Borrower.name,
        'Borrower Email': book.Borrower.email,
      })));
  
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Borrowing Report');
      xlsx.writeFile(wb, 'borrowing_report.xlsx');
  
      res.status(200).json({ message: 'Borrowing report generated and exported successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
const exportOverdueBorrowsLastMonth = async (req, res) => {
    try {
      const currentDate = new Date();
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1); // Calculate last month's date
        
      console.log(lastMonthDate)
      const overdueBorrows = await Book.findAll({
        where: {
          checkedOutBy: { [Op.ne]: null }, // Filter only checked-out books
          dueDate: { [Op.lt]: currentDate, [Op.gt]: lastMonthDate }, // Due date within last month and earlier than current date
        },
        include: [{
          model: Borrower,
          attributes: ['id', 'name', 'email'],
        }],
      });
  
      // Export data to CSV file
      const csvWriter = createCsvWriter({
        path: 'overdue_borrows_last_month.csv',
        header: [
          { id: 'id', title: 'Book ID' },
          { id: 'title', title: 'Book Title' },
          { id: 'author', title: 'Author' },
          { id: 'ISBN', title: 'ISBN' },
          { id: 'dueDate', title: 'Due Date' },
          { id: 'BorrowerId', title: 'Borrower ID' },
          { id: 'BorrowerName', title: 'Borrower Name' },
          { id: 'BorrowerEmail', title: 'Borrower Email' },
        ]
      });
  
      await csvWriter.writeRecords(overdueBorrows.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        dueDate: book.dueDate,
        BorrowerId: book.Borrower.id,
        BorrowerName: book.Borrower.name,
        BorrowerEmail: book.Borrower.email,
        
      })));
  
      // Export data to Xlsx file
      const ws = xlsx.utils.json_to_sheet(overdueBorrows.map(book => ({
        'Book ID': book.id,
        'Book Title': book.title,
        'Author': book.author,
        'ISBN': book.ISBN,
        'Due Date': book.dueDate,
        'Borrower ID': book.Borrower.id,
        'Borrower Name': book.Borrower.name,
        'Borrower Email': book.Borrower.email,
      })));
  
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Overdue Borrows Last Month');
      xlsx.writeFile(wb, 'overdue_borrows_last_month.xlsx');
  
      res.status(200).json({ message: 'Overdue borrows of last month exported successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


const exportBorrowingProcessesLastMonth= async (req, res) => {
    try {
      const currentDate = new Date();
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1); // Calculate last month's date
  
      const borrowingData = await Book.findAll({
        where: {
          createdAt: { [Op.between]: [lastMonthDate, currentDate] }, // Borrowing processes within last month
        },
        include: [{
          model: Borrower,
          attributes: ['id', 'name', 'email'],
        }],
        order: [['createdAt', 'DESC']], // Order by creation date in descending order
      });
  
      // Export data to CSV file
      const csvWriter = createCsvWriter({
        path: 'borrowing_processes_last_month.csv',
        header: [
          { id: 'id', title: 'Book ID' },
          { id: 'title', title: 'Book Title' },
          { id: 'author', title: 'Author' },
          { id: 'ISBN', title: 'ISBN' },
          { id: 'dueDate', title: 'Due Date' },
          { id: 'BorrowerId', title: 'Borrower ID' },
          { id: 'BorrowerName', title: 'Borrower Name' },
          { id: 'BorrowerEmail', title: 'Borrower Email' },
        ]
      });
  
      await csvWriter.writeRecords(borrowingData.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        dueDate: book.dueDate,
        BorrowerId: book.Borrower.id,
        BorrowerName: book.Borrower.name,
        BorrowerEmail: book.Borrower.email,
        
      })));
  
      // Export data to Xlsx file
      const ws = xlsx.utils.json_to_sheet(borrowingData.map(book => ({
        'Book ID': book.id,
        'Book Title': book.title,
        'Author': book.author,
        'ISBN': book.ISBN,
        'Due Date': book.dueDate,
        'Borrower ID': book.Borrower.id,
        'Borrower Name': book.Borrower.name,
        'Borrower Email': book.Borrower.email,
      })));
  
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Borrowing Processes Last Month');
      xlsx.writeFile(wb, 'borrowing_processes_last_month.xlsx');
  
      res.status(200).json({ message: 'Borrowing processes of last month exported successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

module.exports = {registerBorrower, listBorrower, updateBorrower,deletedBorrower, borrowerCheckout , borrowerReturnBook,
    borrowercheckedOutBooks,listOverdueBooks, generateBorrowingReport ,exportOverdueBorrowsLastMonth, exportBorrowingProcessesLastMonth}