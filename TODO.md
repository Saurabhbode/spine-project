# Project Type Filter Fix

## Goal

Fix the "Contingency-Based" and "FTE-Based" filter buttons so they properly filter projects by their projectType.

## Root Cause

The filter buttons are implemented correctly, but projects are created without a `projectType` value because:

1. The `ProjectRequest.java` DTO is missing the `projectType` field
2. The frontend doesn't have a dropdown to select project type when creating/editing projects

## Tasks

### Backend Changes

- [x] 1. Add `projectType` field to `ProjectRequest.java` DTO with getter/setter

### Frontend Changes (FinanceManagerDashboard)

- [x] 2. Add `projectType` to the `newProject` state in `FinanceManagerDashboard.jsx` (default: "FTE")
- [x] 3. Add a project type dropdown in Add Project modal
- [x] 4. Add a project type dropdown in Edit Project modal
- [x] 5. Include `projectType` in the `handleAddProject` API call
- [x] 6. Include `projectType` in the `handleUpdateProject` API call
- [x] 7. Populate `projectType` in `handleEditProject` when loading project data

### Frontend Changes (Employees Page)

- [x] 8. Add `projectTypeFilter` state to Employees.jsx
- [x] 9. Update `getFilteredEmployees()` to filter by project type
- [x] 10. Add project type filter buttons (All Types, Contingency, FTE)
- [x] 11. Add Project Type column to employees table
- [x] 12. Display project type badge with color coding (FTE: blue, Contingency: orange)

## Status: ✅ COMPLETED

All implementation tasks have been completed. The project type filter is now fully functional on both the Finance Manager Dashboard and the Employees page.

## Files Modified

- `/Users/saurabhbode/Documents/Project_Spine/Backend/src/main/java/com/invoicingproject/spine/dto/ProjectRequest.java`
- `/Users/saurabhbode/Documents/Project_Spine/src/components/dashboard/FinanceManagerDashboard.jsx`
- `/Users/saurabhbode/Documents/Project_Spine/src/components/dashboard/Employees.jsx`
