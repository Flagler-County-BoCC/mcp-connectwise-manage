List open ConnectWise service desk tickets. Optionally filter by status, board, or assignee.

Usage:
  /cw-tickets                  — list all open tickets (default board, last 30 days)
  /cw-tickets board=Help Desk  — filter by board name
  /cw-tickets status=In Progress
  /cw-tickets assignee=jsmith

Steps:
1. Parse any key=value filters from the arguments
2. Call `svc-list-tickets` with those filters (use pageSize=25 unless overridden)
3. If the result is empty, say so clearly
4. Present results as a markdown table with columns: ID, Summary, Status, Board, Assigned To, Last Updated
5. If there are more than 25 results, mention the total count and suggest narrowing the filter
