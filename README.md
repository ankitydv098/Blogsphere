# 🌐 BlogSphere — Secure Blog REST API

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

**A production-quality Spring Boot REST API for a blogging platform (Medium/Dev.to clone)**

*Designed for Java Backend Developer internship/fresher portfolio*

[📖 API Docs](#-api-documentation) • [🚀 Quick Start](#-quick-start) • [🔐 JWT Flow](#-jwt-authentication-flow) • [🐳 Docker](#-docker-deployment)

</div>

---
https://ankitydv098.github.io/Blogsphere/

## 📌 Project Overview

BlogSphere is a **real-world blogging platform backend** built with production-grade practices. It features complete JWT authentication, role-based access control, full CRUD operations, search with pagination, image uploads, and auto-seeded demo data.

### ✨ Key Features

| Feature | Details |
|---------|---------|
| 🔐 **JWT Authentication** | Stateless auth with BCrypt password hashing |
| 👥 **Role-Based Access** | ROLE_USER & ROLE_ADMIN with fine-grained permissions |
| 📝 **Blog Post CRUD** | Create, read, update, delete with author ownership check |
| 🔍 **Search** | Full-text search across title and content |
| 📄 **Pagination & Sorting** | Professional paginated responses with metadata |
| 🖼️ **Image Upload** | Multipart upload with UUID naming, type validation |
| 💬 **Comments** | Nested comments on blog posts |
| 🌱 **Auto Data Seed** | 1 admin, 5 users, 5 categories, 20 posts, 50 comments |
| 📚 **Swagger UI** | Interactive API documentation at `/swagger-ui.html` |
| 🐳 **Docker Ready** | One-command deploy with docker-compose |
| ✅ **Unit Tests** | JUnit 5 + Mockito tests for all layers |

---

## 🛠️ Tech Stack

```
Backend       : Java 21, Spring Boot 3.3.2
Security      : Spring Security 6, JWT (jjwt 0.12.6)
Database      : MySQL 8, Spring Data JPA, Hibernate
Mapping       : ModelMapper 3.2
Validation    : Jakarta Bean Validation (Hibernate Validator)
Documentation : SpringDoc OpenAPI 3 (Swagger UI)
Testing       : JUnit 5, Mockito, Spring Boot Test
DevOps        : Docker, Docker Compose
Build Tool    : Maven
```

---

## 🏗️ Architecture

```
src/main/java/com/blogsphere/api/
│
├── config/           → SecurityConfig, AppConfig, SwaggerConfig
├── controller/       → AuthController, UserController, PostController,
│                       CategoryController, CommentController
├── dto/
│   ├── request/      → LoginRequest, RegisterRequest, PostRequest, ...
│   └── response/     → AuthResponse, PostResponse, PagedResponse, ...
├── entity/           → User, Role, Post, Category, Comment
├── exception/        → GlobalExceptionHandler, ResourceNotFoundException, ...
├── mapper/           → UserMapper, PostMapper, CategoryMapper, CommentMapper
├── repository/       → JPA Repositories with custom JPQL queries
├── security/         → JwtTokenProvider, JwtAuthenticationFilter, UserDetailsService
├── service/
│   ├── (interfaces)  → AuthService, UserService, PostService, ...
│   └── impl/         → Service Implementations
└── utils/            → AppConstants, DataSeeder
```

---

## 🗄️ Database Schema

```
┌─────────────┐         ┌─────────────┐
│    users    │ 1     * │    posts    │
│─────────────│─────────│─────────────│
│ id (PK)     │         │ id (PK)     │
│ name        │         │ title       │
│ email       │         │ content     │
│ password    │         │ image_name  │
│ created_at  │         │ created_at  │
│ updated_at  │         │ updated_at  │
└─────────────┘         │ user_id(FK) │         ┌──────────────┐
       │                │ cat_id (FK) │─────────│  categories  │
       │ *  ┌────────┐  └─────────────┘         │──────────────│
       └────│ roles  │         │ 1              │ id (PK)      │
            │────────│         │                │ category_name│
            │ id     │         │ *              │ description  │
            │ role   │  ┌─────────────┐         └──────────────┘
            └────────┘  │  comments   │
                        │─────────────│
                        │ id (PK)     │
                        │ content     │
                        │ created_at  │
                        │ post_id(FK) │
                        │ user_id(FK) │
                        └─────────────┘
```

---

## 🔐 JWT Authentication Flow

```
Client                    Server
  │                          │
  │  POST /api/auth/login    │
  │  { email, password }     │
  │─────────────────────────>│
  │                          │  1. Validate credentials
  │                          │  2. Generate JWT (HS256, 24h expiry)
  │                          │
  │  { token, user }         │
  │<─────────────────────────│
  │                          │
  │  GET /api/posts          │
  │  Authorization: Bearer   │
  │  <JWT Token>             │
  │─────────────────────────>│
  │                          │  3. JwtAuthenticationFilter intercepts
  │                          │  4. Validate token signature & expiry
  │                          │  5. Load user from DB by email
  │                          │  6. Set SecurityContext
  │                          │
  │  200 OK { posts }        │
  │<─────────────────────────│
```

---

## 📋 API Documentation

### 🔑 Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login and get JWT |

### 👤 Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/users` | Public | Get all users |
| `GET` | `/api/users/{id}` | Public | Get user by ID |
| `PUT` | `/api/users/{id}` | Auth | Update user |
| `DELETE` | `/api/users/{id}` | Admin | Delete user |

### 📝 Posts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/posts` | Public | Get all posts (paginated) |
| `GET` | `/api/posts/{id}` | Public | Get single post |
| `POST` | `/api/posts` | Auth | Create post |
| `PUT` | `/api/posts/{id}` | Auth (owner/admin) | Update post |
| `DELETE` | `/api/posts/{id}` | Auth (owner/admin) | Delete post |
| `GET` | `/api/users/{id}/posts` | Public | Posts by user |
| `GET` | `/api/categories/{id}/posts` | Public | Posts by category |
| `GET` | `/api/posts/search?keyword=spring` | Public | Search posts |
| `POST` | `/api/posts/{id}/image` | Auth | Upload post image |
| `GET` | `/api/images/{imageName}` | Public | Serve image file |

### 🗂️ Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/categories` | Public | Get all categories |
| `GET` | `/api/categories/{id}` | Public | Get single category |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/{id}` | Admin | Update category |
| `DELETE` | `/api/categories/{id}` | Admin | Delete category |

### 💬 Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/posts/{postId}/comments` | Public | Get post comments |
| `POST` | `/api/posts/{postId}/comments` | Auth | Add comment |
| `DELETE` | `/api/comments/{id}` | Auth (owner/admin) | Delete comment |

### 📄 Pagination Query Parameters
```
GET /api/posts?pageNumber=0&pageSize=10&sortBy=createdAt&sortDir=desc
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 8.0+ (or Docker)

### Option 1: Run with Local MySQL

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/blogsphere-api.git
   cd blogsphere-api
   ```

2. **Create the database:**
   ```sql
   CREATE DATABASE blogsphere_db;
   ```

3. **Configure database credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

5. **Access Swagger UI:** http://localhost:8080/swagger-ui.html

### Option 2: Run with Docker Compose 🐳

```bash
# Start MySQL + Spring Boot API in one command
docker-compose up -d

# View logs
docker-compose logs -f blogsphere-api

# Stop
docker-compose down
```

---

## 🌱 Auto-Seeded Demo Data

When the application starts for the first time, it automatically creates:

| Type | Count | Details |
|------|-------|---------|
| Roles | 2 | ROLE_ADMIN, ROLE_USER |
| Admin | 1 | `admin@blogsphere.com` / `admin@123` |
| Users | 5 | `aarav@blogsphere.com` / `password123` |
| Categories | 5 | Java, Spring Boot, Technology, AI, Programming |
| Posts | 20 | Realistic tech blog posts |
| Comments | 50 | Distributed across posts |

---

## 🧪 Running Tests

```bash
# Run all tests
mvn test

# Run only unit tests
mvn test -Dtest="*ServiceTest"

# Run only repository tests
mvn test -Dtest="*RepositoryTest"

# Run with coverage report
mvn verify jacoco:report
```

---

## 🐳 Docker Deployment

```bash
# Build the Docker image
docker build -t blogsphere-api:latest .

# Run with Docker Compose (recommended)
docker-compose up --build

# API available at: http://localhost:8080
# Swagger UI at:   http://localhost:8080/swagger-ui.html
```

---

## 📁 Project Structure

```
blogsphere-api/
├── src/
│   ├── main/java/com/blogsphere/api/
│   │   ├── config/          # App, Security, Swagger config
│   │   ├── controller/      # REST controllers (5 controllers)
│   │   ├── dto/             # Request & Response DTOs
│   │   │   ├── request/     # 6 request DTOs with validation
│   │   │   └── response/    # 8 response DTOs
│   │   ├── entity/          # 5 JPA entities
│   │   ├── exception/       # Global handler + 3 custom exceptions
│   │   ├── mapper/          # 4 ModelMapper wrappers
│   │   ├── repository/      # 5 Spring Data JPA repositories
│   │   ├── security/        # JWT filter, provider, UserDetailsService
│   │   ├── service/         # 6 interfaces + 6 implementations
│   │   └── utils/           # AppConstants, DataSeeder
│   └── test/                # JUnit 5 tests (service, controller, repo)
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # MySQL + API orchestration
├── pom.xml                  # Maven dependencies
└── README.md
```

---

## 🔒 Security Configuration

```
PUBLIC  → GET /api/posts/**, GET /api/categories/**, GET /api/images/**,
           POST /api/auth/register, POST /api/auth/login, Swagger UI

USER    → POST /api/posts, PUT /api/posts/{id} (own),
           DELETE /api/posts/{id} (own), POST /api/posts/{id}/comments,
           DELETE /api/comments/{id} (own)

ADMIN   → POST /api/categories, PUT /api/categories/{id},
           DELETE /api/categories/{id}, DELETE /api/users/{id},
           DELETE /api/posts/{id} (any)
```

---

## 📸 Screenshots

> **Swagger UI** — http://localhost:8080/swagger-ui.html
>
> After starting the application, visit Swagger UI to explore and test all API endpoints interactively.

---

## 💻 React Frontend Setup

BlogSphere includes a professional, responsive React frontend located inside the `frontend/` directory.

### 🛠️ Frontend Tech Stack
```
Framework    : React 18+ (Vite)
Styling      : Tailwind CSS v4, Lucide Icons
Routing      : React Router DOM v6
Forms        : React Hook Form
HTTP Client  : Axios (with JWT interceptors)
Toast        : React Hot Toast
```

### 📁 Frontend Folder Structure
```
frontend/src/
├── api/             # Axios config + API helpers
├── components/      # Reusable components (Navbar, BlogCard, etc.)
├── context/         # AuthContext for login state
├── pages/           # Home, Login, Register, BlogDetails, Create/Edit, Profile
└── index.css        # Custom styling with Inter typography
```

### 🚀 Running the Frontend

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   A `.env` file is already created:
   ```properties
   VITE_API_URL=http://localhost:8080
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to see the live app!

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ using Java 21 + Spring Boot 3</strong><br>
  <em>Production-quality backend for your developer portfolio</em>
</div>
