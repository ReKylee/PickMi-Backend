# PickMi-Backend Web Application

This is the backend implementation for PickMi, an anonymous note-throwing web application built with Node.js, Express, TypeScript, and MongoDB. The project follows clean architecture principles with a well-structured domain-driven design.

---

## 🏗️ Architecture Overview

This backend implements a **Clean Architecture** pattern with the following layers:

- **Domain Layer**: Core business logic, entities, and value objects
- **Application Layer**: Use cases and application services  
- **Infrastructure Layer**: External concerns (database, API routes, services)
- **Shared Layer**: Cross-cutting concerns (errors, middleware, utilities)

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT-based authentication
- **Validation**: Zod for schema validation
- **Error Handling**: Custom domain error types with neverthrow Result pattern

---

## 🚧 Current Implementation Status

**⚠️ Note**: This project is currently in development. While the architectural foundation is complete, most API endpoints are not yet implemented.

### ✅ Implemented Components

- **Domain Models**: User and Note entities with proper value objects
- **Database Models**: MongoDB schemas for Users and Notes with geospatial indexing
- **Authentication Middleware**: JWT-based authentication with role-based access
- **Error Handling**: Comprehensive error types and middleware
- **Use Cases**: User signup and signin business logic
- **Infrastructure**: Repository pattern with MongoDB implementation

### 🔄 In Progress / Planned

- **API Routes**: HTTP endpoints are stubbed but not connected to use cases
- **Note Operations**: Creating and retrieving notes functionality  
- **Admin Operations**: User and note management endpoints
- **Location Validation**: Geographic proximity verification
- **Password Reset**: Email-based password recovery

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ReKylee/PickMi-Backend.git
   cd PickMi-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/pickmi
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the production server
- `npm run dev` - Start the development server with hot reload

---

## 🔧 Current Working Features

### ✅ Infrastructure Components

The following components are fully implemented and functional:

#### Authentication Middleware
- JWT token validation and parsing
- Role-based access control (user/admin)
- Proper error handling for invalid/expired tokens

#### Error Handling System  
- Custom domain error classes with proper HTTP status codes
- Global error middleware that formats responses consistently
- Support for validation errors with detailed field-level feedback

#### Database Models
- **User Model**: Email, password, role with proper validation
- **Note Model**: Title, content (text + drawing), location with 2dsphere indexing
- MongoDB connection with graceful shutdown handling

#### Domain Layer
- **User Entity**: Email and password value objects with validation
- **Note Entity**: Title, content, and location value objects  
- **Use Cases**: SignUp and SignIn business logic implemented

### ⚠️ Stub Implementations

The following routes exist but are not yet connected to business logic:

- `POST /api/auth/*` - Authentication endpoints (middleware only)
- `POST /api/notes/*` - Note management endpoints (middleware only)  
- `POST /api/admin/*` - Admin endpoints (middleware only)

---

## 📁 Project Structure

```
src/
├── Application/           # Use cases and application services
│   ├── Notes/            # Note-related use cases
│   │   ├── createNote.ts      # Create note use case
│   │   └── getNearbyNotes.ts  # Get nearby notes use case
│   └── Users/            # User-related use cases
│       ├── signIn.ts          # User signin use case
│       └── signUp.ts          # User signup use case
│
├── Domain/               # Core business logic
│   ├── Notes/           # Note domain entities
│   │   ├── Note.ts           # Note entity
│   │   ├── INoteRepository.ts # Note repository interface
│   │   └── NoteMapper.ts     # Note data mapping
│   ├── Users/           # User domain entities
│   │   ├── User.ts           # User entity
│   │   ├── IUserRepository.ts # User repository interface
│   │   └── UserMapper.ts     # User data mapping
│   ├── Services/        # Domain services interfaces
│   ├── Shared/          # Shared domain logic
│   └── ValueObjects/    # Value object implementations
│       ├── Email.ts          # Email validation
│       ├── Password.ts       # Password validation
│       ├── Location.ts       # Geographic location
│       └── ...
│
├── Infrastructure/      # External concerns
│   ├── API/
│   │   ├── Controllers/      # HTTP controllers (partially implemented)
│   │   └── Routes/          # Express route definitions (stubs)
│   ├── Database/
│   │   ├── Models/          # MongoDB schemas
│   │   └── Repositories/    # Repository implementations
│   └── Services/        # External service implementations
│       └── JWTAuthService.ts # JWT authentication service
│
├── Shared/              # Cross-cutting concerns
│   ├── Middlewares/     # Express middlewares
│   │   ├── authMiddleware.ts    # JWT authentication
│   │   ├── errorMiddleware.ts   # Global error handling
│   │   └── requireAdmin.ts     # Admin role validation
│   ├── App.ts           # Express app configuration
│   ├── Connect.ts       # Database connection
│   └── Errors.ts        # Custom error definitions
│
└── index.ts             # Application entry point
```

