# Architecture Documentation

## Clean Architecture Overview

The Finance Dashboard Backend follows a **Clean Architecture** pattern with clear separation of concerns across distinct layers.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Express Routes Layer                │
│  (Route definitions & HTTP handling)        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Middleware Layer                       │
│  (Auth, Validation, Error Handling, Logging)│
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Controller Layer                       │
│  (HTTP request/response handling)           │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Service Layer                          │
│  (Business logic & orchestration)           │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Repository Layer                       │
│  (Data access & queries)                    │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Database Layer                         │
│  (SQLite + Prisma ORM)                      │
└─────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Routes Layer (`src/routes/`)

**Purpose**: Define API endpoints and map to controllers

**Files**:
- `user.routes.ts` - User authentication and management endpoints
- `record.routes.ts` - Financial records and dashboard endpoints

**Responsibilities**:
- Define HTTP paths
- Specify HTTP methods (GET, POST, PUT, DELETE)
- Attach middleware (auth, validation)
- Map to controller methods
- Include Swagger documentation

**Example**:
```typescript
router.post(
  '/',
  authMiddleware,           // Authentication middleware
  validateRequest(schema),  // Validation middleware
  controller.create         // Controller method
);
```

---

### 2. Middleware Layer (`src/middleware/`)

**Purpose**: Cross-cutting concerns for request processing

**Files**:
- `auth.middleware.ts` - JWT token verification and role-based access control
- `validation.middleware.ts` - Request/query validation using Zod
- `error.middleware.ts` - Centralized error handling and response formatting

**Key Middleware**:

#### Authentication Middleware
```typescript
export const authMiddleware = async (req, res, next) => {
  // Extract and verify JWT token
  // Attach user info to request
  // Pass to next middleware
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user role is in allowed list
    // Throw ForbiddenError if not authorized
  };
};
```

#### Error Handler
```typescript
export const errorHandler = (error, req, res, next) => {
  // Catch all errors from routes
  // Convert to appropriate HTTP response
  // Return standardized error response
};
```

---

### 3. Controller Layer (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses

**Files**:
- `user.controller.ts` - User-related request handlers
- `record.controller.ts` - Financial record request handlers

**Responsibilities**:
- Extract request data (body, params, query)
- Call appropriate service methods
- Handle response formatting
- Delegate to error handler on errors

**Pattern**:
```typescript
export class UserController {
  register = asyncHandler(async (req, res) => {
    const input = req.body;
    const result = await userService.register(input);
    return successResponse(res, 201, result);
  });
}
```

**Why this layer exists**:
- Controllers are "thin" - minimal logic
- Keeps HTTP concerns separate from business logic
- Easy to test with mocked services
- Can be reused for different protocols (GraphQL, gRPC, etc.)

---

### 4. Service Layer (`src/services/`)

**Purpose**: Implement business logic and orchestration

**Files**:
- `user.service.ts` - User business logic (registration, authentication, authorization)
- `record.service.ts` - Financial record business logic (CRUD, analytics)

**Responsibilities**:
- Implement core business logic
- Validate business rules
- Orchestrate multiple repository calls
- Throw application-specific errors
- Maintain data consistency

**Example - User Registration**:
```typescript
async register(input: RegisterInput) {
  // 1. Check if email exists (repository call)
  const existing = await userRepository.findByEmail(input.email);
  if (existing) throw new ConflictError('Email taken');
  
  // 2. Hash password (utility)
  const hashedPassword = await bcrypt.hash(input.password, 10);
  
  // 3. Create user (repository call)
  const user = await userRepository.create({
    ...input,
    password: hashedPassword
  });
  
  // 4. Generate token (utility)
  const token = generateToken({ id: user.id, ... });
  
  // 5. Return result
  return { user, token };
}
```

**Why this layer exists**:
- Business logic is testable without HTTP context
- Easy to reuse logic across controllers
- Can be used by multiple interfaces
- Centralizes domain rules

---

### 5. Repository Layer (`src/repositories/`)

**Purpose**: Abstract database access

**Files**:
- `user.repository.ts` - User data access
- `record.repository.ts` - Financial record data access

**Responsibilities**:
- Execute database queries
- Transform data from database format
- Implement query building logic
- Handle database-specific operations (soft deletes, indexes)

**Example - User Repository**:
```typescript
async findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async create(data: UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}

async softDelete(id: string): Promise<User | null> {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}
```

**Why this layer exists**:
- Centralizes all database queries
- Easy to swap database implementation
- Consistent query patterns
- Easier to optimize/debug queries

