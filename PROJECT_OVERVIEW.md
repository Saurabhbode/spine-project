# Spine Project - Complete Overview

This document provides a comprehensive overview of the Spine project, including architecture, routing, file structure, and key components. Use this as a reference for development across different machines.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routing Architecture](#routing-architecture)
5. [Authentication Flow](#authentication-flow)
6. [Frontend Components](#frontend-components)
7. [Backend Architecture](#backend-architecture)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Services Layer](#services-layer)
11. [Key Features](#key-features)
12. [Development Workflow](#development-workflow)

---

## Project Overview

**Spine** is a full-stack web application for managing organizational resources, employees, projects, and invoicing across different departments (Finance, Operations, Trace Sheets). The system supports role-based access control (RBAC) with multi-department account linking capabilities.

---

## Technology Stack

### Frontend

- **React 18** - UI Framework
- **React Router v7** - Client-side routing
- **Vite 5** - Build tool and dev server
- **CSS3** - Styling with custom design system

### Backend

- **Java/Spring Boot** - Server-side framework
- **Spring Security** - Authentication & authorization
- **JWT (JSON Web Tokens)** - Token-based authentication
- **MySQL** - Primary database
- **Maven** - Build automation

---

## Project Structure

```
Project_Spine/
├── src/                          # Frontend source code
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Main app component with routing
│   ├── App.css                   # Global app styles
│   ├── index.css                 # Root styles
│   ├── components/               # React components
│   │   ├── Landing.jsx           # Landing page with department selection
│   │   ├── login.jsx             # Login form
│   │   ├── Signup.jsx            # User registration
│   │   ├── ForgotPassword.jsx    # Password recovery
│   │   ├── Profile.jsx           # User profile management
│   │   ├── AccountManagement.jsx # Multi-account management
│   │   └── FTEInvoice.jsx        # FTE Invoice display component
│   │   └── dashboard/            # Dashboard components
│   │       ├── FinanceManagerDashboard.jsx  # Main finance dashboard
│   │       ├── Employees.jsx     # Employee management
│   │       └── Users.jsx         # User management (admin)
│   ├── services/                 # API service layer
│   │   ├── AuthService.js        # Authentication API
│   │   ├── EmployeeService.js    # Employee CRUD operations
│   │   ├── ProjectService.js     # Project CRUD operations
│   │   └── UserService.js        # User management API
│   ├── styles/                   # CSS styling system
│   │   ├── main.css
│   │   ├── base/                 # Base styles & variables
│   │   ├── components/           # Reusable component styles
│   │   ├── layout/               # Layout styles (header, dashboard)
│   │   └── pages/                # Page-specific styles
│   └── assets/                   # Static assets
│
├── Backend/                      # Spring Boot backend
│   ├── src/main/java/com/invoicingproject/spine/
│   │   ├── SpineApplication.java         # Main application class
│   │   ├── config/                          # Configuration classes
│   │   │   ├── PasswordEncoderConfig.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/                      # REST API controllers
│   │   │   ├── AuthController.java
│   │   │   ├── AdminController.java
│   │   │   ├── EmployeeController.java
│   │   │   ├── EmployeeRoleController.java
│   │   │   └── ProjectController.java
│   │   ├── dto/                             # Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── EmployeeRequest.java
│   │   │   ├── EmployeeResponse.java
│   │   │   ├── ProjectRequest.java
│   │   │   └── (other DTOs)
│   │   ├── entity/                          # JPA entities
│   │   │   ├── User.java
│   │   │   ├── Employee.java
│   │   │   ├── EmployeeRole.java
│   │   │   ├── Project.java
│   │   │   ├── EmployeeProject.java
│   │   │   └── (other entities)
│   │   ├── repository/                      # Data access layer
│   │   │   ├── UserRepository.java
│   │   │   ├── EmployeeRepository.java
│   │   │   ├── EmployeeRoleRepository.java
│   │   │   ├── ProjectRepository.java
│   │   │   └── (other repositories)
│   │   └── service/                         # Business logic layer
│   │       ├── AuthService.java
│   │       ├── JwtService.java
│   │       ├── UserService.java
│   │       └── (other services)
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/             # Flyway migrations
│           ├── V1__Create_users_and_roles_tables.sql
│           ├── V2__Create_employees_table.sql
│           ├── V3__Create_project_tables.sql
│           └── (other migrations)
│
├── package.json                    # Frontend dependencies
├── vite.config.js                  # Vite configuration
└── index.html                      # HTML entry point
```

---

## Routing Architecture

### Frontend Routes (React Router)

All routes are defined in `src/App.jsx`:

```javascript
// Public Routes
<Route path="/" element={<Landing />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/forgot-password" element={<ForgotPassword />} />

// Protected Routes
<Route path="/account-management" element={<AccountManagement />} />
<Route path="/profile" element={<Profile />} />
<Route path="/dashboard/finance-manager" element={<FinanceManagerDashboard />} />
```

### Dashboard Sub-Sections (Internal Navigation)

The `FinanceManagerDashboard` uses internal state-based navigation:

```javascript
const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { id: "invoices", label: "Invoices", icon: "fas fa-file-invoice-dollar" },
  { id: "overview", label: "Project Overview", icon: "fas fa-project-diagram" },
  { id: "employees", label: "Employees", icon: "fas fa-user-tie" },
  { id: "users", label: "Users", icon: "fas fa-users" },
];
```

### Backend Routes (REST API)

```http
# Authentication
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login (username/email/employee ID)
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/change-password # Change password
POST   /api/auth/update-email   # Update email
GET    /api/auth/profile        # Get user profile
GET    /api/auth/departments    # Get valid departments

# Admin
GET    /api/admin/users         # Get all users
PUT    /api/admin/users/{id}/role  # Update user role
PUT    /api/admin/users/roles   # Bulk update user roles
GET    /api/admin/roles         # Get available roles
GET    /api/admin/stats         # Get role statistics

# Employees
GET    /api/employees           # Get all employees
POST   /api/employees           # Create employee
GET    /api/employees/{id}      # Get employee by ID
PUT    /api/employees/{id}      # Update employee
DELETE /api/employees/{id}      # Delete employee
GET    /api/employees/project/{id}           # Get employees by project
GET    /api/employees/project-junction/{name} # Get employees from junction table

# Projects
GET    /api/projects            # Get all projects
POST   /api/projects            # Create project
GET    /api/projects/{id}       # Get project by ID
PUT    /api/projects/{id}       # Update project
DELETE /api/projects/{id}       # Delete project
GET    /api/projects/categories # Get project categories

# Employee Roles
GET    /api/employee-roles      # Get all roles
POST   /api/employee-roles      # Create role
GET    /api/employee-roles/all  # Get all roles (including inactive)
PUT    /api/employee-roles/{id} # Update role
DELETE /api/employee-roles/{id} # Delete role
```

---

## Authentication Flow

### Login Process

```
1. User enters credentials (identifier: username/email/employee ID + password)
2. Frontend calls POST /api/auth/login
3. Backend validates credentials and generates JWT tokens
4. Backend returns: { accessToken, refreshToken, user }
5. Frontend stores tokens in localStorage
6. Frontend redirects based on user.department:
   - Finance → /dashboard/finance-manager
   - Other → /
```

### Token Management

```javascript
// AuthService handles:
- accessToken: Short-lived (15 min), sent in API requests
- refreshToken: Long-lived (7 days), used to get new access token
- Automatic token refresh on 401 response
```

### Protected Route Pattern

```javascript
// Example from FinanceManagerDashboard
useEffect(() => {
  if (!authService.isAuthenticated()) {
    navigate("/login");
    return;
  }

  const currentUser = authService.getUser();
  if (!currentUser || currentUser.department !== "Finance") {
    navigate("/"); // Redirect non-finance users
    return;
  }

  setUser(currentUser);
  loadDashboardData();
}, [navigate]);
```

### Department-Based Access

```javascript
// Login stores selected department
localStorage.setItem("selectedDepartment", "Finance");

// Login checks department for routing
if (user.department === "Finance") {
  navigate("/dashboard/finance-manager");
}
```

---

## Frontend Components

### Public Components

| Component         | File                               | Purpose                                     |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| Landing           | `components/Landing.jsx`           | Entry point with department selection cards |
| Login             | `components/login.jsx`             | User authentication form                    |
| Signup            | `components/Signup.jsx`            | New user registration                       |
| ForgotPassword    | `components/ForgotPassword.jsx`    | Password recovery                           |
| Profile           | `components/Profile.jsx`           | User profile with password/email management |
| AccountManagement | `components/AccountManagement.jsx` | Multi-account linking                       |

### Dashboard Components

| Component               | File                                               | Purpose                                        |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------- |
| FinanceManagerDashboard | `components/dashboard/FinanceManagerDashboard.jsx` | Main finance dashboard with sidebar navigation |
| Employees               | `components/dashboard/Employees.jsx`               | Employee CRUD with role management             |
| Users                   | `components/dashboard/Users.jsx`                   | Admin user management (role assignment)        |
| FTEInvoice              | `components/FTEInvoice.jsx`                        | FTE invoice summary table component            |

### Component Hierarchy

```
App.jsx
├── Router
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── Profile.jsx
│   ├── AccountManagement.jsx
│   └── FinanceManagerDashboard.jsx
│       ├── Sidebar (internal)
│       ├── Header (internal)
│       ├── Dashboard View (stats, activities)
│       ├── Employees Component
│       ├── Users Component
│       ├── Project Overview (inline)
│       └── Invoices Section (inline)
```

---

## Backend Architecture

### Spring Boot Structure

```
com.invoicingproject.spine
├── SpineApplication.java           # Main class
├── config/
│   ├── PasswordEncoderConfig.java  # BCrypt password encoder
│   └── SecurityConfig.java         # Security filter chain configuration
├── controller/
│   ├── AuthController.java         # Authentication endpoints
│   ├── AdminController.java        # Admin user management
│   ├── EmployeeController.java     # Employee CRUD
│   ├── EmployeeRoleController.java # Role management
│   └── ProjectController.java      # Project CRUD
├── dto/                            # Request/Response DTOs
├── entity/                         # JPA Entities
├── repository/                     # Spring Data JPA Repositories
└── service/                        # Business logic
```

### Security Configuration

- **JWT Authentication**: All API requests require Bearer token
- **Password Encoding**: BCrypt with strength 10
- **CORS**: Enabled for all origins (`origins="*"`)
- **Public Endpoints**: `/api/auth/**`, `/api/employee-roles`

---

## Database Schema

### Main Tables

#### users

```sql
- id (PK)
- username (unique)
- password (hashed)
- email (unique)
- name
- employee_number (unique)
- location
- department
- role (USER, MANAGER, ADMIN, FINANCE)
- is_active
- created_at
- updated_at
```

#### employees

```sql
- id (PK)
- emp_id (unique)
- name
- project (project name for backward compat)
- agency
- employee_role
- billable_status (boolean)
- billing_type (Billable/Non-Billable)
- start_date
- tenure (computed)
- created_at
- updated_at
```

#### employee_projects (Junction Table)

```sql
- id (PK)
- employee_id (FK -> employees)
- project_id (FK -> projects)
```

#### projects

```sql
- id (PK)
- project_name (unique)
- project_description
- category_id (FK -> project_categories)
- project_type (FTE/Contingency)
- start_date
- end_date
- budget
- location
- department
- status
- created_at
- updated_at
```

#### project_categories

```sql
- id (PK)
- category_name
- description
- is_active
```

#### employee_roles

```sql
- id (PK)
- role_name (unique)
- description
- is_active
- created_at
- updated_at
```

### Flyway Migrations

Located in `Backend/src/main/resources/db/migration/`:

- V1: Create users and roles tables
- V2: Create employees table
- V3: Create project tables
- V4: Create employee_roles table
- V5-V8: Additional columns and junction table

---

## Services Layer

### AuthService (`src/services/AuthService.js`)

Key methods:

```javascript
-register(userData) - // Register new user
  login(identifier, password, department) - // Login with username/email/emp ID
  logout() - // Clear tokens and redirect
  isAuthenticated() - // Check if logged in
  getUser() - // Get current user
  getAccessToken() - // Get JWT token
  refreshToken() - // Refresh expired token
  getUserProfile(username) - // Fetch user profile
  getValidDepartments() - // Get available departments
  makeAuthenticatedRequest(url, options); // Auto-refresh on 401
```

### EmployeeService (`src/services/EmployeeService.js`)

Key methods:

```javascript
-getAllEmployees() - // Fetch all employees
  getEmployeeById(id) - // Fetch single employee
  createEmployee(data) - // Create new employee
  updateEmployee(id, data) - // Update employee
  deleteEmployee(id) - // Delete employee
  getEmployeesByProject(projectId) - // Get by project ID
  getEmployeesByProjectFromJunction(projectName); // Multi-project support
```

### ProjectService (`src/services/ProjectService.js`)

Key methods:

```javascript
-getAllProjects() - // Fetch all projects
  getProjectById(id) - // Fetch single project
  createProject(data) - // Create new project
  updateProject(id, data) - // Update project
  deleteProject(id) - // Delete project
  getAllCategories(); // Get project categories
```

### UserService (`src/services/UserService.js`)

Key methods:

```javascript
-getAllUsers() - // Fetch all users (admin)
  updateUserRole(userId, role) - // Update single user role
  updateMultipleUserRoles(ids, role) - // Bulk role update
  getAvailableRoles() - // Get role options
  getRoleStatistics() - // Get role counts
  formatRole(role) - // Format role display
  getRoleBadgeClass(role); // Get CSS class for badge
```

---

## Key Features

### 1. Multi-Department Support

- Users can select department on landing page
- Finance, Operations, Trace Sheets departments
- Account linking across departments

### 2. Role-Based Access Control (RBAC)

- Roles: USER, MANAGER, ADMIN, FINANCE
- Dashboard access restricted by department
- Admin panel for user management

### 3. Project Management

- FTE-based and Contingency-based projects
- Project categories
- Budget tracking
- Date range management

### 4. Employee Management

- Multi-project assignments (junction table)
- Billable/Non-Billable status
- Employee roles
- Tenure tracking

### 5. Invoicing

- FTE Invoice generation
- Project-based invoice creation
- Invoice summary tables

### 6. User Management (Admin)

- Bulk role assignment
- User listing with search/filter
- Role statistics

---

## Development Workflow

### Running the Application

#### Frontend (Port 5173)

```bash
cd /Users/saurabhbode/Documents/Project_Spine
npm run dev
```

#### Backend (Port 8080)

```bash
cd /Users/saurabhbode/Documents/Project_Spine/Backend
mvn spring-boot:run
# OR
mvn clean install && java -jar target/spine-0.0.1-SNAPSHOT.jar
```

#### Database (MySQL)

```bash
# Ensure MySQL is running on localhost:3306
# Create database: spine_db
# Flyway handles schema migration automatically
```

### API Proxy Configuration

Vite proxies API calls to backend:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
  }
}
```

### Hot Reload

- Frontend: Vite HMR (instant updates)
- Backend: Spring Boot devtools (automatic restart)

---

## Important Configuration Files

| File                                                | Purpose                            |
| --------------------------------------------------- | ---------------------------------- |
| `vite.config.js`                                    | Vite build config with API proxy   |
| `package.json`                                      | Frontend dependencies              |
| `Backend/pom.xml`                                   | Maven dependencies                 |
| `Backend/src/main/resources/application.properties` | Database connection, JWT secrets   |
| `src/services/*.js`                                 | API endpoint URLs (localhost:8080) |

---

## Common Issues & Solutions

### Backend Not Connecting

1. Ensure MySQL is running
2. Check `application.properties` for correct database credentials
3. Verify Flyway migrations ran successfully

### CORS Errors

- Frontend uses Vite proxy to avoid CORS
- Direct API calls from browser need CORS enabled in Spring Security

### JWT Token Expiry

- Tokens expire after 15 minutes
- AuthService auto-refreshes on 401
- If refresh fails, user is redirected to login

### Database Migration Issues

- Delete Flyway checksum in `schema_version` table if migrations fail
- Run `mvn flyway:repair` then `mvn flyway:migrate`

---

## Quick Reference

### API Base URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Database**: mysql://localhost:3306/spine_db

### Test Credentials

```javascript
// Check database for existing users or register new account
```

### Key Files for Modifications

| Task                  | File                                                   |
| --------------------- | ------------------------------------------------------ |
| Add new route         | `src/App.jsx`                                          |
| Add API endpoint      | `Backend/src/main/java/.../controller/`                |
| Add entity            | `Backend/src/main/java/.../entity/`                    |
| Modify auth logic     | `src/services/AuthService.js`                          |
| Add dashboard section | `src/components/dashboard/FinanceManagerDashboard.jsx` |

---

## Document Version

**Last Updated**: 2024
**Maintained By**: Development Team

---

_This document serves as the single source of truth for the Spine project architecture. Update this file when making significant structural changes._