---

## 🛠️ Development Guidelines

### Error Handling

The application uses a comprehensive error handling system with custom domain errors:

- **ValidationError** (400): Input validation failures
- **AuthenticationError** (401): Authentication failures  
- **ForbiddenError** (403): Authorization failures
- **NotFoundError** (404): Resource not found
- **ConflictError** (409): Resource conflicts (e.g., duplicate email)
- **BusinessRuleViolationError** (422): Domain rule violations
- **RepositoryError** (500): Database operation failures
- **UnexpectedError** (500): Unhandled exceptions

### Architecture Patterns

- **Repository Pattern**: Data access abstraction
- **Use Case Pattern**: Application logic encapsulation  
- **Value Objects**: Domain validation and type safety
- **Result Pattern**: Functional error handling with neverthrow
- **Dependency Injection**: Loose coupling between layers

---

## 🤝 Contributing

### Development Workflow

1. **Architecture First**: Follow the clean architecture principles
2. **Domain-Driven**: Start with domain entities and use cases
3. **Test Infrastructure**: Test individual components before integration
4. **Error Handling**: Use the established error types and patterns

### Next Development Steps

To complete the API implementation, the following work is needed:

1. **Connect Routes to Use Cases**
   - Wire up existing SignUp/SignIn use cases to HTTP controllers
   - Implement missing use cases (CreateNote, GetNearbyNotes, etc.)
   - Connect controllers to route handlers

2. **Complete Missing Use Cases**
   - Password reset functionality
   - Note creation with location validation
   - Admin operations (user/note management)

3. **Add Business Logic**
   - Geographic proximity validation for note creation
   - Email service for password reset
   - Admin role management

4. **Testing**
   - Unit tests for domain logic
   - Integration tests for API endpoints
   - End-to-end testing

### Code Style

- Use TypeScript strict mode
- Follow functional programming patterns with neverthrow
- Implement proper error handling at all layers
- Use dependency injection for loose coupling

---

## 📋 API Specification (Planned)

**The following API specification describes the planned endpoints. Currently, only the foundational infrastructure is implemented.**

### General Design Principles

- **Base URL**: All API routes are prefixed with `/api`
- **Authentication**: JWT-based authentication using Bearer tokens in the `Authorization` header
  - **Header Format**: `Authorization: Bearer <your_jwt_here>`
  - **Role-Based Access**: JWTs include a `role` field (`"user"` or `"admin"`) for authorization
- **Error Handling**: Consistent error format using custom domain error types
  [View domain error definitions](./src/Shared/Errors.ts)
  **EXAMPLE**: 
  ```json
  {
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "path": "email", "message": "Invalid email format" },
      { "path": "password", "message": "Password too weak" }
      ]
    }
  } 
  ```
  
  | Error Type                | HTTP Code | Class                        | Typical Use                                |
  | ------------------------- | --------- | ---------------------------- | ------------------------------------------ |
  | `VALIDATION_ERROR`        | 400       | `ValidationError`            | Invalid input (e.g., from Zod)             |
  | `AUTHENTICATION_ERROR`    | 401       | `AuthenticationError`        | Missing or bad JWT                         |
  | `FORBIDDEN_ERROR`         | 403       | `ForbiddenError`             | Unauthorized action (e.g., wrong location) |
  | `NOT_FOUND`               | 404       | `NotFoundError`              | Missing notes, users, etc.                 |
  | `BUSINESS_RULE_VIOLATION` | 422       | `BusinessRuleViolationError` | Domain logic failures (e.g. duplicates)    |
  | `UNEXPECTED_ERROR`        | 500       | `UnexpectedError`            | Server or uncaught issues                  |

  **FORMAT**:
  ```json
  {
    "error": {
      "type": "VALIDATION_ERROR",      // One of: NOT_FOUND, VALIDATION_ERROR, AUTHENTICATION_ERROR, etc.
      "message": "A human-readable summary",
      "details": {}                    // Optional field depending on error type
    }
  }
  ```

