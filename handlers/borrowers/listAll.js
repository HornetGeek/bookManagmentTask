import { Borrower } from "../../models/borrowerModel.js";

export const listBorrowers = async (req, res) => {
    try {
      const borrower = await Borrower.findAll();
      console.log(borrower);
      res.status(201).json(borrower);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };