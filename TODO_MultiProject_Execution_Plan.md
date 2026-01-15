# Multi-Project Employee Implementation - Execution Plan

## Phase 1: Database Migration ✅ COMPLETED

- [x] 1. Run V7 SQL migration to create employee_projects junction table
- [x] 2. Verify table was created and data copied (6 records created)

## Phase 2: Frontend Updates - IN PROGRESS

### 2.1 Update State Management

- [ ] Add `selectedProjects` state for new employee form
- [ ] Add `editingSelectedProjects` state for edit employee form

### 2.2 Update Add Employee Modal

- [ ] Change single project dropdown to multi-select
- [ ] Add handler for multi-select project changes
- [ ] Include `projectIds` array in employee data sent to API

### 2.3 Update Edit Employee Modal

- [ ] Change single project dropdown to multi-select
- [ ] Pre-populate selected projects from `editingEmployee.projectIds`
- [ ] Include `projectIds` array in employee data sent to API

### 2.4 Update Employees Table Display

- [ ] Display all projects for each employee (comma-separated from `employee.projects`)
- [ ] Handle employees with no projects (fallback to "No Project")

### 2.5 Update Filter Logic

- [ ] Update project filter to check if employee has any of the selected project
- [ ] Handle "Trainee" and "No Project" filters correctly

### 2.6 Update EmployeeService.js

- [ ] Verify service is compatible with backend API (passes arrays)

## Phase 3: Testing

- [ ] Test adding employee with multiple projects
- [ ] Test editing employee projects
- [ ] Test employee list displays all projects correctly
- [ ] Test filtering works with multiple projects

## Implementation Details

### State Changes Needed:

```javascript
// In newEmployee state (for add modal)
const [newEmployee, setNewEmployee] = useState({
  empId: "",
  name: "",
  project: "", // Keep for backward compatibility
  projectType: "",
  employeeRole: "",
  billableStatus: null,
  startDate: "",
  projectIds: [], // NEW: array of selected project IDs
});

// NEW: Selected projects state for add modal
const [selectedProjects, setSelectedProjects] = useState([]);

// In editingEmployee state (for edit modal)
const [editingEmployee, setEditingEmployee] = useState({
  // ... existing fields
  projectIds: [], // NEW: array of selected project IDs
});

// NEW: Selected projects state for edit modal
const [editingSelectedProjects, setEditingSelectedProjects] = useState([]);
```

### API Payload Format:

```javascript
{
  empId: "EMP001",
  name: "John Doe",
  project: "Project Alpha, Project Beta", // comma-separated for backward compatibility
  projectIds: [1, 2],  // array of project IDs for junction table
  // ... other fields
}
```

### Table Display Change:

```javascript
// From:
<td>{employee.project || 'N/A'}</td>

// To:
<td>
  {employee.projects && employee.projects.length > 0
    ? employee.projects.join(", ")
    : (employee.project || 'N/A')}
</td>
```