- **Authentication**: For every place where authentication is required, note that an authentication error may be thrown.
- **Data Format**: All request and response bodies should be in `JSON` format.

---

## 🔐 Authentication Endpoints (Planned)

**⚠️ Status**: Infrastructure exists, but HTTP endpoints are not yet implemented.

### 1. User Sign Up

- **Endpoint**: `POST /api/auth/signup`
- **Description**: Creates a new user account.
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "A_Strong_Password123!"
  }
  ```

- **Success Response** (`201 Created`):

  ```json
  {
    "message": "User created successfully. Please sign in."
  }
  ```

- **Error Responses**:
  - `409 Conflict`: If the email address is already in use. -> BusinessRuleViolationError
    ```json
    {
    "error": {
      "type": "BUSINESS_RULE_VIOLATION",
      "message": "Email already exists."
      }
    }
    ```

  - `400 Bad Request`: If the email is invalid or the password doesn't meet strength requirements. -> ValidationError

### 2. User Sign In

- **Endpoint**: `POST /api/auth/signin`
- **Description**: Authenticates a user and returns a JWT.
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```

- **Success Response** (`200 OK`):

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **Error Response** (`401 Unauthorized`) -> AuthenticationError
  - For incorrect email or password.
    ```json
    {
    "error": {
      "type": "AUTHENTICATION_ERROR",
      "message": "Invalid credentials."
      }
    }
    ```

### 3. Forgot Password

- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Initiates the password reset process by sending an email.
- **Request Body**:

  ```json
  {
    "email": "user@example.com"
  }
  ```

- **Success Response** (`200 OK`):

  - Confirms the email was sent.

  ```json
  {
    "message": "If an account with that email exists, a password reset link has been sent."
  }
  ```

### 4. Reset Password

- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Sets a new password using a token from the reset email.
- **Request Body**:

  ```json
  {
    "token": "the_unique_reset_token_from_email_link",
    "newPassword": "MyNewSecurePassword123!"
  }
  ```

- **Success Response** (`200 OK`):

  ```json
  {
    "message": "Password has been reset successfully. Please sign in."
  }
  ```

- **Error Response** (`400 Bad Request`):
  - If the token is invalid/expired or the new password is too weak. -> ValidationError
    ```json
    {
      "error": {
        "type": "VALIDATION_ERROR",
        "message": "Invalid token or weak password."
      }
    }
    ```


### 5. Delete Account

* **Endpoint**: `DELETE /api/users/me`
* **Description**: Permanently deletes the authenticated user's account and all their associated data. For security, this action requires the user to re-enter their current password.
* **Authentication**: **Required**. The backend identifies the user to be deleted via their JWT.
* **Request Body**:
    ```json
    {
      "password": "user_current_password"
    }
    ```
* **Success Response** (`200 OK`):
    ```json
    {
      "message": "Account deleted successfully."
    }
    ```
* **Error Response** (`401 Unauthorized`) -> AuthenticationError
    * Returned if the provided password does not match the one on record for the user, or if the JWT is invalid/expired.
    ```json
    {
    "error": {
      "type": "AUTHENTICATION_ERROR",
      "message": "Invalid password."
      }
    }
    ```
    
---

## 📝 Note & Location Endpoints (Planned)

**⚠️ Status**: Domain models and use cases exist, but HTTP endpoints are not yet implemented.

### 1. Throw a Note

- **Endpoint**: `POST /api/notes`
- **Description**: Creates a new note, but only if the user is physically at the specified location.
- **Authentication**: **Required**.
- **Request Body**:

  ```json
  {
    "content": {
      "text": "Never gonna give you up...",
      "drawingData": "/* SVG data, base64 image, or another format */"
    },
    "location": {
      "latitude": 40.7128,
      "longitude": -74.006,
      "placeId": "ChIJ..."
    }
  }
  ```

- **Success Response** (`201 Created`):

  ```json
  {
    "id": "mongo_object_id_123",
    "message": "Note thrown successfully!"
  }
  ```

