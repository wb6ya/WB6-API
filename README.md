# 🚀 Portfolio & Blog Backend API

A production-ready, highly secure RESTful API built with **Express.js** and **MongoDB**. This API is designed to power the core portfolio website, the blog subdomain, and the projects showcase. 

## 🛠️ Tech Stack & Features
- **Node.js & Express.js (v5.0)** - Core server architecture.
- **MongoDB & Mongoose** - Database management with relation mapping.
- **Authentication & Security:**
  - **JWT (JSON Web Tokens)** - Stateless authentication.
  - **Bcryptjs** - Password hashing.
  - **Helmet** - Secure HTTP headers.
  - **CORS** - Cross-origin resource sharing for cross-domain requests.
  - **Express Rate Limit** - Spam and DDoS protection.
- **Zod** - Strict schema validation for all incoming requests.
- **Express-Async-Handler** - Clean error catching without try-catch blocks.

---

## 🚦 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- MongoDB Atlas cluster or local MongoDB server.

### 2. Installation
```bash
git clone https://github.com/wb6ya/WB6-API.git
cd api
npm install
```

### 3. Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
PORT=5500
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGIN=https://your-main-domain.com # Optional: restrict access
```

### 4. Run the Server
```bash
# Development mode with Nodemon
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/register` | Register a new admin user | Public |
| `POST` | `/login` | Authenticate and get JWT token | Public |

### 📝 Blogs (`/api/blog`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET`  | `/` | Retrieve all blogs | Public |
| `GET`  | `/:id` | Retrieve a single blog | Public |
| `POST` | `/` | Create a new blog | **Protected (JWT)** |
| `PUT`  | `/:id` | Update an existing blog | **Protected (Author Only)** |
| `DELETE`| `/:id` | Delete a blog | **Protected (Author Only)** |

### 💼 Projects (`/api/project`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET`  | `/` | Retrieve all projects | Public |
| `GET`  | `/:id` | Retrieve a single project | Public |
| `POST` | `/` | Create a new project | **Protected (JWT)** |
| `PUT`  | `/:id` | Update an existing project | **Protected (JWT)** |
| `DELETE`| `/:id` | Delete a project | **Protected (JWT)** |

---

## 🔒 Security Best Practices Implemented
1. **Rate Limiting:** Users are restricted to 100 requests per 15 minutes to prevent API abuse.
2. **Authorization Middleware:** Critical routes check for valid `Bearer` tokens in headers.
3. **Ownership Validation:** For endpoints like updating/deleting a blog, the API checks if the logged-in user matches the `author` ID.
4. **Data Validation:** Zod enforces strict types and patterns before hitting the database, preventing NoSQL injections and malformed data.
