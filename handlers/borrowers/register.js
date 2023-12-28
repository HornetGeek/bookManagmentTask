import { Borrower } from "../../models/borrowerModel.js";

export const registerBorrower = async (req, res) => {
    try {
      const { name, email } = req.body;
  
      const newBorrower = await Borrower.create({ name, email });
  
      res.status(201).json(newBorrower);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };