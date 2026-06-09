Look up a ConnectWise company and its contacts.

Usage:
  /cw-company                  — list all active companies
  /cw-company Flagler          — search by name (partial match)
  /cw-company id=123           — get a specific company by ID
  /cw-company id=123 contacts  — also list the company's contacts

Steps:
1. If "id=N" is given: call `co-get-company` with that companyId
2. If a name search is given: call `co-list-companies` with name as the search filter
3. Otherwise: call `co-list-companies` with no filter (pageSize=25)
4. If the "contacts" keyword is present (or just an id with no other args): also call `co-list-contacts` with the resolved companyId and show them in a second table
5. Present company info: ID, Name, Status, Type, Phone, City/State
6. Present contacts (if requested): Name, Title, Email, Phone
