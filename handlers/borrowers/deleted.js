import { Borrower } from "../../models/borrowerModel.js";


export const deletedBorrower = async (req, res) => {
    try {
      const borrowerId = req.params.id; // Extract borrower ID from the URL params
  
      const deletedBorrowerCount = await Borrower.destroy({
        where: { id: borrowerId }, // Delete based on the borrower ID
      });
  
      if (deletedBorrowerCount === 1) {
        res.status(200).json({ message: "Borrower deleted successfully" });
      } else {
        res.status(404).json({ message: "Borrower not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };