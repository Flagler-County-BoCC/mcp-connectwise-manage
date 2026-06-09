List ConnectWise projects and drill into phases or tickets.

Usage:
  /cw-projects                  — list all active projects
  /cw-projects status=Open      — filter by status
  /cw-projects id=456           — get a specific project with its phases
  /cw-projects id=456 tickets   — also show the project's tickets

Steps:
1. If "id=N" is given: call `prj-get-project` to fetch project details, then call `prj-list-phases` to list its phases
2. If "tickets" keyword is present alongside an id: also call `prj-list-tickets` with the projectId
3. Otherwise: call `prj-list-projects` with any provided status filter (pageSize=25)
4. Present projects as a table: ID, Name, Status, Manager, Start Date, Target End
5. Present phases (if fetched): Phase Name, Status, % Complete, Hours Budgeted
6. Present tickets (if requested): ID, Summary, Status, Assigned To
