# TODO: Remove Hardcoded FTE Invoice Entries

## Objective

Remove hardcoded entries from FTE invoice to make it dynamic.

## Changes Required

### FinanceManagerDashboard.jsx

- [x] Add state variables for FTE invoice data (fteMonth, fteYear, fteSummaryData, fteAllocationData)
- [x] Replace hardcoded values in FTEInvoice component call with dynamic state variables
- [x] Update openFTEInvoice function to fetch/load dynamic data

## Progress

- [x] Complete implementation
- [ ] Verify changes work correctly

## Notes

- The FTEInvoice component is now fully dynamic and receives data via props from state variables
- TODO comments added in `openFTEInvoice` function indicating where API calls should be made
- The component is initialized with empty data until the backend is connected
- FTE_invoice.html remains as a reference/template file with hardcoded data for documentation purposes
