#!/bin/bash

# Script to initialize RBAC schema in Spine database
# Usage: ./run_db_init.sh [password]

DB_NAME="spine"
DB_USER="root"
DB_HOST="localhost"
DB_PORT="3306"
SQL_FILE="init_rbac_schema.sql"

# Get password from argument or prompt
if [ -n "$1" ]; then
    DB_PASSWORD="$1"
    MYSQL_CMD="mysql -u${DB_USER} -p${DB_PASSWORD} -h${DB_HOST} -P${DB_PORT}"
else
    echo "Enter MySQL password for user '${DB_USER}':"
    read -s DB_PASSWORD
    echo ""
    MYSQL_CMD="mysql -u${DB_USER} -p${DB_PASSWORD} -h${DB_HOST} -P${DB_PORT}"
fi

echo "============================================"
echo "Initializing RBAC Schema for Spine Database"
echo "============================================"
echo "Database: ${DB_NAME}"
echo "Host: ${DB_HOST}:${DB_PORT}"
echo ""

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Warning: MySQL may not be running. Please ensure MySQL is started."
    echo ""
fi

# Execute the SQL script
echo "Executing ${SQL_FILE}..."
${MYSQL_CMD} ${DB_NAME} < ${SQL_FILE}

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================"
    echo "SUCCESS: RBAC Schema initialized successfully!"
    echo "============================================"
    echo ""
    echo "Tables created:"
    ${MYSQL_CMD} -e "SHOW TABLES LIKE 'finance_roles'; SHOW TABLES LIKE 'permissions'; SHOW TABLES LIKE 'role_permissions';" ${DB_NAME}
    echo ""
    echo "Roles created:"
    ${MYSQL_CMD} -e "SELECT id, role_name, role_description FROM finance_roles;" ${DB_NAME}
    echo ""
    echo "Permissions created:"
    ${MYSQL_CMD} -e "SELECT id, permission_name, resource, action FROM permissions;" ${DB_NAME}
    echo ""
else
    echo ""
    echo "============================================"
    echo "ERROR: Failed to initialize RBAC Schema"
    echo "============================================"
    exit 1
fi

