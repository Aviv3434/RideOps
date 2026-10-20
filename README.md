# RideOps — Transportation Operations Management Platform

RideOps is a full-stack transportation operations platform built for transportation companies that manage trip requests for schools, institutions, and organizations.

The system allows companies to manage clients, receive transportation requests, approve or reject trips, and export approved trips into a structured format compatible with external transportation management systems.

---

# Project Overview

RideOps was designed as a real-world business operations system with role-based access control, multi-tenant architecture, trip lifecycle management, and transportation workflow automation.

The project was built as a portfolio-level Full Stack application focusing on:

* Clean architecture
* Role-based authorization
* Backend validation
* Scalable API structure
* Real-world operational workflows
* Responsive RTL/Hebrew interface
* Database-driven business logic

---

# Tech Stack

## Frontend

* React
* TypeScript
* React Router
* Axios
* Tailwind CSS
* Context API
* Responsive RTL UI

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Zod Validation
* ExcelJS

## Development Tools

* Git & GitHub
* Thunder Client
* VS Code
* Prisma Studio

---

# Main Features

## Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Protected routes
* Secure backend authorization

### Roles

#### COMPANY_ADMIN

* Manage clients
* View all company trips
* Approve / reject / cancel trips
* Export approved trips
* Access operational dashboard

#### CLIENT_USER

* Create transportation requests
* View own trips only
* Access client-specific screens

---

# Multi-Tenant Architecture

RideOps uses tenant isolation to ensure that each transportation company can only access its own data.

Every major entity is connected to:

* transportationCompanyId

Backend services enforce authorization and tenant isolation checks on every critical operation.

---

# Clients Management Module

Transportation companies can:

* Create clients
* Edit clients
* Search clients
* Filter active/inactive clients
* Manage institution information

Client fields include:

* External client code
* Primary / secondary / mobile phone
* Institution address
* Notes
* Active status

---

# Trips Management Module

The system supports:

* Creating transportation requests
* Trip approval flow
* Trip cancellation
* Exporting approved trips
* Pagination and filtering
* Detailed trip views

Trip statuses:

* PENDING_APPROVAL
* APPROVED
* REJECTED
* CANCELLED

---

# Dashboard

The dashboard provides operational visibility including:

* Total trips
* Approved trips
* Pending trips
* Rejected trips
* Recent activity

---

# Excel Export

Approved trips can be exported into a structured Excel format designed for integration with external transportation management software.

Features:

* Export only approved trips
* Prevent duplicate exports
* RTL Excel formatting
* Structured operational layout

---

# Frontend Architecture

The frontend is structured around reusable UI components and modular pages.

Examples:

* Button
* Card
* Toast
* LoadingState
* EmptyState
* Sidebar
* Topbar
* Status badges

Pages:

* LoginPage
* DashboardPage
* TripsPage
* TripDetailsPage
* CreateTripPage
* ClientsPage

---

# Backend Architecture

The backend follows a modular Express architecture.

Structure:

* controllers
* services
* routes
* validation
* middlewares
* shared utilities

Main backend modules:

* auth
* trips
* clients
* dashboard
* exports

---

# Validation

The backend uses Zod validation for:

* Request body validation
* Query parameter validation
* Route parameter validation

Validation errors return structured responses.

---

# Security Considerations

* JWT authentication
* Password hashing with bcrypt
* Backend authorization checks
* Tenant isolation enforcement
* Protected API routes
* Input validation

---

# Demo Users

## Company Admin

Email:

```text
admin@rideops.com
```

Password:

```text
123456
```

## Client User

Email:

```text
school@rideops.com
```

Password:

```text
123456
```

---

# Running the Project

## Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Example API Endpoints

## Authentication

```http
POST /api/auth/login
```

## Trips

```http
GET /api/trips
POST /api/trips
PATCH /api/trips/:id/approve
```

## Clients

```http
GET /api/clients
POST /api/clients
PATCH /api/clients/:id
```

## Export

```http
POST /api/exports/approved
```

---

# Real-World Business Logic

The project models real operational workflows used by transportation companies.

Examples:

* Approval workflows
* Client management
* Operational exports
* Role-based visibility
* Prevention of duplicate exports
* Transportation request lifecycle

---

# Current Development Status

Current implemented modules:

* Authentication
* Authorization
* Dashboard
* Trips management
* Clients management
* Export system
* Responsive RTL UI

Planned next steps:

* Advanced trip types
* Round-trip workflows
* Customer self-service configuration
* Excel client import
* Notifications
* Calendar integration
* Advanced reporting

---

# Lessons & Challenges

Main technical challenges during development:

* Designing secure tenant isolation
* Building reusable frontend architecture
* Managing backend validation cleanly
* Designing scalable Prisma models
* Handling operational business workflows
* Maintaining role-based access across frontend and backend

---

# About This Project

RideOps was built as a portfolio and learning project to simulate a real-world operational SaaS platform.

The project focuses on practical Full Stack engineering skills including:

* Frontend architecture
* Backend API design
* Database modeling
* Authentication & authorization
* Business logic implementation
* Scalable project structure

---

# Author

Aviv Cohen

GitHub:

```text
https://github.com/Aviv3434
```
