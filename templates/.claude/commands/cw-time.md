View or log ConnectWise time entries.

Usage:
  /cw-time                        — list time entries for the current period
  /cw-time member=jsmith          — filter by member username
  /cw-time ticketId=12345         — show time logged against a specific ticket
  /cw-time log ticketId=12345 hours=1.5 notes="Resolved issue"  — create a new entry (requires confirm=true)

Steps:
1. If the first argument is "log": collect ticketId, hours, notes (and optional workType) from the remaining args, then call `time-create-entry` with confirm=true
2. Otherwise: call `time-list-entries` with any provided filters; default to the current billing period
3. Present results as a table: Ticket ID, Member, Hours, Work Type, Notes, Date
4. For "log" operations: show the created entry details and confirm success
5. For write operations always pass confirm=true — if the user did not provide enough information to fill required fields, ask before proceeding
