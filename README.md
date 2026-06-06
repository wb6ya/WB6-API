# 🚀 Portfolio & Blog Backend API

A production-ready, highly secure RESTful API built with **Express.js** and **MongoDB**. This API is designed to power the core portfolio website (`wb6ya.com`), the blog subdomain, and the projects showcase. 

Fully optimized for **Serverless Deployment (Vercel)** with a custom `api.wb6ya.com` subdomain configuration.

---

## 🛠️ Tech Stack & Features
- **Node.js & Express.js (v5.0)** - Core server architecture.
- **Serverless Ready:** Exported Express app compatible with Vercel's Node.js runtime.
- **MongoDB & Mongoose** - Database management with relation mapping.
- **Cloudinary & Multer** - Seamless cloud image uploads directly from the API.
- **Authentication, Roles & Security:**
  - **RBAC (Role-Based Access Control):** `admin` and `author` roles.
  - **JWT (JSON Web Tokens)** - Stateless authentication.
  - **Bcryptjs** - Password hashing.
  - **Helmet & CORS** - Secure HTTP headers and Cross-Origin Resource Sharing.
  - **Express Rate Limit** - Spam and DDoS protection.
- **Zod** - Strict schema validation for all incoming requests.

---

## 🚦 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- MongoDB Atlas cluster.
- Cloudinary Account (for image uploads).

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
CORS_ORIGIN=https://your-main-domain.com

# Cloudinary Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Server Locally
```bash
# Development mode with Nodemon
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Authentication & Roles (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/setup-admin` | Seed the first admin account | Public (Once only) |
| `POST` | `/register` | Register a new author/user | **Admin Only** |
| `POST` | `/login` | Authenticate and get JWT token | Public |

### 📝 Blogs (`/api/blog`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET`  | `/` | Retrieve all blogs | Public |
| `GET`  | `/:id` | Retrieve a single blog | Public |
| `POST` | `/` | Create a new blog (supports image upload) | **Protected (JWT)** |
| `PUT`  | `/:id` | Update an existing blog | **Protected (Author Only)** |
| `DELETE`| `/:id` | Delete a blog | **Protected (Admin Only)** |

### 💼 Projects (`/api/project`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET`  | `/` | Retrieve all projects | Public |
| `GET`  | `/:id` | Retrieve a single project | Public |
| `POST` | `/` | Create a new project (supports image upload)| **Protected (JWT)** |
| `PUT`  | `/:id` | Update an existing project | **Protected (JWT)** |
| `DELETE`| `/:id` | Delete a project | **Protected (Admin Only)** |

---

## 🚀 Deployment (Vercel)
This API is specifically tailored to run on Vercel as a serverless function (`vercel.json` included).
1. Connect your GitHub repository to Vercel.
2. Add all the Environment Variables in the Vercel Dashboard.
3. Deploy! Vercel will automatically wrap the `export default app` in `index.js`.
4. Ensure you whitelist Vercel's IP (`0.0.0.0/0`) in your MongoDB Atlas Network Access settings.
