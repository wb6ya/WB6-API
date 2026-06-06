# Portfolio & Blog API 🚀

A robust, RESTful API built with Express.js and MongoDB to manage blogs and projects for a personal portfolio.

## 🛠️ Tech Stack
- **Node.js & Express.js** - Server architecture & routing
- **MongoDB & Mongoose** - Database & Object Data Modeling
- **Zod** - Strict data validation
- **express-async-handler** - Clean async/await error handling

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5500
   MONGODB_URL=your_mongodb_connection_string_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5500`

## 📡 API Endpoints

### Blog Routes (`/api/blog`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blog` | Retrieve all blogs |
| `GET` | `/api/blog/:id` | Retrieve a single blog by ID |
| `POST` | `/api/blog` | Create a new blog |
| `PUT` | `/api/blog/:id` | Update an existing blog |
| `DELETE`| `/api/blog/:id` | Delete a blog |

## 🛡️ Features
- **Global Error Handling:** All errors are caught and formatted cleanly using a centralized error handler.
- **Data Validation:** Incoming data is validated using Zod before interacting with the database.
- **Path Aliases:** Uses native Node.js subpath imports (`#models`, `#controllers`, etc.) for clean code structure.
