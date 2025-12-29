# Database Schema Change Plan - Remove Linked Account, Add Role

## Changes Required

### 1. User Entity Updates ✅ COMPLETED

- **Removed**: `personId` field and getter/setter
- **Removed**: `isPrimaryAccount` field and getter/setter
- **Added**: `role` field with string values (USER, ADMIN, etc.)
- **Added**: Role-based access control methods

### 2. Database Migration ✅ COMPLETED

- **Created**: `V4__Remove_account_linking_add_role.sql`
- **Actions**: Drop columns: `person_id`, `is_primary_account`
- **Added**: `role` column (VARCHAR with default value 'USER')
- **Created**: Index on role column

### 3. Code Updates ✅ COMPLETED

- Updated User entity constructors
- Replaced account linking methods with role-based methods
- Added admin/user role checking methods

## Migration Script Created ✅

```sql
-- Remove account linking columns
ALTER TABLE users DROP COLUMN person_id;
ALTER TABLE users DROP COLUMN is_primary_account;

-- Add role column
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';

-- Create index for role
CREATE INDEX idx_role ON users (role);
```

## Role Options

- USER (default)
- ADMIN
- MANAGER
- Any custom roles as needed

## Implementation Status ✅ COMPLETED

### 1. User Entity Updates ✅ COMPLETED

- **Removed**: `personId` field and getter/setter
- **Removed**: `isPrimaryAccount` field and getter/setter
- **Added**: `role` field with string values (USER, ADMIN, etc.)
- **Added**: Role-based access control methods (`isAdmin()`, `isUser()`, etc.)
- **Converted**: From JPA entity to plain POJO for JDBC usage

### 2. Database Migration ✅ COMPLETED

- **Created**: `V4__Remove_account_linking_add_role.sql`
- **Actions**: Drop columns: `person_id`, `is_primary_account`
- **Added**: `role` column (VARCHAR with default value 'USER')
- **Created**: Index on role column

### 3. DTO Updates ✅ COMPLETED

- **Updated**: `CreateLinkedAccountRequest.java` - removed personId, added role
- **Updated**: `AccountLinkingResponse.java` - converted to role-based response

### 4. Repository Updates ✅ COMPLETED

- **Completely Rewritten**: `UserRepository.java` - from JPA to JDBC
- **Added**: Direct SQL queries using JdbcTemplate
- **Added**: Role-based queries (`findByRole`, `findAdminUsers`, etc.)
- **Added**: Role management methods (`updateUserRole`)
- **Added**: CRUD operations with manual SQL statements

### 5. Service Layer ✅ COMPLETED

- **Completely Rewritten**: `AuthService.java`
- **Removed**: All account linking methods
- **Added**: Role-based user management
- **Added**: Admin functionality for user role management
- **Added**: Permission-based access control
- **Fixed**: Map.of() compilation errors using HashMap

### 6. Configuration ✅ COMPLETED

- **Flyway**: Enabled in application.properties
- **JPA**: Disabled (set to none) for pure JDBC approach
- **Hibernate**: Disabled automatic DDL

## Migration Script Created ✅

```sql
-- Remove account linking columns
ALTER TABLE users DROP COLUMN person_id;
ALTER TABLE users DROP COLUMN is_primary_account;

-- Add role column
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';

-- Create index for role
CREATE INDEX idx_role ON users (role);
```

## Role System Implemented

- **USER** (default)
- **ADMIN** (full access)
- **MANAGER** (middle tier access)
- **Department-based** permissions still work alongside roles

## Next Steps

1. ~~Enable Flyway~~ ✅ COMPLETED - Flyway now enabled in application.properties
2. **Test Migration**: Start server to apply V4 migration
3. **Verify Schema**: Check database structure after migration
4. **Update Frontend**: Update React components to use new role-based API
