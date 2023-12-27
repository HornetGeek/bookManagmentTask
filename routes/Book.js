const express = require('express');
const booksController = require('../controllers/booksController')
const router = express.Router();


router.get('/', booksController.getAllBooks);

router.post('/', booksController.addBook)

router.put('/:id', booksController.editBookById);

router.delete('/:id', booksController.deleteBookByid);

router.get('/search', booksController.searchBook);


module.exports = router;