# Multi-Department Account Linking System Implementation

## Overview

Implement a system where the same person can have accounts in multiple departments (Finance, Operations, Trace Sheets) with different login credentials for Finance Operations and Trace Sheets, but with a way to link accounts belonging to the same person.

## Implementation Steps

### Database Layer

- [x] V3\_\_Add_account_linking_fields.sql - Add person_id, is_primary_account, linked_accounts fields
- [x] Update User entity with linking fields and methods
- [ ] Create repository methods for account linking queries

### Backend Layer

- [x] Create AccountLinkingRequest DTO
- [x] Create AccountLinkingResponse DTO
- [x] Create CreateLinkedAccountRequest DTO
- [x] Create CreateLinkedAccountResponse DTO
- [x] Update AuthService with linking methods:
  - [x] linkExistingAccounts()
  - [x] createLinkedAccount()
  - [x] getMyAccounts()
  - [x] validateAccountLinking()
- [x] Add new controller endpoints:
  - [x] POST /api/auth/link-accounts
  - [x] POST /api/auth/create-linked-account
  - [x] GET /api/auth/my-accounts
  - [x] GET /api/auth/validate-linking
- [x] Add repository methods for account linking queries
- [x] Update AuthService login logic to handle department-specific credentials

### Frontend Layer

- [x] Update AuthService.js with new methods:
  - [x] linkAccounts()
  - [x] createLinkedAccount()
  - [x] getMyAccounts()
  - [x] validateAccountLinking()
- [x] Create AccountManagement component with full UI
- [ ] Update Signup component with linking options
- [ ] Update Login component with department selection
- [ ] Add account management route to app

### Testing

- [ ] Test database migration
- [ ] Test backend endpoints
- [ ] Test frontend account linking
- [ ] Test login flows with different departments
- [ ] Test account creation and linking workflows

## Key Features

1. **Account Linking**: Link existing accounts to same person_id
2. **Department-Specific Credentials**: Different login credentials for Finance Operations vs Trace Sheets
3. **Shared Personal Data**: Same personal info across all linked accounts
4. **Account Management UI**: Easy interface to manage linked accounts
5. **Seamless Login**: Department selection during login process

## Technical Notes

- person_id: Unique identifier for linking accounts
- is_primary_account: Marks account with master personal information
- linked_accounts: JSON field storing relationship data
- Frontend maintains user context across department switches
