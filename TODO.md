# Project Type Filter Fix

## Goal

Fix the "Contingency-Based" and "FTE-Based" filter buttons so they properly filter projects by their projectType.

## Root Cause

The filter buttons are implemented correctly, but projects are created without a `projectType` value because:

1. The `ProjectRequest.java` DTO is missing the `projectType` field
2. The frontend doesn't have a dropdown to select project type when creating/editing projects

## Tasks

### Backend Changes

- [ ] 1. Add `projectType` field to `ProjectRequest.java` DTO with getter/setter

### Frontend Changes

- [ ] 2. Add `projectType` to the `newProject` state in `FinanceManagerDashboard.jsx` (default: "FTE")
- [ ] 3. Add a project type dropdown in Add Project modal
- [ ] 4. Add a project type dropdown in Edit Project modal
- [ ] 5. Include `projectType` in the `handleAddProject` API call
- [ ] 6. Include `projectType` in the `handleUpdateProject` API call
- [ ] 7. Populate `projectType` in `handleEditProject` when loading project data

## Files to Modify

- `/Users/saurabhbode/Documents/Project_Spine/Backend/src/main/java/com/invoicingproject/spine/dto/ProjectRequest.java`
- `/Users/saurabhbode/Documents/Project_Spine/src/components/dashboard/FinanceManagerDashboard.jsx`