- **Error Responses**:
  - `401 Unauthorized` Returned if the provided password does not match the one on record for the user, or if the JWT is invalid/expired -> AuthenticationError
    ```json
    {
    "error": {
      "type": "AUTHENTICATION_ERROR",
      "message": "Invalid password."
      }
    }
    ```
    
  - `403 Forbidden`: If the user's coordinates are too far from the `placeId` location -> ForbiddenError
    ```json
    {
    "error": {
      "type": "FORBIDDEN_ERROR",
      "message": "You are not at this location."
      }
    }
    ```
  - `400 Bad Request`: If content is missing or location data is invalid -> ValidationError
    ```json
    {
    "error": {
      "type": "VALIDATION_ERROR",
      "message": "Invalid note data.",
      "details": [
        { "path": "content.text", "message": "Text is required." },
        { "path": "location", "message": "Invalid coordinates." }
      ]
      }
    }
    ```

### 2. Get Nearby Notes (for the Map)

- **Endpoint**: `GET /api/notes/nearby`
- **Description**: Fetches the locations of all notes within a certain radius of the user.
- **Authentication**: **Required**.
- **Query Parameters**:
  - `lat`: User's current latitude.
  - `lon`: User's current longitude.
  - `radius`: (Optional) Search radius in meters.
  - **Example**: `/api/notes/nearby?lat=40.7128&lon=-74.0060&radius=5000`
- **Success Response** (`200 OK`):

  - Returns a lightweight array of note locations for map display.

  ```json
  [
    {
      "id": "mongo_object_id_123",
      "location": { "lat": 40.7129, "lon": -74.0061 }
    },
    {
      "id": "mongo_object_id_456",
      "location": { "lat": 40.7135, "lon": -74.0055 }
    }
  ]
  ```
  
- **Error Responses**:
  - `401 Unauthorized` Returned if the provided password does not match the one on record for the user, or if the JWT is invalid/expired -> AuthenticationError
    ```json
    {
    "error": {
      "type": "AUTHENTICATION_ERROR",
      "message": "Invalid password."
      }
    }
    ```

### 3. Get a Specific Note's Content

- **Endpoint**: `GET /api/notes/:id`
- **Description**: Retrieves the full content of a single note.
- **Authentication**: **Required**.
- **Request Parameter**:
  - `:id`: The ID of the note.
  - **Example**: `/api/notes/mongo_object_id_123`
- **Success Response** (`200 OK`):

  ```json
  {
    "id": "mongo_object_id_123",
    "content": {
      "text": "Never gonna give you up...",
      "drawingData": "/* SVG data... */"
    },
    "createdAt": "2025-07-08T18:00:00.000Z"
  }
  ```

- **Error Response**
  - `404 Not Found` -> NotFoundError
   ```json
    {
    "error": {
      "type": "NOT_FOUND",
      "message": "Note not found."
      }
    }
    ```

  - `401 Unauthorized` Returned if the provided password does not match the one on record for the user, or if the JWT is invalid/expired -> AuthenticationError
    ```json
    {
    "error": {
      "type": "AUTHENTICATION_ERROR",
      "message": "Invalid password."
      }
    }
    ```
    
---

## 👨‍💼 Admin Endpoints (Planned)

**⚠️ Status**: Route stubs exist, but functionality is not yet implemented.

### 1. Get All Users

  - **Endpoint**: `GET /api/admin/users`
  - **Description**: Retrieves a list of all registered users.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - **Success Response** (`200 OK`):
    ```json
    [
      {
        "id": "user123",
        "email": "user@example.com",
        "createdAt": "2025-06-30T18:00:00.000Z"
      },
      {
        "id": "user456",
        "email": "another@example.com",
        "createdAt": "2025-07-01T11:45:00.000Z"
      }
    ]
    ```
  - **Error Response**: If attempted by a non-admin. 403 Forbidden → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```

### 2. Get All notes

  - **Endpoint**: `GET /api/admin/notes`
  - **Description**: Retrieves all notes in the system regardless of location or ownership.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - **Success Response** (`200 OK`):
    ```json
    [
    {
      "id": "mongo_object_id_123",
      "userId": "user123",
      "content": {
        "text": "Admin can see this.",
        "drawingData": null
      },
      "location": {
        "latitude": 40.7128,
        "longitude": -74.006,
        "placeId": "ChIJ..."
      },
      "createdAt": "2025-07-08T18:00:00.000Z"
    }
    ]
    ```
  - **Error Response**: If attempted by a non-admin. 403 Forbidden → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```

