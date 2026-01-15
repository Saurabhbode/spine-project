# TODO: Remove Billing Type from Employees.jsx

## Task: Remove billing type from employee management (table, edit modal, add modal)

### Steps:

- [x] 1. Remove "Billing Type" column from table header
- [x] 2. Remove "Billing Type" data cell from table body row
- [x] 3. Remove "Billing Type" input field from Edit Employee Modal
- [x] 4. Remove billingType from handleUpdateEmployee function
- [x] 5. Updated colSpan values from 10 to 9
- [x] 6. Remove "Billing Type" input field from Add Employee Modal
- [x] 7. Remove billingType from newEmployee state initialization
- [x] 8. Remove billingType from handleAddEmployee function
- [x] 9. Remove billingType from openAddEmployeeModal function
- [x] 10. Remove billingType from closeAddEmployeeModal function
- [x] 11. Fix date parsing issue - Added @JsonFormat(pattern = "yyyy-MM-dd") to EmployeeRequest and Employee entity

### Changes Summary:

- Table header: Removed `<th>Billing Type</th>` column, restored `<th>Billable Type</th>` column
- Table body: Removed Billing Type data cell from each row
- Edit Modal: Removed entire "Billing Type" input-group div
- Add Modal: Removed entire "Billing Type" input-group div
- handleUpdateEmployee: Removed `billingType: editingEmployee.billingType` from employeeData
- handleAddEmployee: Removed `billingType: newEmployee.billingType` from employeeData
- newEmployee state: Removed billingType from initial state
- openAddEmployeeModal: Removed billingType from state reset
- closeAddEmployeeModal: Removed billingType from state reset
- colSpan: Updated from 10 to 9 in loading/no data rows
- Backend fix: Added `@JsonFormat(pattern = "yyyy-MM-dd")` to LocalDate fields for proper date parsing

### Notes:

- Billable Type column is preserved in table, modals, and functions
- All billingType references completely removed from the codebase
- Date fields now properly parse with @JsonFormat annotation

### Final Table Columns (9 total):

1. Emp ID
2. Name
3. Project
4. Type (Project Type)
5. Employee Role
6. Billable Type
7. Start Date
8. Tenure
9. Actions
