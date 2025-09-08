# Social Media API

A secure, production-ready Node.js + Express REST API backend for a social media platform with comprehensive features including JWT authentication, user profiles, social following, posts with media support, interactions, personalized feeds, and analytics.

## 🚀 Features

- **RESTful API Design**: Clean, consistent API endpoints following REST principles
- **JWT Authentication**: Secure token-based authentication system
- **User Management**: Profile CRUD operations with avatar uploads
- **Social Graph**: Follow/unfollow system with atomic counter updates
- **Content Management**: Post creation, editing, deletion with image support
- **Engagement Features**: Like/unlike posts and threaded comment system
- **Personalized Feeds**: Algorithm-based content delivery for users
- **Analytics Engine**: User activity and content performance metrics
- **Admin Dashboard APIs**: Content moderation and user management endpoints
- **File Upload System**: Secure image handling with cloud storage support
- **Search Functionality**: Full-text search across users and posts
- **Rate Limiting**: API protection against abuse and spam

## Table of Contents | Quick Access

- [Installation](#installation)  
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)  
- [Modules & Development Order](#modules--development-order)  
- [Team module assignments](#team-module-assignments)  


---

## Installation

### Prerequisites

- Node.js 
- MongoDB 
- npm (package manager)
- Postman (for testing APIs)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Okashanadeem/Social-Media-API.git
   cd Social-Media-API
  ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the API server**

   ```bash
   # Development mode with auto-reload
   npm run dev
   ```

4. **Import Postman Collection (Optional, for testing APIs)**

   * For **local testing**, import:

     ```
     postman-collection/local_socialMedia-api.postman_collection.json
     ```

---

## API Documentation

### Base URLs


Local Development: [http://localhost:5000/api](http://localhost:5000/api)
Production (Render): [https://social-media-api-zruf.onrender.com/api](https://social-media-api-zruf.onrender.com/api)



### Response Format

All API responses follow a consistent format:


**Success Response:**

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
  }
}
```


## 1. **Auth APIs**

| Method | Endpoint             | Description                             | Request Body                          | Response                                   |
| ------ | -------------------- | --------------------------------------- | ------------------------------------- | ------------------------------------------ |
| `POST` | `/api/auth/register` | Register a new user                     | `{ name, username, email, password }` | `{ message, user: {id, username, email} }` |
| `POST` | `/api/auth/login`    | Login with credentials                  | `{ email, password }`                 | `{ token, user: {id, username, email} }`   |
| `POST` | `/api/auth/logout`   | Logout user (client just deletes token) | -                                     | `{ message: "Logged out" }`                |

---

## 2. **User APIs**

| Method | Endpoint                        | Description                     | Request Body                               | Response                                                                   |
| ------ | ------------------------------- | ------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `GET`  | `/api/users/me`                 | Get own profile (auth required) | -                                          | `{ id, username, bio, followersCount, followingCount, avatarUrl }`         |
| `PUT`  | `/api/users/me`                 | Update profile                  | `{ username?, bio?, avatar? } (multipart)` | `{ message, updatedUser }`                                                 |
| `GET`  | `/api/users/:username`          | View public profile             | -                                          | `{ username, bio, followersCount, followingCount, avatarUrl, postsCount }` |
| `POST` | `/api/users/:username/follow`   | Follow a user                   | -                                          | `{ message, followersCount, followingCount }`                              |
| `POST` | `/api/users/:username/unfollow` | Unfollow a user                 | -                                          | `{ message, followersCount, followingCount }`                              |

---

## 3. **Post APIs**

| Method   | Endpoint                    | Description           | Request Body                   | Response                                                       |
| -------- | --------------------------- | --------------------- | ------------------------------ | -------------------------------------------------------------- |
| `POST`   | `/api/posts`                | Create a new post     | `{ text, image? } (multipart)` | `{ id, text, imageUrl, createdAt }`                            |
| `GET`    | `/api/posts/:id`            | Get a single post     | -                              | `{ id, text, imageUrl, likesCount, commentsCount, createdBy }` |
| `PUT`    | `/api/posts/:id`            | Update own post       | `{ text?, image? }`            | `{ message, updatedPost }`                                     |
| `DELETE` | `/api/posts/:id`            | Delete own post       | -                              | `{ message: "Post deleted" }`                                  |
| `GET`    | `/api/posts/user/:username` | Get all posts by user | -                              | `[ { post1 }, { post2 } ... ]`                                 |

---

## 4. **Feed APIs**

| Method | Endpoint    | Description                | Query Params          | Response                                   |
| ------ | ----------- | -------------------------- | --------------------- | ------------------------------------------ |
| `GET`  | `/api/feed` | Get feed of followed users | `?page=&limit=&sort=` | `[ { post, likedByUser, commentsCount } ]` |

---

## 5. **Like APIs**

| Method | Endpoint              | Description                    | Request Body | Response                  |
| ------ | --------------------- | ------------------------------ | ------------ | ------------------------- |
| `POST` | `/api/posts/:id/like` | Like or unlike a post (toggle) | -            | `{ message, likesCount }` |

---

## 6. **Comment APIs**

| Method   | Endpoint                            | Description                   | Request Body    | Response                                           |
| -------- | ----------------------------------- | ----------------------------- | --------------- | -------------------------------------------------- |
| `POST`   | `/api/posts/:id/comments`           | Add a comment to a post       | `{ text }`      | `{ id, text, createdBy, createdAt }`               |
| `GET`    | `/api/posts/:id/comments`           | Get comments for a post       | `?page=&limit=` | `{ page, pageSize, totalComments, comments[] }`    |
| `PUT`    | `/api/posts/:id/comments/:commentId`| Update a comment (owner/admin)| `{ text }`      | `{ message: "Comment updated successfully", comment }` |
| `DELETE` | `/api/posts/:id/comments/:commentId`| Delete a comment (owner/admin)| –               | `{ message: "Comment deleted successfully" }`      |
| `GET`    | `/api/posts/comments`               | Get all comments by user      | `?page=&limit=` | `{ page, pageSize, totalComments, allComments[] }` |

---

## 7. **Admin APIs**

| Method   | Endpoint                      | Description                              | Query Params      | Response                                                             |
| -------- | ----------------------------- | ---------------------------------------- | ----------------- | -------------------------------------------------------------------- |
| `GET`    | `/api/admin/users`            | Get all users (paginated)                | `?page=&limit=`   | `{ success, totalUsers, page, pageSize, users[] }`                   |
| `DELETE` | `/api/admin/users/:username`  | Delete a user (and their posts/comments) | –                 | `{ success, message: "User and related content deleted", name }`      |
| `DELETE` | `/api/admin/posts/:id`        | Delete a post (and its comments)         | –                 | `{ success, message: "Post and comments deleted", id }`               |
| `GET`    | `/api/admin/stats`            | Get total counts                         | –                 | `{ success, stats: { totalUsers, totalPosts, totalComments } }`       |
| `GET`    | `/api/admin/stats/active-users` | Get most active users by post count     | `?days=7&limit=5` | `{ success, activeUsers: [ { userId, username, postCount } ] }`       |
| `GET`    | `/api/admin/dashboard`        | Admin dashboard welcome message           | –                 | `{ success, message: "Welcome, adminUsername" }`                      |

---

## 8. **Optional APIs (If Time Allows) DONE!!!!**

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| `GET`  | `/api/search?query=` | Full-text search in users |

---

## Project Structure

```
Social-Media-API/
│
├── controllers/                       # Handle business logic for each feature
│   ├── authController.js              # Signup, login, logout, token handling
│   ├── userController.js              # Profile, update, delete, user details
│   ├── postController.js              # CRUD operations for posts
│   ├── feedController.js              # Newsfeed (fetch posts from followed users)
│   ├── followController.js            # Follow/unfollow users
│   ├── adminController.js             # Admin-only actions (suspend, manage users)
│   └── statsController.js             # Analytics (top posts, active users)
│
├── validators/                        # Request body validation (Joi/Yup)
│   ├── commentValidator.js            # Validation rules for comments
│   └── postValidator.js               # Validation rules for posts
│
├── models/                            # MongoDB schemas (Mongoose models)
│   ├── userModel.js                   # User schema (auth, profile, role)
│   ├── postModel.js                   # Post schema (likes, comments, media)
│   └── commentModel.js                # Comment schema (text, user, post ref)
│
├── routes/                            # API endpoints mapping to controllers
│   ├── authRoutes.js                  # /api/auth → login/register
│   ├── userRoutes.js                  # /api/users → user-related endpoints
│   ├── postRoutes.js                  # /api/posts → CRUD posts
│   ├── statsRoutes.js                 # /api/stats → analytics endpoints
│   ├── followRoutes.js                # /api/follow → follow/unfollow users
│   ├── feedRoutes.js                  # /api/feed → fetch timeline posts
│   └── adminRoutes.js                 # /api/admin → admin-only APIs
│
├── middlewares/                       # Reusable Express middlewares
│   ├── authMiddleware.js              # Check JWT, attach user to request
│   ├── requireRole.js                 # Restrict access by role (admin/user)
│   ├── responseMiddleware.js          # Standardized API response format
│   ├── upload.js                      # File upload (Multer config)
│   ├── validate.js                    # Validate requests against schemas
│   └── errorMiddleware.js             # Global error handler
│
├── config/
│   └── db.js                          # MongoDB connection setup
│
├── postman-collection/
│   └── socialMedia-api.postman_collection.json  # Prebuilt Postman tests
│
├── uploads/                           # Stores uploaded profile images/posts
│
├── utils/
│   └── seed.js                        # Seed database with test data
│
├── .env                               # Environment variables (DB, JWT secret)
├── .gitignore                         # Ignore node_modules, .env, etc.
├── personal.txt                       # Personal notes (ignored in git)
├── package.json                       # Dependencies + scripts
├── README.md                          # Project documentation
└── index.js                           # Main entry (Express app & routes)
```

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Seed database with sample data
node utils/seed.js
```


### Build Order & Implementation Phases

1. **Phase 0**: Project scaffolding, configuration, logging setup
2. **Phase 1**: Authentication system (register, login, JWT middleware)
3. **Phase 2**: User management (profiles, CRUD operations)
4. **Phase 3**: File upload system (avatar and post images)
5. **Phase 4**: Social features (follow/unfollow system)
6. **Phase 5**: Posts system (CRUD operations)
7. **Phase 6**: Interactions (likes and comments)
8. **Phase 7**: Feed generation and pagination
9. **Phase 8**: Search and analytics
10. **Phase 9**: Admin features and moderation
11. **Phase 10**: Testing, documentation, deployment

---

# Modules & Development Order

To ensure smooth progress, we divide the project into **independent modules**. Each module builds on the previous one, so the team can work in parallel once the base is ready.

---

## **1. Core Setup & Config (Module 1)**

**Priority:** 🔴 First

* Project structure (`src/`, `controllers/`, `routes/`, etc.).
* Express server setup.
* MongoDB connection (`config/db.js`).
* Environment variables (`.env` for PORT, DB\_URL, JWT\_SECRET).
* Global error handler + response format middleware.

👉 This is the **foundation** — must be built before other modules.

---

## **2. Authentication & User Management (Module 2)**

**Priority:** 🔴 Second

* User registration & login (`/auth/register`, `/auth/login`).
* JWT token generation & middleware.
* User profile CRUD (`/users/:id`).
* Password hashing (bcrypt).

👉 Critical for securing all future modules. Nothing else works without **users + login system**.

---

## **3. Posts & Content System (Module 3)**

**Priority:** 🟠 Third

* Create, read, update, delete posts (`/posts`).
* Image/file upload support (Multer).
* Link posts with `userId`.

👉 Once auth is ready, users should be able to **post content**.

---

## **4. Social Interactions (Likes & Comments) (Module 4)**

**Priority:** 🟠 Fourth

* Like/unlike posts (`/posts/:id/like`).
* Comment CRUD (`/posts/:id/comments`).

---

## **5. Feed & Follows (Module 5)**

**Priority:** 🟢 Fifth

* Follow/unfollow users (`/users/:id/follow`).
* Personalized feed (posts only from followed users).

👉 This turns the app from “just posting” → **social media experience**.

---

## **6. Search & Analytics (Module 6)**

**Priority:** 🟢 Sixth

* Search users by name/username.
* Search posts by text.
* Analytics endpoints:

  * Most liked posts.
  * Most active users.
  * Daily/weekly post count.

---

## **7. Admin Panel & Moderation (Module 7)**

**Priority:** 🟢 Seventh (Optional / Advanced)

* Suspend/unsuspend users.
* Delete any post or comment.
* View system-wide analytics.

👉 Only required if time permits, but makes the project **look professional**.

---

# Team module assignments

Below is a clear, final module division for the three team members. Branch names, PR titles, exact tasks, files to change, and acceptance criteria are included — ready to paste.

---

## **Okasha Nadeem**

**Branch:** `feature/global-middleware-setup`,`feature/admin-stats-apis`
**PR title:** `scaffolding, middlewares, admin basics`

**Main tasks**

* Project scaffolding & config

  * `app.js`, `server.js`, `config/db.js`, `.env.example`, `package.json` scripts
* Global middleware

  * `middlewares/error.middleware.js`, `middlewares/response.middleware.js`
* User endpoints (read/update)

  * `controllers/users.controller.js`, `routes/users.routes.js`, `validators/user.validator.js` → `GET /api/users/me`, `PUT /api/users/me`
* File upload (avatars)

  * `uploads/multer.js`, `middlewares/multer.middleware.js`
* Admin skeleton (role-guarded)

  * `controllers/admin.controller.js`, `routes/admin.routes.js`, `middlewares/role.middleware.js`

**Acceptance**

* `npm run dev` boots and connects to DB.
* Protected routes enforce JWT.
* Avatar upload writes `avatarUrl`.
* Admin endpoints return expected format and require admin role.

**Module link:**

* [Module 1 — Core Setup & Config](#1-core-setup--config-module-1)
* [Module 7 — Admin Panel & Moderation](#7-admin-panel--moderation-module-7) (skeleton only)

---

## **Sheryaar Ansar**

**Branch:** `Post-Feed-Comments-module`
**PR title:** `feat(posts+interactions): posts CRUD, feed, likes & comments`

**Main tasks**

* Posts CRUD & images

  * `controllers/posts.controller.js`, `routes/posts.routes.js`, `models/post.model.js`, `validators/post.validator.js`
* Likes & comments

  * `models/like.model.js`, `models/comment.model.js`, controllers for toggle-like and comments
* Feed & follow

  * `controllers/feed.controller.js`, `routes/feed.routes.js`, `models/follow.model.js`, `users.controller.js` updates
* Edge cases & permissions

  * double-like, soft-delete comments, author/admin permission checks

**Acceptance**

* Posts CRUD works with uploads.
* Counts (`likesCount`, `commentsCount`) remain consistent.
* Feed returns followed-users’ posts with pagination and `likedByUser`.
* Like/comment edge cases handled.

**Module link:**

* [Module 3 — Posts & Content System](#3-posts--content-system-module-3)
* [Module 4 — Social Interactions (Likes & Comments)](#4-social-interactions-likes--comments-module-4)
* [Module 5 — Feed & Follows](#5-feed--follows-module-5)

---

## **Umair**

**Branch:** `feature/auth-support-umair`
**PR title:** `feat(auth): register, login, jwt, auth-middleware`

**Main tasks**

* Authentication & user core (owner)

  * `controllers/auth.controller.js`, `routes/auth.routes.js`, `models/user.model.js`, `middlewares/auth.middleware.js`, `validators/auth.validator.js`
  * Implement `POST /api/auth/register`, `POST /api/auth/login`, JWT creation/verification, password hashing, `POST /api/auth/logout`.
* Light support scripts & validators

  * `scripts/seed.js` (basic seed), `scripts/reset-db.js` (safe reset), `validators/*.js` (auth & basic input)

**Acceptance**

* Register/login endpoints issue valid JWTs and protected routes validate tokens.
* Validators reject invalid auth inputs with consistent error format.

**Module link:**

* [Module 2 — Authentication & User Management](#2-authentication--user-management-module-2)

---