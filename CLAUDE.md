# Claude Code Guide - User Needs Visualiser

## Project Overview

This is a general-purpose User Needs Management tool built with FastAPI (Python backend) and React TypeScript (frontend). It allows you to create, view, edit, and filter user needs across different user groups, entities, and workflow phases. The tool is domain-agnostic and can be adapted for any industry or use case.

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
│   │   │   ├── Header.tsx           # Header with demo mode toggle
│   │   │   ├── FirstTimeSetup.tsx   # First-time user group setup modal
│   │   │   ├── Filters.tsx          # Filter controls in sidebar
│   │   │   ├── Statistics.tsx       # Statistics panel with toggle
│   │   │   ├── UserNeedForm.tsx     # Form for creating/editing needs
│   │   │   ├── UserNeedFormModal.tsx # Modal wrapper for form
│   │   │   ├── Modal.tsx            # Reusable modal component
│   │   │   ├── UserNeedsList.tsx    # Cards/Table view renderer
│   │   │   └── NetworkGraph.tsx     # Graph visualization
│   │   ├── hooks/
│   │   │   └── useDemoMode.ts       # Demo mode state management
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── *.css            # Component-specific styles
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite build configuration
├── data.json                # User's actual data (git-ignored, auto-created)
├── data.demomode.json       # Demo sandbox data (git-ignored, auto-created)
├── data.example.json        # Homezy demo template (version controlled)
└── data.template.json       # Empty structure template (version controlled)
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
- **D3.js** - Network graph visualization

## Key Features

### 1. First-Time Setup
- Automatic empty `data.json` creation
- Guided modal for creating first user group
- Option to try Demo Mode first