### 2. Get a Specific User's Info

  - **Endpoint**: `GET /api/admin/users/:id`
  - **Description**: Retrieves basic information about a specific user.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - Request Parameter:
     -`:id`: The ID of the user.
  - **Success Response** (`200 OK`):
    ```json
    {
    "id": "user123",
    "email": "user@example.com",
    "createdAt": "2025-06-30T18:00:00.000Z"
    }
    ```
  - **Error Response**:
  - If the user ID does not exist. (`404 Not Found`) -> NotFoundError
    ```json
    {
      "error": {
        "type": "NOT_FOUND",
        "message": "User not found."
      }
    }
    ```
  - If attempted by a non-admin. (`403 Forbidden`) → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```
    
### 3. View a User's Notes

  - **Endpoint**: `GET /api/admin/users/:id/notes`
  - **Description**: Retrieves all notes thrown by a specific user.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - Request Parameter:
     -`:id`: The ID of the user.
  - **Success Response** (`200 OK`):
    ```json
    [
    {
      "id": "note123",
      "content": {
        "text": "This user's note",
        "drawingData": null
      },
      "location": {
        "latitude": 40.7128,
        "longitude": -74.006
      },
      "createdAt": "2025-07-08T18:00:00.000Z"
    }
    ]
    ```
  - **Error Response**:
  - If the user ID or their notes do not exist. (`404 Not Found`) -> NotFoundError
    ```json
    {
      "error": {
        "type": "NOT_FOUND",
        "message": "User not found."
      }
    }
    ```
  - If attempted by a non-admin. (`403 Forbidden`) → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```

### 4. Delete a User

  - **Endpoint**: `DELETE /api/admin/users/:id`
  - **Description**: Permanently deletes the specified user and all associated notes.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - Request Parameter:
     -`:id`: The ID of the user.
  - **Success Response** (`200 OK`):
    ```json
    {
    "message": "User and all associated data deleted successfully."
    }
    ```
  - **Error Response**:
  - If the user ID does not exist. (`404 Not Found`) -> NotFoundError
    ```json
    {
      "error": {
        "type": "NOT_FOUND",
        "message": "User not found."
      }
    }
    ```
  - If attempted by a non-admin. (`403 Forbidden`) → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```

### 4. Delete a Note

  - **Endpoint**: `DELETE /api/admin/notes/:id`
  - **Description**: Deletes a specific note, regardless of who created it.
  - **Authentication**: **Required**. Must have role: "admin" in JWT.
  - Request Parameter:
     -`:id`: The ID of the user.
  - **Success Response** (`200 OK`):
    ```json
    {
    "message": "Note deleted successfully."
    }
    ```
  - **Error Response**:
  - If the user ID does not exist. (`404 Not Found`) -> NotFoundError
    ```json
    {
      "error": {
        "type": "NOT_FOUND",
        "message": "User not found."
      }
    }
    ```
  - If attempted by a non-admin. (`403 Forbidden`) → ForbiddenError
    ```json
    {
      "error": {
        "type": "FORBIDDEN_ERROR",
        "message": "Admin access required."
      }
    }
    ```


---

## ⚠️ Known Limitations

### Current State
- **No HTTP Endpoints**: Routes exist but return empty responses
- **No Database Seeding**: No initial admin user or test data
- **No Email Service**: Password reset functionality incomplete
- **No Location Validation**: Geographic proximity checking not implemented
- **No Tests**: No unit or integration tests currently exist

### Production Readiness
This codebase is **not production-ready**. The following must be completed before deployment:

- Complete HTTP endpoint implementation
- Add comprehensive testing
- Implement proper logging and monitoring
- Add rate limiting and security headers
- Set up database migrations and seeding
- Configure production environment variables
- Add CI/CD pipeline

---

## 📝 License

ISC License - see package.json for details.

---

## 👥 Author

**Kylee Benisty** - [ReKylee](https://github.com/ReKylee)

---

*This README reflects the current state of the PickMi-Backend as of the latest update. The project demonstrates a solid architectural foundation with clean code principles, ready for continued development of the HTTP API layer.*
