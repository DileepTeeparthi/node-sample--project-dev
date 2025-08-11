// In-memory storage for books
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        description: "A classic American novel set in the Jazz Age",
        publishedYear: 1925,
        genre: "Fiction"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        description: "A gripping tale of racial injustice and childhood innocence",
        publishedYear: 1960,
        genre: "Fiction"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        description: "A dystopian social science fiction novel",
        publishedYear: 1949,
        genre: "Science Fiction"
    }
];

let nextId = 4;

const getAllBooks = () => {
    return books;
};

const getBookById = (id) => {
    return books.find(book => book.id === id);
};

const createBook = (bookData) => {
    const newBook = {
        id: nextId++,
        ...bookData,
        createdAt: new Date().toISOString()
    };
    books.push(newBook);
    return newBook;
};

const updateBook = (id, updates) => {
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
        return null;
    }
    
    books[bookIndex] = {
        ...books[bookIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    return books[bookIndex];
};

const deleteBook = (id) => {
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
        return false;
    }
    
    books.splice(bookIndex, 1);
    return true;
};

const searchBooks = (query) => {
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre.toLowerCase().includes(lowerQuery)
    );
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
};
