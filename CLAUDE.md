# Claude Code Guide - User Needs Visualiser

## Project Overview

This is a User Needs Management tool built with FastAPI (Python backend) and React TypeScript (frontend). It allows you to create, view, edit, and filter user needs for the Aykua system across different user groups, entities, and workflow phases.

## Project Structure

```
UserNeedVisualiser/
├── backend/
│   ├── main.py              # FastAPI server with all API endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main application component
│   │   ├── components/
│   │   │   ├── Filters.tsx          # Filter controls in sidebar
│   │   │   ├── Statistics.tsx       # Statistics panel with toggle
│   │   │   ├── UserNeedForm.tsx     # Form for creating/editing needs
│   │   │   ├── UserNeedFormModal.tsx # Modal wrapper for form
│   │   │   ├── Modal.tsx            # Reusable modal component
│   │   │   ├── ViewToggle.tsx       # Cards/Table/Graph view toggle
│   │   │   ├── CardsView.tsx        # Cards view of user needs
│   │   │   ├── TableView.tsx        # Table view of user needs
│   │   │   └── NetworkGraph.tsx     # Graph visualization
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── *.css            # Component-specific styles
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite build configuration
└── data.json                # Database file (JSON)
```

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation using type hints
- **uvicorn** - ASGI server
- **uv** - Python package manager

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

## Key Features

### 1. User Needs Management
- Create, read, update, delete (CRUD) operations
- Auto-generated IDs based on super group prefixes (AYK, CLI, PAT)
- Manual ID override option
- Full-screen modal form with escape key support

### 2. Filtering System
- Filter by User Group
- Filter by Super Group (Aykua, Clinic, Medical Services User)
- Filter by Entity
- Filter by Workflow Phase
- Filters are cleared when clicking statistics bars to prevent invalid states

### 3. Statistics Panel
- Toggle between User Group and Super Group views
- Clickable bars to apply filters
- Collapsible "Show More Details" section with:
  - Workflow Phase statistics
  - Top 10 Entities statistics
- Visual bar charts with percentage widths

### 4. Multiple Views
- **Cards View** - Expandable cards with full details
- **Table View** - Compact tabular format with expandable rows
- **Graph View** - Network visualization (via NetworkGraph component)

### 5. Super Group System
Each user group belongs to a super group:
- **aykua** - Aykua staff, security officers, developers, operators, finance
  - ID Prefix: `AYK`
- **clinic** - Clinic staff, clinic security officers
  - ID Prefix: `CLI`
- **medical_services_user** - Patients
  - ID Prefix: `PAT`

## API Endpoints

### User Needs
- `GET /api/user-needs` - Get all user needs with optional filters
- `POST /api/user-needs` - Create a new user need
- `PUT /api/user-needs/{need_id}` - Update an existing user need
- `DELETE /api/user-needs/{need_id}` - Delete a user need

### Metadata
- `GET /api/user-groups` - Get all user groups
- `GET /api/entities` - Get all entities
- `GET /api/workflow-phases` - Get all workflow phases
- `GET /api/statistics` - Get statistics (counts by group, entity, phase)

### Utilities
- `GET /api/next-id/{user_group_id}` - Get next available ID for a user group

## Data Model

### UserNeed
```typescript
{
  id: string                    // e.g., "CLI-009"
  userGroupId: string          // Reference to userGroup
  title: string
  description: string
  entities: string[]           // Array of entity IDs
  workflowPhases: string[]     // Array of workflow phase IDs
}
```

### UserGroup
```typescript
{
  id: string                   // e.g., "clinic_staff"
  name: string                 // e.g., "Clinic Staff"
  superGroup: string           // "aykua" | "clinic" | "medical_services_user"
}
```

### Entity
```typescript
{
  id: string                   // e.g., "patient_record"
  name: string                 // e.g., "Patient Record"
}
```

### WorkflowPhase
```typescript
{
  id: string                   // e.g., "registration"
  name: string                 // e.g., "Registration"
}
```

## Development Setup

### Backend
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on port 5173
```

The frontend proxies API requests to `http://localhost:8000` via Vite configuration.

## Working with Data (data.json)

The `data.json` file is the database for this application. It contains all user needs, user groups, entities, and workflow phases.

### Structure
```json
{
  "userNeeds": [...],
  "userGroups": [...],
  "entities": [...],
  "workflowPhases": [...]
}
```

---

# Working with Claude Code to Modify data.json

Claude Code can help you directly modify the `data.json` file through natural language prompts. Here are common operations:

## Adding User Needs

**Example Prompt:**
```
Add a new user need for clinic_staff with:
- ID: CLI-010
- Title: "View patient appointment history"
- Description: "Clinic staff need to view all past and upcoming appointments for a patient"
- Entities: patient_record, appointment
- Workflow Phases: consultation, follow_up
```

Claude will:
1. Read the current `data.json`
2. Find the next available ID or use your specified ID
3. Add the new user need to the `userNeeds` array
4. Save the file

