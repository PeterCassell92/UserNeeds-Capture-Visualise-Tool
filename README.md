# User Needs Visualiser

A local development tool for managing and visualizing Aykua user needs. Built with FastAPI (Python) backend and React (TypeScript) frontend with D3 visualizations.

## Features

- **CRUD Operations**: Create, read, update, and delete user needs
- **Filtering**: Filter user needs by user group, entity, and workflow phase
- **Multiple Views**:
  - Table view for detailed listings
  - Cards view for overview
  - Interactive D3 network graph for exploring relationships
- **Statistics Dashboard**: Visual breakdown of user needs by various dimensions
- **JSON Database**: Uses `data.json` for persistent storage (included in repository)

## Project Structure

```
UserNeedVisualiser/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.js       # Vite configuration
├── data.json                    # JSON database (version controlled)
└── README.md
```

## Prerequisites

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer and resolver
- Node.js 18+
- npm or yarn

## Setup Instructions

### Backend Setup

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

3. Install dependencies with uv (automatically creates and manages virtual environment):
   ```bash
   uv pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uv run python main.py
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000)

   API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

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

   The application will be available at [http://localhost:3000](http://localhost:3000)

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

3. Open your browser to [http://localhost:3000](http://localhost:3000)

### Managing User Needs

- **Add**: Click "+ Add User Need" button
- **Edit**: Click "Edit" button on any user need
- **Delete**: Click "Delete" button on any user need
- **Filter**: Use the filter dropdowns in the sidebar
- **View**: Switch between Table, Cards, and Graph views

### Graph View

The interactive network graph visualizes relationships between:
- User needs (purple)
- User groups (green)
- Entities (orange)
- Workflow phases (red)

**Graph interactions**:
- Drag nodes to rearrange
- Scroll to zoom in/out
- Click nodes to see details
- Click background to deselect

## API Endpoints

### User Needs

- `GET /api/user-needs` - Get all user needs (supports filtering)
- `GET /api/user-needs/{id}` - Get a specific user need
- `POST /api/user-needs` - Create a new user need
- `PUT /api/user-needs/{id}` - Update a user need
- `DELETE /api/user-needs/{id}` - Delete a user need

### Reference Data

- `GET /api/user-groups` - Get all user groups
- `GET /api/entities` - Get all entities
- `GET /api/workflow-phases` - Get all workflow phases
- `GET /api/statistics` - Get statistics about user needs

### Query Parameters

Filter user needs using query parameters:
- `userGroupId` - Filter by user group
- `entity` - Filter by entity
- `workflowPhase` - Filter by workflow phase

Example:
```
GET /api/user-needs?userGroupId=clinic_staff&workflowPhase=upload
```

## Data Storage

The application uses a JSON file (`data.json`) as its database. This file is included in the repository and contains all user needs, user groups, entities, and workflow phases. All changes made through the UI are persisted to `data.json`.

The database structure includes:
- **userGroups**: User groups with optional superGroup attribute (aykua, clinic, medical_services_user)
- **entities**: System entities
- **workflowPhases**: Workflow phase definitions
- **userNeeds**: Individual user needs with relationships to groups, entities, and phases

## Development

### Backend Development

The backend is built with FastAPI and provides:
- RESTful API endpoints
- Automatic API documentation (Swagger UI)
- Pydantic models for validation
- CORS support for local development

### Frontend Development

The frontend uses:
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **D3.js** for data visualization
- **Axios** for API communication

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Notes

- This is a local development tool with no authentication
- Data is stored in a local JSON file
- Not intended for production use
- No data validation beyond basic type checking

## License

This project is for internal use only.
