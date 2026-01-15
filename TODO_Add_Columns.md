# TODO - Add New Columns to Employees Section

## Task: Add Billable Type, Start Date, and Tenure columns to the employees webpage

---

### Backend Changes

- [x] 1. Update EmployeeController.java - convertToResponse() method to include billableStatus, startDate, and tenure
- [x] 2. Update EmployeeController.java - createEmployee() to handle billableStatus and startDate
- [x] 3. Update EmployeeController.java - updateEmployee() to handle billableStatus and startDate
- [x] 4. Create database migration V6 to add billing_type, start_date, and tenure columns to employees table
- [x] 5. Update Employee.java entity to include billingType and tenure fields with getters/setters

### Frontend Changes

- [x] 6. Update Employees.jsx - Add three new columns to table header
- [x] 7. Update Employees.jsx - Add cells to display billableType, startDate, tenure for each employee
- [x] 8. Update Employees.jsx - Update Add Employee modal with Billable Type and Start Date fields
- [x] 9. Update Employees.jsx - Update Edit Employee modal with Billable Type and Start Date fields
- [x] 10. Make Employee ID field editable in Add and Edit Employee modals
- [x] 11. Ensure all input fields have proper name attributes

---

## Progress

### Backend

- [x] EmployeeController.java updated
- [x] Database migration V6 created with billing_type, start_date, and tenure columns
- [x] Employee.java entity updated with billingType and tenure fields

### Frontend

- [x] Employees.jsx table updated with new columns
- [x] Employees.jsx modals updated with new fields
- [x] Employee ID field is now editable in both Add and Edit modals
- [x] All input fields have proper name attributes (empId, name, project, employeeRole, billableStatus, startDate)

---

## Database Changes (V6 Migration)

The following columns are added to the employees table:

1. **billing_type** (VARCHAR 20) - Stores "Billable" or "Non-Billable"
2. **start_date** (DATE) - Stores employee start date
3. **tenure** (VARCHAR 50) - Stores calculated tenure (e.g., "1 years 4 months")

### Sample Data Updates

All existing employees are updated with:

- EMP001: Billable, start_date: 2023-01-15
- EMP002: Billable, start_date: 2023-02-20
- EMP003: Non-Billable, start_date: 2023-03-10
- EMP004: Non-Billable, start_date: 2023-04-05
- EMP005: Billable, start_date: 2023-05-18
- EMP006: Billable, start_date: 2023-06-25
- EMP007: Non-Billable, start_date: 2023-07-30
- EMP008: Billable, start_date: 2023-08-12

---

## Notes

- Billable Type: Boolean field (true/false or Billable/Non-Billable)
- Start Date: Date field (LocalDate)
- Tenure: Calculated field showing years/months since start date
- Employee ID: Now editable in both Add and Edit forms
- All form inputs have proper name attributes for form handling
