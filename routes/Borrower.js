const express = require('express');
const borrowerController = require('../controllers/borrowerController')

const router = express.Router();


router.get('/', borrowerController.listBorrower);

router.post('/',borrowerController.registerBorrower );


// Update a specific borrower by ID
router.put('/:id', borrowerController.updateBorrower);

// Delete a specific borrower by ID
router.delete('/:id', borrowerController.deletedBorrower);

router.post('/checkout',  borrowerController.borrowerCheckout);

router.post('/returnBook',borrowerController.borrowerReturnBook);


router.get('/checkedOutBooks/:id',  borrowerController.borrowercheckedOutBooks);

router.get('/listOverdueBooks',borrowerController.listOverdueBooks);


router.get('/generateBorrowingReport', borrowerController.generateBorrowingReport);


router.get('/exportOverdueBorrowsLastMonth', borrowerController.exportOverdueBorrowsLastMonth);


router.get('/exportBorrowingProcessesLastMonth', borrowerController.exportBorrowingProcessesLastMonth);


module.exports = router;