### 2. Demo Mode
- Sandbox environment with Homezy property letting example data
- Separate `data.demomode.json` file (doesn't affect real data)
- Toggle via menu in header
- Persisted in localStorage

### 3. User Needs Management
- Create, read, update, delete (CRUD) operations
- Auto-generated IDs based on super group prefixes (AYK, CLI, PAT)
- Manual ID override option
- Full-screen modal form with escape key support

### 4. Filtering System
- Filter by User Group
- Filter by Super Group (aykua, clinic, medical_services_user)
- Filter by Entity
- Filter by Workflow Phase
- Filter by Refined status
- Filters are cleared when clicking statistics bars to prevent invalid states

### 5. Statistics Panel
- Toggle between User Group and Super Group views
- Clickable bars to apply filters
- Collapsible "Show More Details" section with:
  - Workflow Phase statistics
  - Top 10 Entities statistics
- Visual bar charts with percentage widths

### 6. Multiple Views
- **Cards View** - Expandable cards with full details (normal/large sizes)
- **Table View** - Compact tabular format with expandable rows
- **Graph View** - D3 network visualization showing relationships

### 7. Super Group System
Each user group belongs to a super group for ID prefix management:
- **aykua** (Internal Staff)
  - ID Prefix: `AYK`
  - Example groups: Admins, Developers, Security Officers
- **clinic** (External Partners)
  - ID Prefix: `CLI`
  - Example groups: Landlords, Property Managers, Maintenance Staff
- **medical_services_user** (End Users)
  - ID Prefix: `PAT`
  - Example groups: Prospective Renters, Customers, Patients

## API Endpoints

All endpoints support `demo_mode` query parameter (boolean) to switch between `data.json` and `data.demomode.json`.

### Setup
- `GET /api/check-setup` - Check if initial setup is required

### User Groups
- `GET /api/user-groups?demo_mode=false` - Get all user groups
- `POST /api/user-groups?demo_mode=false` - Create a new user group

### User Needs
- `GET /api/user-needs?demo_mode=false` - Get all user needs with optional filters
- `POST /api/user-needs?demo_mode=false` - Create a new user need
- `PUT /api/user-needs/{need_id}?demo_mode=false` - Update an existing user need
- `DELETE /api/user-needs/{need_id}?demo_mode=false` - Delete a user need

### Metadata
- `GET /api/entities?demo_mode=false` - Get all entities
- `GET /api/workflow-phases?demo_mode=false` - Get all workflow phases
- `GET /api/statistics?demo_mode=false` - Get statistics (counts by group, entity, phase)

### Utilities
- `GET /api/next-id/{user_group_id}?demo_mode=false` - Get next available ID for a user group

## Data Model

### UserNeed
```typescript
{
  id: string                    // e.g., "CLI-009"
  userGroupId: string          // Reference to userGroup
  title: string
  description: string
  entities: string[]           // Array of entity IDs
  workflowPhase: string        // Single workflow phase ID
  refined?: boolean            // Optional refinement status
  sla?: string                 // Optional SLA
  triggersStateChange?: boolean
  fromState?: string
  toState?: string
  optional?: boolean
  futureFeature?: boolean
  constraints?: string[]
}
```

### UserGroup
```typescript
{
  id: string                   // e.g., "landlord"
  name: string                 // e.g., "Landlord"
  superGroup: string           // "aykua" | "clinic" | "medical_services_user"
}
```

### Entity
```typescript
{
  id: string                   // e.g., "property_listing"
  name: string                 // e.g., "Property Listing"
}
```

### WorkflowPhase
```typescript
{
  id: string                   // e.g., "viewing"
  name: string                 // e.g., "Viewing"
  order: number                // e.g., 3
}
```

## Development Setup

### Docker (Recommended)
```bash
# Start both backend and frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Manual Setup

#### Backend
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on port 5173
```

The frontend proxies API requests to `http://localhost:8000` via Vite configuration (or `http://backend:8000` in Docker).

## Working with Data Files

The application uses multiple JSON files:

### data.json (Your Actual Data)
- Git-ignored for privacy
- Auto-created with empty structure on first run
- Contains your real user needs and configuration

### data.demomode.json (Demo Sandbox)
- Git-ignored
- Auto-created from `data.example.json` when demo mode is first enabled
- Completely separate from `data.json` - safe to experiment

### data.example.json (Homezy Demo Template)
- Version controlled
- Contains complete Homezy property letting example
- Used as the basis for `data.demomode.json`

### data.template.json (Empty Template)
- Version controlled
- Shows the required JSON structure
- Used for creating new `data.json` files

### Structure
```json
{
  "userGroups": [...],
  "entities": [...],
  "workflowPhases": [...],
  "userNeeds": [...]
}
```

---

# Working with Claude Code to Modify Data Files

Claude Code can help you directly modify data files through natural language prompts. Here are common operations:

## Homezy Demo Mode Examples

The demo mode includes a fictional property letting app called "Homezy" with these user groups:
- **Prospective Renter** (PAT prefix) - End users looking for properties
- **Landlord** (CLI prefix) - Property owners
- **Property Manager** (CLI prefix) - Managing multiple properties
- **Homezy Admin** (AYK prefix) - Platform administrators
- **Homezy Security Officer** (AYK prefix) - Security and compliance
- **Maintenance Staff** (CLI prefix) - Property maintenance

## Adding User Needs (Demo Mode Examples)

**Example Prompt:**
```
Add a new user need for landlord with:
- Title: "Track rental income analytics"
- Description: "Landlords need to view detailed analytics on rental income, occupancy rates, and financial projections"
- Entities: payment, property_listing
- Workflow Phase: tenancy_management
```

**Example Prompt (Bulk):**
```
Add the following user needs for prospective_renter in demo mode:
1. "Save favorite properties" - entities: property_listing - phase: property_search
2. "Compare multiple properties" - entities: property_listing - phase: property_search
3. "Set up viewing reminders" - entities: viewing_request - phase: viewing
```

## Adding User Needs (General Examples)

**Example Prompt:**
```
Add a new user need for admin_user with:
- ID: AYK-010
- Title: "Export user activity reports"
- Description: "Admins need to export comprehensive reports of user activity for compliance"
- Entities: audit_log, user_profile
- Workflow Phases: reporting, compliance
```

## Modifying Existing User Needs

**Example Prompt:**
```
Update user need CLI-005:
- Change the title to "Automated deposit return processing"
- Add "payment_gateway" to the entities list
```

**Example Prompt (Bulk):**
```
For all user needs with entity "payment", add workflow phase "financial_audit"
```

## Deleting User Needs

**Example Prompt:**
```
Delete user need PAT-003
```

**Example Prompt (Conditional):**
```
Remove all user needs for the entity "legacy_payment_system"
```

## Adding Entities

**Example Prompt:**
```
Add a new entity:
- ID: property_insurance
- Name: Property Insurance
```

**Example Prompt (Bulk):**
```
Add these entities for Homezy demo:
- tenant_review / Tenant Review
- property_photos / Property Photos
- lease_template / Lease Template
```

## Adding Workflow Phases

**Example Prompt:**
```
Add a new workflow phase:
- ID: lease_renewal
- Name: Lease Renewal
- Order: 11
```

## Adding User Groups

**Example Prompt:**
```
Add a new user group:
- ID: property_inspector
- Name: Property Inspector
- Super Group: clinic
```

## Batch Operations

**Example Prompt:**
```
Add these workflow phases in order:
1. lead_qualification (Lead Qualification) - order: 1
2. property_tour (Property Tour) - order: 2
3. application_review (Application Review) - order: 3
4. lease_signing (Lease Signing) - order: 4
```

## Searching and Filtering

**Example Prompt:**
```
Show me all user needs for property_manager that include the entity "maintenance_request"
```

**Example Prompt:**
```
List all user needs in the "viewing" workflow phase
```

**Example Prompt:**
```
Find user needs that don't have any entities assigned
```

## Data Validation

**Example Prompt:**
```
Check if there are any user needs with invalid entity references (entities that don't exist in the entities array)
```

**Example Prompt:**
```
Verify all user group IDs in userNeeds exist in the userGroups array
```

## Working with Demo Mode

**Example Prompt:**
```
Show me the difference in user needs count between my real data and demo data
```

**Example Prompt:**
```
Copy the "landlord" user group from demo mode to my actual data
```

## ID Management

**Example Prompt:**
```
What's the next available ID for homezy_admin user group in demo mode?
```

**Example Prompt:**
```
Renumber all landlord user needs to start from CLI-020 in sequential order
```

## Tips for Working with Claude Code

1. **Be specific**: Include exact IDs, titles, and field names
2. **Use consistent naming**: Follow snake_case for IDs, Title Case for names
3. **Validate references**: Ensure entity IDs and workflow phase IDs exist before referencing them
4. **Backup first**: Ask Claude to show you the current data before making large changes
5. **Incremental changes**: Make changes in small batches and verify before proceeding
6. **Ask for confirmation**: Request a summary of changes before applying them
7. **Demo mode first**: Try changes in demo mode before applying to real data

## Common Patterns

### Creating a Complete User Journey (Homezy Example)
```
Create user needs for the tenant move-in journey:
1. Complete final viewing
2. Submit rental application
3. Provide references
4. Sign lease agreement
5. Pay first month's rent and deposit
6. Schedule move-in inspection
7. Receive keys and access codes
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

### First-Time Setup Pattern
See `FirstTimeSetup.tsx` for the welcome modal that appears when `data.json` is empty.

### Demo Mode Pattern
See `useDemoMode.ts` hook for localStorage-persisted boolean state.

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
- Hooks: camelCase with "use" prefix (e.g., `useDemoMode.ts`)
- Types: Singular when possible (e.g., `UserNeed` not `UserNeeds`)

## State Management

- Local state with `useState` for UI state
- Custom hooks for cross-component state (e.g., `useDemoMode`)
- Props drilling for shared state (filters, user needs, etc.)
- localStorage for persisting preferences (demo mode)
- No external state management library currently used

## Best Practices

1. **Always read before edit**: Use Read tool before Edit tool
2. **Type safety**: Leverage TypeScript types from `types.ts`
3. **Filter consistency**: Clear conflicting filters to avoid empty results
4. **ID prefixes**: Follow super group prefix system (AYK, CLI, PAT)
5. **Accessibility**: Include ARIA labels and keyboard navigation
6. **Responsive**: Test on mobile viewports
7. **Demo mode first**: Test changes in demo mode before applying to real data

## Known Issues / Limitations

- Data is stored in JSON files (no database)
- No authentication/authorization
- No concurrent edit protection
- Limited to single-user scenarios
- No undo/redo functionality
- Demo mode and real data have separate statistics (don't merge)

## Future Enhancements

- PostgreSQL database backend
- User authentication
- Real-time collaboration
- Undo/redo support
- Export to PDF/CSV
- Import from spreadsheet
- Advanced graph visualizations
- User need dependencies/relationships
- Customizable super group names and prefixes
