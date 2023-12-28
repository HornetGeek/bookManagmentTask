import express from "express";

import {
  listBorrowers,
  registerBorrower,
  updateBorrower,
  deletedBorrower,
  borrowerCheckout,
  borrowerReturnBook,
  listAllBorrowedBooks,
  listOverdueBooks,
  generateBorrowingReport,
  exportLastMonthBorrowed,
  exportLastMonthOverdue,
} from "../handlers/borrowers/index.js";

const router = express.Router();

router.get("/", listBorrowers);

router.post("/", registerBorrower);

// Update a specific borrower by ID
router.put("/:id", updateBorrower);

// Delete a specific borrower by ID
router.delete("/:id", deletedBorrower);

router.post("/checkout", borrowerCheckout);

router.post("/returnBook", borrowerReturnBook);

router.get("/checkedOutBooks/:id", listAllBorrowedBooks);

router.get("/listOverdueBooks", listOverdueBooks);

router.get("/generateBorrowingReport", generateBorrowingReport);

router.get("/exportOverdueBorrowsLastMonth", exportLastMonthOverdue);

router.get("/exportBorrowingProcessesLastMonth", exportLastMonthBorrowed);

export default router;
