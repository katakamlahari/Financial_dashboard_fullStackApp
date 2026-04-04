# API Request/Response Examples

This document contains comprehensive examples for testing the Finance Dashboard API.

## Authentication Endpoints

### 1. Register User

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clpc5q2b4000108j9xyz9abc0",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VIEWER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNscGM1cTJiNDAwMDEwOGo5eHl6OWFiYzAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiVklFV0VSIiwiaWF0IjoxNzA1MzEwNjAwLCJleHAiOjE3MDU5MTU0MDB9.x..." 
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clpc5q2b4000108j9xyz9abc0",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VIEWER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNscGM1cTJiNDAwMDEwOGo5eHl6OWFiYzAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiVklFV0VSIiwiaWF0IjoxNzA1MzEwNjAwLCJleHAiOjE3MDU5MTU0MDB9.x..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Save token for subsequent requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## User Management Endpoints

### 3. Get User Profile

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9abc0",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "VIEWER",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Get All Users (Admin Only)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clpc5q2b4000108j9xyz9abc0",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "VIEWER",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "clpc5q2b4000108j9xyz9def1",
        "email": "jane@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "ANALYST",
        "isActive": true,
        "createdAt": "2024-01-16T10:30:00.000Z",
        "updatedAt": "2024-01-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 5. Update User (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/clpc5q2b4000108j9xyz9abc0 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "lastName": "Doe",
    "role": "ANALYST",
    "isActive": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9abc0",
    "email": "john@example.com",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "role": "ANALYST",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 6. Assign Role (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/clpc5q2b4000108j9xyz9abc0/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9abc0",
    "email": "john@example.com",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:05:00.000Z"
  },
  "timestamp": "2024-01-15T11:05:00.000Z"
}
```

---

### 7. Deactivate User (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/clpc5q2b4000108j9xyz9def1/deactivate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T11:10:00.000Z"
}
```

---

### 8. Activate User (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/clpc5q2b4000108j9xyz9def1/activate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T11:15:00.000Z"
}
```

---

### 9. Delete User (Admin Only)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/clpc5q2b4000108j9xyz9def1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T11:20:00.000Z"
}
```

---

## Financial Records Endpoints

### 10. Create Financial Record

**Request:**
```bash
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T12:00:00Z",
    "notes": "Monthly salary - January 2024"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9ghi2",
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T12:00:00.000Z",
    "notes": "Monthly salary - January 2024",
    "createdBy": "clpc5q2b4000108j9xyz9abc0",
    "deletedAt": null,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

### 11. Get All Financial Records (with filters)

**Request - Basic:**
```bash
curl -X GET "http://localhost:3000/api/records?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Request - With Filters:**
```bash
curl -X GET "http://localhost:3000/api/records?type=INCOME&category=Salary&page=1&limit=10&sortBy=date&sortOrder=desc" \
  -H "Authorization: Bearer $TOKEN"
```

**Request - Date Range:**
```bash
curl -X GET "http://localhost:3000/api/records?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clpc5q2b4000108j9xyz9ghi2",
        "amount": 5000,
        "type": "INCOME",
        "category": "Salary",
        "date": "2024-01-15T12:00:00.000Z",
        "notes": "Monthly salary",
        "createdBy": "clpc5q2b4000108j9xyz9abc0",
        "createdAt": "2024-01-15T10:35:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z"
      },
      {
        "id": "clpc5q2b4000108j9xyz9jkl3",
        "amount": 500,
        "type": "INCOME",
        "category": "Freelance",
        "date": "2024-01-10T12:00:00.000Z",
        "notes": "Side project payment",
        "createdBy": "clpc5q2b4000108j9xyz9abc0",
        "createdAt": "2024-01-10T15:20:00.000Z",
        "updatedAt": "2024-01-10T15:20:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

### 12. Get Single Record

**Request:**
```bash
curl -X GET http://localhost:3000/api/records/clpc5q2b4000108j9xyz9ghi2 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9ghi2",
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T12:00:00.000Z",
    "notes": "Monthly salary - January 2024",
    "createdBy": "clpc5q2b4000108j9xyz9abc0",
    "deletedAt": null,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

### 13. Update Record

