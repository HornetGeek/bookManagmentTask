import { Borrower } from "../../models/borrowerModel.js";




export const updateBorrower = async (req, res) => {
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
        res.status(200).json({ message: "Borrower updated successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Borrower not found or no changes made" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };