const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

// GET all books
router.get('/', booksController.getAllBooks);

// GET a single book by ID
router.get('/:id', booksController.getBookById);

// POST a new book
router.post('/', booksController.createBook);

// PUT update a book
router.put('/:id', booksController.updateBook);

// DELETE a book
router.delete('/:id', booksController.deleteBook);

module.exports = router;