**Request:**
```bash
curl -X PUT http://localhost:3000/api/records/clpc5q2b4000108j9xyz9ghi2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5200,
    "notes": "Updated salary - bonus included"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clpc5q2b4000108j9xyz9ghi2",
    "amount": 5200,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T12:00:00.000Z",
    "notes": "Updated salary - bonus included",
    "createdBy": "clpc5q2b4000108j9xyz9abc0",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "timestamp": "2024-01-15T11:30:00.000Z"
}
```

---

### 14. Delete Record

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/records/clpc5q2b4000108j9xyz9ghi2 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T11:35:00.000Z"
}
```

---

## Dashboard Analytics Endpoints

### 15. Get Dashboard Summary

**Request - All Time:**
```bash
curl -X GET http://localhost:3000/api/records/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Request - Date Range:**
```bash
curl -X GET "http://localhost:3000/api/records/dashboard/summary?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 25500,
    "totalExpense": 8500,
    "netBalance": 17000,
    "categoryTotals": [
      {
        "category": "Salary",
        "type": "INCOME",
        "total": 25000,
        "count": 5
      },
      {
        "category": "Freelance",
        "type": "INCOME",
        "total": 500,
        "count": 1
      },
      {
        "category": "Groceries",
        "type": "EXPENSE",
        "total": 1500,
        "count": 10
      },
      {
        "category": "Rent",
        "type": "EXPENSE",
        "total": 7000,
        "count": 2
      }
    ],
    "recentTransactions": [
      {
        "id": "clpc5q2b4000108j9xyz9ghi2",
        "amount": 5200,
        "type": "INCOME",
        "category": "Salary",
        "date": "2024-01-15T12:00:00.000Z"
      },
      {
        "id": "clpc5q2b4000108j9xyz9mno4",
        "amount": 150,
        "type": "EXPENSE",
        "category": "Groceries",
        "date": "2024-01-14T15:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-15T11:35:00.000Z"
}
```

---

### 16. Get Monthly Trends

**Request:**
```bash
curl -X GET "http://localhost:3000/api/records/dashboard/monthly-trends?months=12" \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "month": "2023-12",
      "income": 15000,
      "expense": 8000
    },
    {
      "month": "2024-01",
      "income": 25500,
      "expense": 8500
    }
  ],
  "timestamp": "2024-01-15T11:35:00.000Z"
}
```

---

### 17. Get Category Breakdown

**Request:**
```bash
curl -X GET http://localhost:3000/api/records/dashboard/category-breakdown \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "category": "Salary",
      "type": "INCOME",
      "total": 50000,
      "count": 12
    },
    {
      "category": "Freelance",
      "type": "INCOME",
      "total": 8000,
      "count": 8
    },
    {
      "category": "Rent",
      "type": "EXPENSE",
      "total": 14000,
      "count": 12
    },
    {
      "category": "Groceries",
      "type": "EXPENSE",
      "total": 3600,
      "count": 36
    },
    {
      "category": "Utilities",
      "type": "EXPENSE",
      "total": 2400,
      "count": 12
    }
  ],
  "timestamp": "2024-01-15T11:35:00.000Z"
}
```

---

## Error Response Examples

### 400 Validation Error

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": [
      {
        "path": "email",
        "message": "Invalid email format"
      },
      {
        "path": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

### 401 Unauthorized

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "No token provided"
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

### 403 Forbidden

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this resource"
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

### 404 Not Found

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "Record not found"
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

### 409 Conflict

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "Email already registered"
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

### 500 Internal Server Error

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  },
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

---

## Testing with Postman

1. Import this collection into Postman
2. Set Postman variables:
   - `base_url`: http://localhost:3000
   - `token`: (obtained from login)
   - `admin_token`: (obtained from admin login)

3. Use pre-request scripts to automatically save tokens

---

## Testing with REST Client (VSCode)

Create `requests.http`:

```http
### Register User
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

### Login
@token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

### Get Profile
GET http://localhost:3000/api/users/profile
Authorization: @token

### Create Record
POST http://localhost:3000/api/records
Authorization: @token
Content-Type: application/json

{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-15T12:00:00Z"
}
```

---

For more testing examples, visit Swagger documentation at `http://localhost:3000/api-docs`
