# TODO: Multiple Projects per Employee Implementation

## Phase 1: Database Changes

- [ ] Create SQL migration script for employee_projects junction table
- [ ] Create migration to remove project column from employees table

## Phase 2: Backend Entity Changes

- [ ] Create EmployeeProject entity (junction table model)
- [ ] Update Employee entity to use @ManyToMany with Project
- [ ] Update Project entity to use @ManyToMany with Employee
- [ ] Update EmployeeRepository to handle the relationship
- [ ] Create EmployeeProjectRepository

## Phase 3: Backend Controller & Service Updates

- [ ] Update EmployeeController to handle multiple projects
- [ ] Add API endpoints for employee-project assignments
- [ ] Update DTOs (EmployeeRequest, EmployeeResponse) for multiple projects

## Phase 4: Frontend Changes

- [ ] Update Add Employee modal to support multi-select projects
- [ ] Update Edit Employee modal to support multi-select projects
- [ ] Update Employees table to display all projects per employee
- [ ] Update EmployeeService.js

## Phase 5: Testing

- [ ] Test adding employee with multiple projects
- [ ] Test editing employee projects
- [ ] Test employee list displays all projects
