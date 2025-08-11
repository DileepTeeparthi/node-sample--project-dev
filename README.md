# Online Books API

A simple Node.js REST API for managing online books with CRUD operations.

## Features

- ✅ RESTful API endpoints for books
- ✅ In-memory data storage
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search functionality
- ✅ Error handling
- ✅ Input validation

## Project Structure

```
online-books-api/
├── package.json
├── server.js
├── README.md
├── routes/
│   └── books.js
├── controllers/
│   └── booksController.js
└── services/
    └── booksService.js
```

## Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
`http://localhost:3000/api/books`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| GET | `/:id` | Get book by ID |
| POST | `/` | Create new book |
| PUT | `/:id` | Update book |
| DELETE | `/:id` | Delete book |

### Example Requests

#### Get all books
```bash
curl http://localhost:3000/api/books
```

#### Get book by ID
```bash
curl http://localhost:3000/api/books/1
```

#### Create new book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "isbn": "123-456-789",
    "description": "Book description",
    "publishedYear": 2023,
    "genre": "Technology"
  }'
```

#### Update book
```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Book Title"
  }'
```

#### Delete book
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

## Book Schema

```json
{
  "id": 1,
  "title": "string",
  "author": "string",
  "isbn": "string",
  "description": "string",
  "publishedYear": 2023,
  "genre": "string"
}
```

## Sample Data

The API comes with 3 sample books:
- The Great Gatsby
- To Kill a Mockingbird
- 1984

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Technologies Used

- Node.js
- Express.js
- CORS
- Body Parser