---

### 6. Database Layer (`prisma/`)

**Purpose**: Define data models and migrations

**Files**:
- `schema.prisma` - Database schema definition
- `seed.ts` - Sample data seeding

**Key Concepts**:

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  role      Role       @default(VIEWER)
  isActive  Boolean    @default(true)
  deletedAt DateTime?  // Soft delete support
  records   FinancialRecord[]  // Relationship
  
  @@map("users")  // Actual table name
}

model FinancialRecord {
  id        String     @id @default(cuid())
  amount    Float
  type      RecordType
  createdBy String
  user      User       @relation(fields: [createdBy], references: [id])
  
  @@index([createdBy])  // Database index for performance
  @@index([date])       // Optimize date range queries
}
```

**Why Prisma**:
- Type-safe database queries
- Automatic migrations
- Visual Studio (Prisma Studio) for data management
- Works with multiple databases

---

### 7. Utilities & Helpers (`src/utils/`)

**Purpose**: Shared utilities across the application

**Files**:
- `jwt.ts` - JWT token generation/verification
- `errors.ts` - Custom error classes
- `logger.ts` - Application logging
- `database.ts` - Prisma client initialization

**Error Hierarchy**:
```typescript
AppError (base)
├── ValidationError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ConflictError (409)
└── InternalServerError (500)
```

---

### 8. Schemas (`src/schemas/`)

**Purpose**: Define validation schemas using Zod

**Files**:
- `user.schema.ts` - User input validation
- `record.schema.ts` - Record input validation

**Example**:
```typescript
export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime().or(z.date()),
  notes: z.string().optional()
});
```

**Benefits**:
- Runtime validation
- Type inference from schemas
- Automatic error messages
- Single source of truth for data shape

---

## Data Flow Example

### POST /api/records (Create Financial Record)

```
1. REQUEST ARRIVES
   └─ POST /api/records
   └─ Headers: Authorization, Content-Type
   └─ Body: { amount: 5000, type: "INCOME", ... }

2. MIDDLEWARE CHAIN
   ├─ authMiddleware
   │  └─ Extracts JWT token
   │  └─ Verifies and decodes
   │  └─ Attaches user info to request
   ├─ validateRequest(createFinancialRecordSchema)
   │  └─ Validates request body against schema
   │  └─ Returns zod errors if invalid
   └─ Next

3. CONTROLLER
   └─ recordController.createRecord()
   ├─ Extracts user ID from req.user
   ├─ Extracts data from req.body
   └─ Calls recordService.createRecord()

4. SERVICE
   └─ recordService.createRecord(userId, input)
   ├─ Normalizes input (date parsing)
   ├─ Calls recordRepository.create()
   └─ Returns created record

5. REPOSITORY
   └─ recordRepository.create(data)
   ├─ Calls prisma.financialRecord.create()
   ├─ Executes INSERT query
   └─ Returns database record

6. DATABASE
   └─ SQLite executes INSERT
   └─ Returns new record with ID

7. RESPONSE CHAIN (unwinding)
   └─ Repository returns record to Service
   └─ Service returns record to Controller
   └─ Controller calls successResponse()
   └─ Response middleware formats
   └─ 201 Created response sent to client

8. RESPONSE BODY
   {
     "success": true,
     "data": { id, amount, type, ... },
     "timestamp": "2024-01-15T10:35:00Z"
   }
```

---

## Error Handling Flow

### Example: Invalid Token

```
1. REQUEST ARRIVES
   └─ GET /api/users/profile
   └─ Headers: Authorization: Bearer invalid-token

2. MIDDLEWARE
   └─ authMiddleware
   ├─ Extracts token
   └─ Calls verifyToken(token)
   └─ Throws UnauthorizedError("Invalid token")

3. ERROR CAUGHT
   └─ asyncHandler catches error
   └─ Passes to errorHandler middleware

4. ERROR RESPONSE
   └─ errorHandler checks error type
   └─ Formats error response
   └─ 401 status sent

5. RESPONSE BODY
   {
     "success": false,
     "error": {
       "message": "Invalid or expired token"
     },
     "timestamp": "2024-01-15T10:35:00Z"
   }
```

---

## Dependency Injection Pattern

The application uses a simple singleton pattern for dependency injection:

```typescript
// Repositories
export default new UserRepository();
export default new FinancialRecordRepository();

// Services
export default new UserService();
export default new RecordService();

// Controllers
export default new UserController();
export default new RecordController();

