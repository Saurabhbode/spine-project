# TODO: Set Default FTE Value to Zero

## Objective

Ensure that in FTE invoice, by default the value in the FTE column must be zero.

## Changes Required

### FinanceManagerDashboard.jsx

- [x] Identify the issue location in `openFTEInvoice` function
- [ ] Change default FTE value from `1.0` to `0`
- [ ] Verify the change is correct

## Implementation

### Issue Location

- File: `src/components/dashboard/FinanceManagerDashboard.jsx`
- Function: `openFTEInvoice`
- Current line:
  ```javascript
  fte: parseFloat(emp.fteValue) || parseFloat(emp.numberOfFTEs) || 1.0,
  ```

### Change Required

Change the default fallback value from `1.0` to `0`:

```javascript
fte: parseFloat(emp.fteValue) || parseFloat(emp.numberOfFTEs) || 0,
```

## Progress

- [x] Code analysis completed
- [x] Implementation completed
- [x] Change verified

## Verification

The change has been successfully applied:

- File: `src/components/dashboard/FinanceManagerDashboard.jsx`
- Line changed: Default FTE value from `1.0` to `0`
- The FTEInvoice component already handles `0` values correctly in display (shows `0.00`)

## Notes

- The FTEInvoice component already handles `0` values correctly in the display (shows `0.00`)
- This change will affect new FTE invoice allocations - they will start at 0 instead of 1
- Users can still edit the FTE values as needed after the invoice is opened
