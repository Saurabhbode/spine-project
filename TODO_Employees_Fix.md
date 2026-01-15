# TODO: Fix Employees Table Display for Billing Type, Start Date, and Tenure

## Issue

The employees table is not properly displaying billing type, start date, and tenure fields.

## Plan

1. Add a new "Billing Type" column in the table to show `billingType` field from backend
2. Keep existing "Billable Type" column for `billableStatus` (boolean display)
3. Fix `startDate` display with proper formatting
4. Fix `tenure` display with proper formatting
5. Add `billingType` field to Add Employee Modal
6. Add `billingType` field to Edit Employee Modal

## Progress

- [x] 1. Add "Billing Type" column to the table
- [x] 2. Fix startDate display formatting
- [x] 3. Fix tenure display formatting
- [x] 4. Add billingType to Add Employee Modal
- [x] 5. Add billingType to Edit Employee Modal
- [x] 6. Update newEmployee state to include billingType
- [x] 7. Update editingEmployee state handling for billingType

## Status: COMPLETED ✓