## Bulk Adding User Needs

**Example Prompt:**
```
Add the following user needs for aykua_developer:
1. "Implement API rate limiting" - entities: api, security - phases: development, testing
2. "Add audit logging" - entities: audit_log, security - phases: development, testing
3. "Create backup system" - entities: database, backup - phases: deployment, maintenance
```

## Modifying Existing User Needs

**Example Prompt:**
```
Update user need CLI-009:
- Change the title to "Access real-time patient vitals"
- Add "monitoring" to the workflow phases
```

**Example Prompt:**
```
For all user needs with entity "patient_record", add the workflow phase "data_protection"
```

## Deleting User Needs

**Example Prompt:**
```
Delete user need AYK-005
```

**Example Prompt:**
```
Remove all user needs for the entity "legacy_system"
```

## Adding Entities

**Example Prompt:**
```
Add a new entity:
- ID: medication_prescription
- Name: Medication Prescription
```

## Adding Workflow Phases

**Example Prompt:**
```
Add a new workflow phase:
- ID: post_discharge
- Name: Post-Discharge
```

## Adding User Groups

**Example Prompt:**
```
Add a new user group:
- ID: pharmacy_staff
- Name: Pharmacy Staff
- Super Group: clinic
```

## Batch Operations

**Example Prompt:**
```
Add these entities:
- lab_result / Lab Result
- imaging_scan / Imaging Scan
- vital_signs / Vital Signs
```

## Searching and Filtering

**Example Prompt:**
```
Show me all user needs for clinic_staff that include the entity "appointment"
```

**Example Prompt:**
```
List all user needs in the "registration" workflow phase
```

**Example Prompt:**
```
Find user needs that don't have any workflow phases assigned
```

## Data Validation

**Example Prompt:**
```
Check if there are any user needs with missing or invalid entities
```

**Example Prompt:**
```
Verify all user group IDs in userNeeds exist in the userGroups array
```

## ID Management

**Example Prompt:**
```
What's the next available ID for clinic_staff?
```

**Example Prompt:**
```
Renumber all clinic user needs to start from CLI-001 in sequential order
```

## Tips for Working with Claude Code

1. **Be specific**: Include exact IDs, titles, and field names
2. **Use consistent naming**: Follow snake_case for IDs, Title Case for names
3. **Validate references**: Ensure entity IDs and workflow phase IDs exist before referencing them
4. **Backup first**: Ask Claude to show you the current data before making large changes
5. **Incremental changes**: Make changes in small batches and verify before proceeding
6. **Ask for confirmation**: Request a summary of changes before applying them

## Common Patterns

### Creating a Complete User Journey
```
Create user needs for the patient registration journey:
1. Initial form submission
2. Identity verification
3. Medical history collection
4. Insurance validation
5. Appointment scheduling
```

### Reorganizing Data
```
Group all user needs by super group and show me statistics for each
```

### Data Cleanup
```
Remove any duplicate user needs (same title and userGroupId)
```

### Reporting
```
Generate a report of all user needs by entity, showing counts and which user groups need them
```

---

## Component Patterns

### Modal Pattern
The `Modal.tsx` component is reusable for any full-screen modal:
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Title">
  {/* Your content */}
</Modal>
```

### Toggle Button Pattern
See `Statistics.tsx` for the toggle button implementation (User Group vs Super Group).

### Conditional Form Fields
See `UserNeedForm.tsx` for auto-generated vs manual ID fields with checkbox toggle.

## Styling Conventions

- Purple theme: `#667eea` (primary), `#764ba2` (gradient end)
- Border radius: `6px` for buttons/inputs, `8px` for cards
- Spacing: `0.75rem` between elements, `1.5rem` for sections
- Hover states: Lighten background to `#f8f9fa`

## File Naming

- Components: PascalCase (e.g., `UserNeedForm.tsx`)
- Styles: Match component name (e.g., `UserNeedForm.css`)
- Types: Singular when possible (e.g., `UserNeed` not `UserNeeds`)

## State Management

- Local state with `useState` for UI state
- Props drilling for shared state (filters, user needs, etc.)
- No external state management library currently used

## Best Practices

1. **Always read before edit**: Use Read tool before Edit tool
2. **Type safety**: Leverage TypeScript types from `types.ts`
3. **Filter consistency**: Clear conflicting filters to avoid empty results
4. **ID prefixes**: Follow super group prefix system (AYK, CLI, PAT)
5. **Accessibility**: Include ARIA labels and keyboard navigation
6. **Responsive**: Test on mobile viewports

## Known Issues / Limitations

- Data is stored in JSON file (no database)
- No authentication/authorization
- No concurrent edit protection
- Limited to single-user scenarios
- No undo/redo functionality

## Future Enhancements

- PostgreSQL database backend
- User authentication
- Real-time collaboration
- Undo/redo support
- Export to PDF/CSV
- Import from spreadsheet
- Advanced graph visualizations
- User need dependencies/relationships