// In route files
import userService from '@/services/user.service';
import userController from '@/controllers/user.controller';
```

**Benefits**:
- Services can be easily mocked in tests
- Single instance per service (memory efficient)
- Easy to trace dependencies

---

## Database Design

### User Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- CUID
  email TEXT UNIQUE NOT NULL,    -- Unique constraint
  password TEXT NOT NULL,        -- Hashed with bcrypt
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role TEXT DEFAULT 'VIEWER',    -- ADMIN, ANALYST, VIEWER
  isActive BOOLEAN DEFAULT true, -- Activation flag
  deletedAt DATETIME,            -- Soft delete timestamp
  createdAt DATETIME DEFAULT NOW,
  updatedAt DATETIME DEFAULT NOW
);
```

### Financial Records Table

```sql
CREATE TABLE financial_records (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,          -- Store as REAL for SQLite
  type TEXT,                     -- INCOME or EXPENSE
  category TEXT NOT NULL,
  date DATETIME NOT NULL,
  notes TEXT,
  createdBy TEXT NOT NULL,       -- FK to users.id
  deletedAt DATETIME,            -- Soft delete
  createdAt DATETIME DEFAULT NOW,
  updatedAt DATETIME DEFAULT NOW,
  
  FOREIGN KEY (createdBy) REFERENCES users(id),
  INDEX idx_createdBy (createdBy),
  INDEX idx_date (date),
  INDEX idx_type (type)
);
```

### Indexes for Performance

- `createdBy` - Filter records by user
- `date` - Range queries and sorting
- `type` - Filter by INCOME/EXPENSE
- `category` - Filter by category

---

## Validation Strategy

### Three-Layer Validation

1. **Schema Validation** (Zod)
   - Request body/query shape
   - Data type validation
   - Format validation (email, datetime)

2. **Business Logic Validation** (Service)
   - Business rules (email uniqueness)
   - State validation (user active)
   - Authorization rules

3. **Database Constraints**
   - Unique constraints
   - Foreign key constraints
   - Data integrity

---

## Testing Strategy

### Unit Tests (Service Layer)

```typescript
describe('UserService', () => {
  it('should register user with valid input', async () => {
    const input = { email: 'test@example.com', ... };
    const result = await userService.register(input);
    expect(result.user.email).toBe('test@example.com');
  });
  
  it('should throw ConflictError for existing email', async () => {
    await expect(userService.register(input))
      .rejects
      .toThrow(ConflictError);
  });
});
```

### Integration Tests (Repository Layer)

```typescript
describe('UserRepository', () => {
  it('should create user in database', async () => {
    const user = await userRepository.create({...});
    expect(user.id).toBeDefined();
  });
});
```

### API Tests (Controller + Route)

```typescript
describe('POST /api/users/register', () => {
  it('should return 201 with token', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({...});
    
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
  });
});
```

---

## Scaling Considerations

### Current Implementation (Suitable for)
- Small to medium projects
- Single server deployment
- SQLite for prototyping

### Future Scaling

1. **Database Switch**
   - PostgreSQL for better performance
   - Just update `DATABASE_URL` and schema provider

2. **Caching Layer**
   - Redis for frequently accessed data
   - Reduce database load

3. **Message Queue**
   - Background jobs for email, reporting
   - Bull or RabbitMQ

4. **Microservices**
   - Extract services into separate modules
   - API Gateway pattern

5. **API Versioning**
   - `/api/v1/`, `/api/v2/` routes
   - Backward compatibility

---

## Configuration Management

Environment-based configuration:

```
Development (.env)
├─ DATABASE_URL = file:./dev.db
├─ LOG_LEVEL = debug
├─ CORS_ORIGIN = http://localhost:3000
└─ Node.js nodemon for auto-reload

Staging (.env.staging)
├─ DATABASE_URL = postgresql://...
├─ LOG_LEVEL = info
└─ CORS_ORIGIN = https://staging.example.com

Production (.env.production)
├─ DATABASE_URL = postgresql://...
├─ LOG_LEVEL = warn
└─ CORS_ORIGIN = https://example.com
```

---

## Summary

This architecture provides:

✅ **Separation of Concerns** - Each layer has clear responsibility
✅ **Testability** - Easy to unit test each layer independently
✅ **Maintainability** - Clear code organization and patterns
✅ **Scalability** - Easy to add features without affecting existing code
✅ **Reusability** - Services can be used by multiple controllers
✅ **Security** - Centralized auth, validation, and error handling
✅ **Performance** - Database indexes, query optimization
✅ **Documentation** - Self-documenting code structure

This is considered a "best practice" architecture for REST APIs.
