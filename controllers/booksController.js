const booksService = require('../services/booksService');

const getAllBooks = (req, res) => {
    try {
        const books = booksService.getAllBooks();
        res.json({
            success: true,
            data: books,
            count: books.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getBookById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const book = booksService.getBookById(id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const createBook = (req, res) => {
    try {
        const { title, author, isbn, description, publishedYear, genre } = req.body;
        
        if (!title || !author || !isbn) {
            return res.status(400).json({
                success: false,
                error: 'Title, author, and ISBN are required'
            });
        }
        
        const newBook = booksService.createBook({
            title,
            author,
            isbn,
            description: description || '',
            publishedYear: publishedYear || null,
            genre: genre || 'General'
        });
        
        res.status(201).json({
            success: true,
            data: newBook,
            message: 'Book created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateBook = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        
        const updatedBook = booksService.updateBook(id, updates);
        
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            data: updatedBook,
            message: 'Book updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteBook = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = booksService.deleteBook(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
