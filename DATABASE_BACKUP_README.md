# Database Backup - Spine Project

## Backup File

- **Location**: `/Users/saurabhbode/Documents/Project_Spine/spine_database_backup_20260123_003840.sql`
- **Size**: 17KB
- **Date**: January 23, 2026

## Database Information

- **Database Name**: `spine`
- **Database Type**: MySQL 9.5.0
- **Tables Included**:
  - `users` - User accounts and authentication
  - `finance_roles` - Financial role definitions
  - `employees` - Employee information
  - `employee_roles` - Employee role assignments
  - `projects` - Project data
  - `project_category` - Project categories
  - `permissions` - System permissions
  - `role_permissions` - Role-permission mappings
  - `employee_projects` - Employee-project allocations

## How to Import to Another MySQL Database

### Option 1: Using MySQL Command Line

1. **Create the database on the target system**:

   ```sql
   CREATE DATABASE spine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Import the backup**:

   ```bash
   mysql -u root -p spine < spine_database_backup_20260123_003840.sql
   ```

   Or if the database doesn't exist yet:

   ```bash
   mysql -u root -p < spine_database_backup_20260123_003840.sql
   ```

### Option 2: Using MySQL Workbench/GUI Tools

1. Open MySQL Workbench or your preferred GUI tool
2. Connect to your target MySQL server
3. Create a new database named `spine`
4. Right-click on the database → "Import Data"
5. Select the SQL file: `spine_database_backup_20260123_003840.sql`
6. Execute the import

### Option 3: Using phpMyAdmin

1. Access phpMyAdmin on your target server
2. Create a new database named `spine`
3. Select the database → Click "Import" tab
4. Choose the SQL file: `spine_database_backup_20260123_003840.sql`
5. Click "Go" to import

## Important Notes

- **GTID Information**: This backup includes GTID (Global Transaction ID) information. If you're importing to a database with GTIDs enabled, the import will maintain transaction consistency.
- **Foreign Key Constraints**: The backup includes foreign key constraints. Make sure the tables are imported in the correct order or disable foreign key checks during import if needed:

  ```sql
  SET FOREIGN_KEY_CHECKS=0;
  -- Import here
  SET FOREIGN_KEY_CHECKS=1;
  ```

- **Password Encoding**: User passwords are encrypted using Spring Security BCrypt encoder. They will work with the application as-is.

## Creating a New Backup

To create a fresh backup in the future:

```bash
mysqldump -u root spine > spine_database_backup_$(date +%Y%m%d_%H%M%S).sql
```

## Backup File Structure

The SQL file contains:

- Database schema (CREATE TABLE statements)
- All table data (INSERT statements)
- Indexes and constraints
- GTID information for replication consistency

## Troubleshooting

### "Access denied" Error

Make sure you have the correct MySQL credentials:

```bash
mysql -u root -p -e "SHOW DATABASES"
```

### "Unknown database" Error

Create the database first before importing:

```sql
CREATE DATABASE spine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Character Encoding Issues

If you experience character encoding problems, ensure your MySQL connection uses UTF-8:

```bash
mysqldump -u root --default-character-set=utf8mb4 spine > spine_backup.sql
```

## Next Steps

1. Copy the backup file to your target system
2. Follow the import instructions above
3. Update the `application.properties` file on the target system to point to the new database
4. Test the application connectivity

## Support

For issues with the backup or import process, refer to:

- MySQL Documentation: https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html
- Project README for application-specific configuration
