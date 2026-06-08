# Tool Reference

This MCP server exposes 25 tools across 7 modules. All tools return a single `text/plain` content block containing JSON. All errors return `isError: true` with an `Error [CODE]: message` string — tools never throw.

## Error Handling

| Error Code | Meaning |
|---|---|
| `FORBIDDEN` | Write attempted without `confirm=true` or `dryRun=true`, or operation blocked by allowlist |
| `NOT_FOUND` | Requested resource does not exist |
| `VALIDATION_ERROR` | Input failed Zod schema validation |
| `EXTERNAL_SERVICE_ERROR` | ConnectWise API returned an error or was unreachable |

## Profiles

Tools are filtered at registration time by `CW_ACTIVE_PROFILE`. Each profile maps to a list of tool-name prefixes. An empty prefix list (`[""]`) grants access to all tools (admin). See [ENVIRONMENT.md](ENVIRONMENT.md#profile-configuration).

## Write Safeguards

Mutating tools (`time-create-entry`, `time-update-entry`) require one of:
- `confirm: true` — execute the operation
- `dryRun: true` — return the payload that would have been sent without making the API call

Calling a write tool without either flag returns a confirmation prompt (`isError: false`) describing the operation.

---

## Agreements Tools (`agr-`)

### `agr-list-agreements`

List ConnectWise Manage agreements with optional filters.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number (1-based) |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `company` | `string` | No | — | Filter by company name (partial match) |
| `name` | `string` | No | — | Filter by agreement name (partial match) |
| `type` | `string` | No | — | Filter by agreement type |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field (e.g. `name asc`) |

**Output:** JSON array of Agreement objects.

**Example:**
```json
{ "company": "Acme Corp", "pageSize": 10 }
```

---

### `agr-get-agreement`

Retrieve a single agreement by ID.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `agreementId` | `number` | Yes | — | Numeric agreement ID |

**Output:** JSON Agreement object.

---

### `agr-list-additions`

List additions (line items) for a specific agreement.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `agreementId` | `number` | Yes | — | Numeric agreement ID |
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of AgreementAddition objects.

---

## Companies Tools (`co-`)

### `co-list-companies`

List companies in ConnectWise Manage.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by company name |
| `identifier` | `string` | No | — | Filter by company identifier code |
| `status` | `string` | No | — | Filter by status (e.g. `Active`) |
| `type` | `string` | No | — | Filter by company type |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of Company objects.

---

### `co-get-company`

Retrieve a single company by ID.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `companyId` | `number` | Yes | — | Numeric company ID |

**Output:** JSON Company object.

---

### `co-list-contacts`

List contacts, optionally scoped to a company.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `companyId` | `number` | No | — | Scope to a specific company |
| `firstName` | `string` | No | — | Filter by first name |
| `lastName` | `string` | No | — | Filter by last name |
| `email` | `string` | No | — | Filter by email address |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of Contact objects.

---

## Projects Tools (`prj-`)

### `prj-list-projects`

List projects with optional filters.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by project name |
| `status` | `string` | No | — | Filter by status |
| `company` | `string` | No | — | Filter by client company name |
| `manager` | `string` | No | — | Filter by project manager identifier |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of Project objects.

---

### `prj-get-project`

Retrieve a single project by ID.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `projectId` | `number` | Yes | — | Numeric project ID |

**Output:** JSON Project object.

---

### `prj-list-phases`

List phases for a specific project.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `projectId` | `number` | Yes | — | Numeric project ID |
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of ProjectPhase objects.

---

### `prj-list-tickets`

List tickets (project tickets) for a specific project.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `projectId` | `number` | Yes | — | Numeric project ID |
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |

**Output:** JSON array of ProjectTicket objects.

---

## Sales Tools (`sal-`)

### `sal-list-opportunities`

List sales opportunities with optional filters.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by opportunity name |
| `company` | `string` | No | — | Filter by company name |
| `status` | `enum` | No | — | `Open`, `Won`, `Lost`, or `NoDecision` |
| `assignedTo` | `string` | No | — | Filter by assigned member identifier |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of Opportunity objects.

---

### `sal-get-opportunity`

Retrieve a single opportunity by ID.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `opportunityId` | `number` | Yes | — | Numeric opportunity ID |

**Output:** JSON Opportunity object.

---

### `sal-list-quotes`

List sales quotes.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by quote name |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of Quote objects.

---

## Service Desk Tools (`svc-`)

### `svc-list-tickets`

List service desk tickets with optional filters.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `board` | `string` | No | — | Filter by board name |
| `status` | `string` | No | — | Filter by status name |
| `priority` | `string` | No | — | Filter by priority name |
| `assignedTo` | `string` | No | — | Filter by assigned member identifier |
| `company` | `string` | No | — | Filter by company name |
| `summary` | `string` | No | — | Filter by summary (partial match) |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of ServiceTicket objects.

---

### `svc-get-ticket`

Retrieve a single service ticket by ID.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `ticketId` | `number` | Yes | — | Numeric ticket ID |

**Output:** JSON ServiceTicket object.

---

### `svc-list-boards`

List service boards.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by board name |

**Output:** JSON array of ServiceBoard objects.

---

### `svc-list-statuses`

List statuses for a specific service board.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `boardId` | `number` | Yes | — | Numeric board ID |
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of BoardStatus objects.

---

### `svc-list-priorities`

List service ticket priorities.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of Priority objects.

---

### `svc-list-impacts`

List service ticket impact levels.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of Impact objects.

---

### `svc-list-members`

List service board members.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `identifier` | `string` | No | — | Filter by member identifier |
| `firstName` | `string` | No | — | Filter by first name |
| `lastName` | `string` | No | — | Filter by last name |

**Output:** JSON array of Member objects.

---

## Setup Tools (`setup-`)

### `setup-list-tables`

List ConnectWise setup tables (reference data).

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by table name |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |
| `orderBy` | `string` | No | — | Sort field |

**Output:** JSON array of SetupTable objects.

---

### `setup-list-locations`

List office locations.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by location name |

**Output:** JSON array of Location objects.

---

### `setup-list-departments`

List departments.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by department name |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression |

**Output:** JSON array of Department objects.

---

### `setup-list-work-types`

List work types used in time entries.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by work type name |

**Output:** JSON array of WorkType objects.

---

### `setup-list-work-roles`

List work roles used in time entries.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `name` | `string` | No | — | Filter by work role name |

**Output:** JSON array of WorkRole objects.

---

## Time Tools (`time-`)

### `time-list-entries`

List time entries with optional filters.

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |
| `memberId` | `number` | No | — | Filter by member ID |
| `ticketId` | `number` | No | — | Filter by service ticket ID |
| `dateStart` | `string` (ISO 8601) | No | — | Include entries from this date |
| `dateEnd` | `string` (ISO 8601) | No | — | Include entries up to this date |
| `conditions` | `string` | No | — | Raw ConnectWise conditions expression (overrides other filters) |
| `orderBy` | `string` | No | — | Sort field (e.g. `timeStart desc`) |

**Output:** JSON array of TimeEntry objects.

---

### `time-list-periods`

List available time periods (pay periods).

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | `number` | No | `1` | Page number |
| `pageSize` | `number` | No | `50` | Results per page (max 100) |

**Output:** JSON array of TimePeriod objects.

---

### `time-create-entry`

Create a new time entry on a service ticket. **Write operation — requires `confirm` or `dryRun`.**

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `ticketId` | `number` | Yes | — | Service ticket to charge time to |
| `memberId` | `number` | Yes | — | Member ID logging the time |
| `timeStart` | `string` (ISO 8601) | Yes | — | Start of the time period |
| `timeEnd` | `string` (ISO 8601) | Yes | — | End of the time period |
| `hoursDeduct` | `number` | No | `0` | Hours to deduct from the entry |
| `actualHours` | `number` | No | — | Override actual hours worked |
| `notes` | `string` | No | — | Time entry notes |
| `billableOption` | `enum` | No | `Billable` | `Billable`, `DoNotBill`, `NoCharge`, or `NoDefault` |
| `confirm` | `boolean` | No | `false` | Set `true` to execute the write |
| `dryRun` | `boolean` | No | `false` | Set `true` to preview the payload without writing |

**Output (dryRun=true):** `{ "dryRun": true, "payload": { ... } }`

**Output (confirm=true):** JSON TimeEntry object.

**Example:**
```json
{
  "ticketId": 12345,
  "memberId": 42,
  "timeStart": "2026-06-08T09:00:00Z",
  "timeEnd": "2026-06-08T11:30:00Z",
  "notes": "Investigated connectivity issue",
  "confirm": true
}
```

---

### `time-update-entry`

Update an existing time entry. **Write operation — requires `confirm` or `dryRun`.**

**Input:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `entryId` | `number` | Yes | — | Time entry ID to update |
| `notes` | `string` | No | — | Updated notes |
| `hoursDeduct` | `number` | No | — | Updated deduct hours |
| `actualHours` | `number` | No | — | Updated actual hours |
| `billableOption` | `enum` | No | — | `Billable`, `DoNotBill`, `NoCharge`, or `NoDefault` |
| `confirm` | `boolean` | No | `false` | Set `true` to execute the write |
| `dryRun` | `boolean` | No | `false` | Set `true` to preview without writing |

**Output (dryRun=true):** `{ "dryRun": true, "payload": { ... } }`

**Output (confirm=true):** JSON TimeEntry object.
