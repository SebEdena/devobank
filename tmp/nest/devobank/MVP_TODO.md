# Devobank MVP Todo

## 1. Auth and Account Setup

- [ ] Define the Identity and Ledger bounded contexts and keep their models separate.
- [x] Implement signup use case with email and password validation.
- [x] Hash passwords before persisting users.
- [ ] Create a bank account automatically when a new customer signs up.
- [ ] Add a query to see my account details and current balance.
- [ ] Add unit tests for signup, signin, and account creation flows.

## 2. Internal Account Transfers

- [ ] Model the transfer use case between two accounts inside the bank.
- [ ] Define the domain rules for transfer validation such as sufficient funds and distinct source and destination accounts.
- [ ] Record the transfer as a consistent ledger operation.
- [ ] Make the transfer flow idempotent to protect against duplicate requests.
- [ ] Expose an application command or controller endpoint for internal transfers.
- [ ] Add tests for success, insufficient funds, same-account transfer, and missing destination account.

## 3. Receive Money Flow

- [ ] Define how an account receives money from another internal source or a settlement flow.
- [ ] Model the credit operation in the ledger.
- [ ] Ensure received funds update the account balance correctly.
- [ ] Add a transaction history entry for incoming money.
- [ ] Expose a query to list recent incoming transactions.
- [ ] Add tests for receiving money and balance updates.

## 4. External Bank Transfers

- [ ] Model an external beneficiary or destination bank account.
- [ ] Implement the command to initiate a transfer outside the bank.
- [ ] Add an outbound bank adapter or gateway port for the external transfer provider.
- [ ] Track transfer lifecycle states such as pending, completed, and failed.
- [ ] Add retry or failure handling rules for provider errors.
- [ ] Expose a query to check external transfer status.
- [ ] Add tests for successful initiation, provider failure, and status transitions.

## 5. CQRS Reporting Graphs

- [ ] Identify the domain events needed from auth, accounts, and transfers.
- [ ] Publish events from the write side when account and transfer actions succeed.
- [ ] Build read models for reporting projections.
- [ ] Create graph-ready queries for daily transfer volume, incoming versus outgoing money, and account activity.
- [ ] Keep reporting read models separate from transactional domain entities.
- [ ] Add tests for projection building and reporting queries.

## Suggested Delivery Order

- [ ] Finish auth and account setup first.
- [ ] Implement internal transfers next because they define the core money rules.
- [ ] Add receive money once the ledger rules are stable.
- [ ] Add external transfers after internal transfer invariants are proven.
- [ ] Add CQRS reporting after domain events and read models are in place.
