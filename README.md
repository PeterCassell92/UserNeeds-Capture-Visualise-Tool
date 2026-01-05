# User Needs Visualiser

A flexible tool for managing and visualizing user needs across different user groups, entities, and workflow phases. Built with FastAPI (Python) backend and React (TypeScript) frontend with D3 visualizations.

## Features

- **CRUD Operations**: Create, read, update, and delete user needs
- **First-Time Setup**: Guided setup to create your first user group
- **Demo Mode**: Explore the application with sample data (Homezy property letting example)
- **Filtering**: Filter user needs by user group, entity, workflow phase, and super group
- **Multiple Views**:
  - Table view for detailed listings
  - Cards view (normal/large) for overview
  - Interactive D3 network graph for exploring relationships
- **Statistics Dashboard**: Visual breakdown of user needs by various dimensions
- **JSON Database**: Uses `data.json` for persistent storage (git-ignored for privacy)

## Quick Start

### First Installation

When you first run the application, it will:
1. Automatically create an empty `data.json` file
2. Guide you through creating your first user group
3. You can alternatively enable **Demo Mode** to explore with sample data

### Demo Mode

Demo Mode lets you explore the application with sample data from a fictional property letting app called "Homezy". The demo data includes:
- 6 user groups (Prospective Renter, Landlord, Property Manager, Homezy Admin, etc.)
- 10 entities (Property Listing, Rental Application, Lease Agreement, etc.)
- 10 workflow phases (Property Search, Application, Viewing, etc.)
- 24 user needs across different user groups

**Demo Mode creates a sandbox:** Your demo data is stored in `data.demomode.json` (git-ignored), so you can experiment without affecting your actual data in `data.json`.

To enable Demo Mode, click the menu (⋮) in the top-right header and toggle "Demo Mode".

## Project Structure

```
UserNeedVisualiser/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks (useDemoMode)
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite configuration
├── data.json                # Your actual data (git-ignored, auto-created)
├── data.demomode.json       # Demo sandbox data (git-ignored, auto-created)
├── data.example.json        # Homezy demo template (version controlled)
├── data.template.json       # Empty structure template (version controlled)
└── README.md
```

## Prerequisites

### Option 1: Docker (Recommended)
- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

### Option 2: Manual Setup
- Python 3.8+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer and resolver
- Node.js 18+
- npm or yarn

## Setup Instructions

### Option 1: Docker (Recommended)

The easiest way to run the application is using Docker Compose:

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd UserNeedsGathering
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the backend and frontend Docker images
   - Start both services
   - Create `data.json` if it doesn't exist
   - Make the app available at [http://localhost:3000](http://localhost:3000)

3. **View logs** (optional):
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

5. **Rebuild after code changes**:
   ```bash
   docker-compose up -d --build
   ```

**Note:** Data files (`data.json`, `data.demomode.json`) are mounted as volumes, so your data persists even when containers are stopped or rebuilt.

### Option 2: Manual Setup

#### Backend Setup

1. Install uv (if not already installed):
   ```bash
   # On macOS and Linux:
   curl -LsSf https://astral.sh/uv/install.sh | sh

   # On Windows:
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

   # Or with pip:
   pip install uv
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies with uv:
   ```bash
   uv pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uv run python main.py
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000)

   API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

## Usage

### Starting the Application

1. Start the backend server (from the `backend` directory):
   ```bash
   uv run python main.py
   ```

