// API base URL
const API_BASE_URL = '/api/books';

// DOM elements
const booksContainer = document.getElementById('booksContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const addBookForm = document.getElementById('addBookForm');
const editBookForm = document.getElementById('editBookForm');

let books = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', filterBooks);
    genreFilter.addEventListener('change', filterBooks);
    addBookForm.addEventListener('submit', handleAddBook);
    editBookForm.addEventListener('submit', handleEditBook);
}

async function loadBooks() {
    showLoading(true);
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (data.success) {
            books = data.data;
            renderBooks(books);
        } else {
            booksContainer.innerHTML = '<p class="text-danger">Failed to load books.</p>';
        }
    } catch (error) {
        booksContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
    showLoading(false);
}

function renderBooks(booksToRender) {
    if (booksToRender.length === 0) {
        booksContainer.innerHTML = '<p>No books found.</p>';
        return;
    }
    booksContainer.innerHTML = '';
    booksToRender.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-md-4 mb-3';
        bookCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                    <p class="card-text">${book.description || ''}</p>
                    <p class="card-text"><small class="text-muted">ISBN: ${book.isbn}</small></p>
                    <p class="card-text"><small class="text-muted">Published: ${book.publishedYear || 'N/A'}</small></p>
                    <p class="card-text"><small class="text-muted">Genre: ${book.genre || 'General'}</small></p>
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${book.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
        booksContainer.appendChild(bookCard);
    });
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const genre = genreFilter.value;
    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            (book.genre && book.genre.toLowerCase().includes(searchTerm));
        const matchesGenre = genre === '' || (book.genre && book.genre === genre);
        return matchesSearch && matchesGenre;
    });
    renderBooks(filtered);
}

function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    booksContainer.style.display = show ? 'none' : 'flex';
}

async function handleAddBook(event) {
    event.preventDefault();
    const formData = new FormData(addBookForm);
    const bookData = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        const data = await response.json();
        if (data.success) {
            books.push(data.data);
            renderBooks(books);
            addBookForm.reset();
            const addModal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
            addModal.hide();
        } else {
            alert('Failed to add book: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function openEditModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    editBookForm.elements['id'].value = book.id;
    editBookForm.elements['title'].value = book.title;
    editBookForm.elements['author'].value = book.author;
    editBookForm.elements['isbn'].value = book.isbn;
    editBookForm.elements['description'].value = book.description || '';
    editBookForm.elements['publishedYear'].value = book.publishedYear || '';
    editBookForm.elements['genre'].value = book.genre || 'General';
    const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
    editModal.show();
}

async function handleEditBook(event) {
    event.preventDefault();
    const formData = new FormData(editBookForm);
    const bookId = formData.get('id');
    const bookData = Object.fromEntries(formData.entries());
    delete bookData.id;
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        const data = await response.json();
        if (data.success) {
            const index = books.findIndex(b => b.id == bookId);
            if (index !== -1) {
                books[index] = data.data;
                renderBooks(books);
            }
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editBookModal'));
            editModal.hide();
        } else {
            alert('Failed to update book: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            books = books.filter(b => b.id !== bookId);
            renderBooks(books);
        } else {
            alert('Failed to delete book: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