2. Start the frontend (from the `frontend` directory):
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:5173](http://localhost:5173)

### First-Time Setup

On your first visit (when `data.json` is empty or doesn't exist):
1. You'll see a welcome modal
2. Enter your first user group name (e.g., "Admin", "Customer")
3. Select a super group:
   - **Aykua** (Internal Staff - ID prefix: AYK)
   - **Clinic** (External Partners - ID prefix: CLI)
   - **Medical Services User** (End Users - ID prefix: PAT)
4. Click "Create User Group"

**Tip:** You can also try Demo Mode first to see how the app works.

### Managing User Needs

- **Add**: Click "+ Add User Need" button
- **Edit**: Click "Edit" button on any user need card
- **Delete**: Click "Delete" button on any user need card
- **Filter**: Use the filter dropdowns in the sidebar
- **View**: Switch between Table, Cards, and Graph views
- **Card Size**: In Cards view, toggle between Normal and Large card sizes

### Graph View

The interactive network graph visualizes relationships between:
- User needs (purple circles)
- User groups (green circles)
- Entities (orange circles)
- Workflow phases (red circles)

**Graph interactions**:
- Drag nodes to rearrange the layout
- Scroll to zoom in/out
- Click nodes to see details
- Click background to deselect

### Demo Mode

- **Enable**: Click menu (⋮) in header → Toggle "Demo Mode"
- **Sandbox**: Demo data is stored separately in `data.demomode.json`
- **Reset**: Delete `data.demomode.json` to reset demo data to original Homezy example

## API Endpoints

All endpoints support a `demo_mode` query parameter to switch between `data.json` and `data.demomode.json`.

### Setup

- `GET /api/check-setup` - Check if initial setup is required

### User Groups

- `GET /api/user-groups` - Get all user groups
- `POST /api/user-groups` - Create a new user group

### User Needs

- `GET /api/user-needs` - Get all user needs (supports filtering)
- `GET /api/user-needs/{id}` - Get a specific user need
- `POST /api/user-needs` - Create a new user need
- `PUT /api/user-needs/{id}` - Update a user need
- `DELETE /api/user-needs/{id}` - Delete a user need

### Reference Data

- `GET /api/entities` - Get all entities
- `GET /api/workflow-phases` - Get all workflow phases
- `GET /api/statistics` - Get statistics about user needs
- `GET /api/next-id/{user_group_id}` - Get next available ID for a user group

### Query Parameters

Filter user needs using query parameters:
- `userGroupId` - Filter by user group
- `entity` - Filter by entity
- `workflowPhase` - Filter by workflow phase
- `superGroup` - Filter by super group
- `refined` - Filter by refinement status ('refined', 'needsRefinement', 'all')
- `demo_mode` - Use demo data (true/false)

Example:
```
GET /api/user-needs?userGroupId=landlord&workflowPhase=viewing&demo_mode=true
```

## Data Storage

The application uses JSON files for data storage:

- **`data.json`**: Your actual data (git-ignored)
- **`data.demomode.json`**: Demo mode sandbox data (git-ignored, auto-created from example)
- **`data.example.json`**: Homezy demo template (version controlled)
- **`data.template.json`**: Empty structure template (version controlled)

### Data Structure

```json
{
  "userGroups": [
    {
      "id": "admin",
      "name": "Admin",
      "superGroup": "aykua"
    }
  ],
  "entities": [
    {
      "id": "property_listing",
      "name": "Property Listing"
    }
  ],
  "workflowPhases": [
    {
      "id": "registration",
      "name": "Registration",
      "order": 1
    }
  ],
  "userNeeds": [
    {
      "id": "AYK-001",
      "userGroupId": "admin",
      "title": "Monitor platform activity",
      "description": "...",
      "entities": ["property_listing"],
      "workflowPhase": "registration",
      "refined": false
    }
  ]
}
```

## Development

### Docker Development Workflow

When developing with Docker, you can use volume mounts for live reloading:

```bash
# Development mode with live reload (modify docker-compose.yml to add volume mounts)
docker-compose up

# View logs from a specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a specific service
docker-compose restart backend

# Execute commands inside containers
docker-compose exec backend python -c "print('Hello from backend')"
docker-compose exec frontend sh

# Clean up everything (containers, networks, volumes)
docker-compose down -v
```

### Backend Development

The backend is built with FastAPI and provides:
- RESTful API endpoints with automatic OpenAPI documentation
- Pydantic models for request/response validation
- File-based JSON storage with automatic initialization
- Demo mode support for sandboxed testing
- CORS support for local development

**Docker specifics:**
- Health checks ensure the backend is ready before frontend starts
- Data files are mounted as volumes for persistence
- Port 8000 is exposed for API access

### Frontend Development

The frontend uses:
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **D3.js** for network graph visualization
- **Axios** for API communication
- **Custom hooks** for demo mode state management
- **Local storage** for persisting UI preferences

**Docker specifics:**
- Multi-stage build (build stage + nginx production stage)
- Nginx serves the static files and proxies API requests to backend
- Port 80 (container) mapped to port 3000 (host)

### Building for Production

#### With Docker
```bash
# Build production images
docker-compose build

# Run in production mode
docker-compose up -d

# The app will be available at http://localhost:3000
```

#### Manual Build

Frontend:
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

Backend:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Customization

### Adapting to Your Domain

The application is designed to be domain-agnostic. You can adapt it by:

1. **Creating your own user groups** (e.g., Admin, Customer, Developer)
2. **Defining entities** relevant to your domain (e.g., Order, Invoice, User)
3. **Setting up workflow phases** that match your processes (e.g., Draft, Review, Approved)
4. **Organizing user groups into super groups** for better ID management

The super group system allows you to categorize user groups and automatically prefix user need IDs:
- **Aykua** (Internal) → AYK-001, AYK-002, etc.
- **Clinic** (External Partners) → CLI-001, CLI-002, etc.
- **Medical Services User** (End Users) → PAT-001, PAT-002, etc.

## Notes

- This is a local development tool with no authentication
- Data is stored in local JSON files
- `data.json` and `data.demomode.json` are git-ignored for privacy
- Not intended for multi-user production deployments
- For production use, consider migrating to a proper database (PostgreSQL, etc.)

## License

MIT License - Feel free to use and adapt for your needs.
