from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import shutil
from pathlib import Path

app = FastAPI(title="User Needs Management API")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path configuration
BASE_DIR = Path(__file__).parent.parent
DATA_FILE = BASE_DIR / "data.json"
DEMO_DATA_FILE = BASE_DIR / "data.demomode.json"
EXAMPLE_DATA_FILE = BASE_DIR / "data.example.json"
TEMPLATE_DATA_FILE = BASE_DIR / "data.template.json"

# Super group ID prefixes
SUPER_GROUP_PREFIXES = {
    "aykua": "AYK",
    "clinic": "CLI",
    "medical_services_user": "PAT"
}

# Pydantic models
class UserGroup(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    superGroup: Optional[str] = None

class Entity(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

class WorkflowPhase(BaseModel):
    id: str
    name: str
    order: int

class UserNeed(BaseModel):
    id: str
    userGroupId: str
    title: str
    description: str
    entities: List[str]
    workflowPhase: str
    refined: Optional[bool] = False
    sla: Optional[str] = None
    triggersStateChange: Optional[bool] = None
    fromState: Optional[str] = None
    toState: Optional[str] = None
    optional: Optional[bool] = None
    futureFeature: Optional[bool] = None
    constraints: Optional[List[str]] = None

class UserNeedCreate(BaseModel):
    id: str
    userGroupId: str
    title: str
    description: str
    entities: List[str]
    workflowPhase: str
    refined: Optional[bool] = False
    sla: Optional[str] = None
    triggersStateChange: Optional[bool] = None
    fromState: Optional[str] = None
    toState: Optional[str] = None
    optional: Optional[bool] = None
    futureFeature: Optional[bool] = None
    constraints: Optional[List[str]] = None

class UserNeedUpdate(BaseModel):
    userGroupId: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    entities: Optional[List[str]] = None
    workflowPhase: Optional[str] = None
    refined: Optional[bool] = None
    sla: Optional[str] = None
    triggersStateChange: Optional[bool] = None
    fromState: Optional[str] = None
    toState: Optional[str] = None
    optional: Optional[bool] = None
    futureFeature: Optional[bool] = None
    constraints: Optional[List[str]] = None

class DataStore(BaseModel):
    userGroups: List[UserGroup]
    entities: List[Entity]
    workflowPhases: List[WorkflowPhase]
    userNeeds: List[UserNeed]

# Database functions
def get_data_file_path(demo_mode: bool = False) -> Path:
    """Get the appropriate data file path based on mode"""
    if demo_mode:
        # In demo mode, use data.demomode.json
        # If it doesn't exist, copy from data.example.json
        if not DEMO_DATA_FILE.exists() and EXAMPLE_DATA_FILE.exists():
            shutil.copy(EXAMPLE_DATA_FILE, DEMO_DATA_FILE)
        return DEMO_DATA_FILE
    else:
        return DATA_FILE

def initialize_data_file(file_path: Path):
    """Initialize a data file with empty structure if it doesn't exist"""
    if not file_path.exists():
        # Create empty structure
        empty_data = {
            "userGroups": [],
            "entities": [],
            "workflowPhases": [],
            "userNeeds": []
        }
        with open(file_path, 'w') as f:
            json.dump(empty_data, f, indent=2)

def load_data(demo_mode: bool = False) -> DataStore:
    """Load data from the appropriate data file"""
    file_path = get_data_file_path(demo_mode)

    # Initialize if doesn't exist
    initialize_data_file(file_path)

    with open(file_path, 'r') as f:
        data = json.load(f)
    return DataStore(**data)

def save_data(data: DataStore, demo_mode: bool = False):
    """Save data to the appropriate data file"""
    file_path = get_data_file_path(demo_mode)
    with open(file_path, 'w') as f:
        json.dump(data.model_dump(), f, indent=2)

# API Endpoints

@app.get("/")
def read_root():
    return {"message": "User Needs Management API", "version": "1.0.0"}

@app.get("/api/check-setup")
def check_setup():
    """Check if initial setup is required"""
    # Always check the main data.json file for setup status
    has_data = DATA_FILE.exists()
    needs_setup = False

    if has_data:
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                # Check if there's at least one user group
                needs_setup = len(data.get('userGroups', [])) == 0
        except:
            needs_setup = True
    else:
        needs_setup = True

    return {
        "hasData": has_data,
        "needsSetup": needs_setup
    }

# User Groups
@app.get("/api/user-groups", response_model=List[UserGroup])
def get_user_groups(demo_mode: bool = Query(False)):
    """Get all user groups"""
    data = load_data(demo_mode)
    return data.userGroups

@app.post("/api/user-groups", response_model=UserGroup)
def create_user_group(user_group: UserGroup, demo_mode: bool = Query(False)):
    """Create a new user group"""
    data = load_data(demo_mode)

    # Check if ID already exists
    if any(ug.id == user_group.id for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="User group with this ID already exists")

    data.userGroups.append(user_group)
    save_data(data, demo_mode)
    return user_group

# Entities
@app.get("/api/entities", response_model=List[Entity])
def get_entities(demo_mode: bool = Query(False)):
    """Get all entities"""
    data = load_data(demo_mode)
    return data.entities

# Workflow Phases
@app.get("/api/workflow-phases", response_model=List[WorkflowPhase])
def get_workflow_phases(demo_mode: bool = Query(False)):
    """Get all workflow phases"""
    data = load_data(demo_mode)
    return data.workflowPhases

# User Needs CRUD
@app.get("/api/user-needs", response_model=List[UserNeed])
def get_user_needs(
    userGroupId: Optional[str] = None,
    entity: Optional[str] = None,
    workflowPhase: Optional[str] = None,
    superGroup: Optional[str] = None,
    refined: Optional[str] = None,
    demo_mode: bool = Query(False)
):
    """Get all user needs with optional filters"""
    data = load_data(demo_mode)
    needs = data.userNeeds

    # Apply filters
    if userGroupId:
        needs = [n for n in needs if n.userGroupId == userGroupId]
    if entity:
        needs = [n for n in needs if entity in n.entities]
    if workflowPhase:
        needs = [n for n in needs if n.workflowPhase == workflowPhase]
    if superGroup:
        # Filter by superGroup - need to look up user groups
        user_group_ids_in_super_group = [ug.id for ug in data.userGroups if ug.superGroup == superGroup]
        needs = [n for n in needs if n.userGroupId in user_group_ids_in_super_group]
    if refined:
        if refined == 'refined':
            needs = [n for n in needs if n.refined == True]
        elif refined == 'needsRefinement':
            needs = [n for n in needs if n.refined != True]

    return needs

@app.get("/api/user-needs/{need_id}", response_model=UserNeed)
def get_user_need(need_id: str, demo_mode: bool = Query(False)):
    """Get a specific user need by ID"""
    data = load_data(demo_mode)
    need = next((n for n in data.userNeeds if n.id == need_id), None)
    if not need:
        raise HTTPException(status_code=404, detail="User need not found")
    return need

@app.post("/api/user-needs", response_model=UserNeed)
def create_user_need(need: UserNeedCreate, demo_mode: bool = Query(False)):
    """Create a new user need"""
    data = load_data(demo_mode)

    # Check if ID already exists
    if any(n.id == need.id for n in data.userNeeds):
        raise HTTPException(status_code=400, detail="User need with this ID already exists")

    # Validate references
    if not any(ug.id == need.userGroupId for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="Invalid userGroupId")
    if not any(wp.id == need.workflowPhase for wp in data.workflowPhases):
        raise HTTPException(status_code=400, detail="Invalid workflowPhase")
    for entity_id in need.entities:
        if not any(e.id == entity_id for e in data.entities):
            raise HTTPException(status_code=400, detail=f"Invalid entity: {entity_id}")

    # Create new need
    new_need = UserNeed(**need.model_dump())
    data.userNeeds.append(new_need)
    save_data(data, demo_mode)
    return new_need

@app.put("/api/user-needs/{need_id}", response_model=UserNeed)
def update_user_need(need_id: str, need_update: UserNeedUpdate, demo_mode: bool = Query(False)):
    """Update an existing user need"""
    data = load_data(demo_mode)

    # Find the need
    need_index = next((i for i, n in enumerate(data.userNeeds) if n.id == need_id), None)
    if need_index is None:
        raise HTTPException(status_code=404, detail="User need not found")

    # Get existing need
    existing_need = data.userNeeds[need_index]

    # Validate references if provided
    if need_update.userGroupId and not any(ug.id == need_update.userGroupId for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="Invalid userGroupId")
    if need_update.workflowPhase and not any(wp.id == need_update.workflowPhase for wp in data.workflowPhases):
        raise HTTPException(status_code=400, detail="Invalid workflowPhase")
    if need_update.entities:
        for entity_id in need_update.entities:
            if not any(e.id == entity_id for e in data.entities):
                raise HTTPException(status_code=400, detail=f"Invalid entity: {entity_id}")

    # Update fields
    update_dict = need_update.model_dump(exclude_unset=True)
    updated_need = existing_need.model_copy(update=update_dict)
    data.userNeeds[need_index] = updated_need
    save_data(data, demo_mode)
    return updated_need

@app.delete("/api/user-needs/{need_id}")
def delete_user_need(need_id: str, demo_mode: bool = Query(False)):
    """Delete a user need"""
    data = load_data(demo_mode)

    # Find and remove the need
    need_index = next((i for i, n in enumerate(data.userNeeds) if n.id == need_id), None)
    if need_index is None:
        raise HTTPException(status_code=404, detail="User need not found")

    deleted_need = data.userNeeds.pop(need_index)
    save_data(data, demo_mode)
    return {"message": "User need deleted successfully", "id": deleted_need.id}

# Statistics endpoint
@app.get("/api/statistics")
def get_statistics(demo_mode: bool = Query(False)):
    """Get statistics about user needs"""
    data = load_data(demo_mode)

    # Group by user group
    by_user_group = {}
    for need in data.userNeeds:
        if need.userGroupId not in by_user_group:
            by_user_group[need.userGroupId] = 0
        by_user_group[need.userGroupId] += 1

    # Group by workflow phase
    by_workflow_phase = {}
    for need in data.userNeeds:
        if need.workflowPhase not in by_workflow_phase:
            by_workflow_phase[need.workflowPhase] = 0
        by_workflow_phase[need.workflowPhase] += 1

    # Group by entity
    by_entity = {}
    for need in data.userNeeds:
        for entity in need.entities:
            if entity not in by_entity:
                by_entity[entity] = 0
            by_entity[entity] += 1

    return {
        "totalNeeds": len(data.userNeeds),
        "byUserGroup": by_user_group,
        "byWorkflowPhase": by_workflow_phase,
        "byEntity": by_entity
    }

# Generate next available ID
@app.get("/api/next-id/{user_group_id}")
def get_next_id(user_group_id: str, demo_mode: bool = Query(False)):
    """Generate the next available ID for a user group"""
    data = load_data(demo_mode)

    # Find the user group
    user_group = next((ug for ug in data.userGroups if ug.id == user_group_id), None)
    if not user_group:
        raise HTTPException(status_code=404, detail="User group not found")

    # Get the super group prefix
    super_group = user_group.superGroup
    if not super_group or super_group not in SUPER_GROUP_PREFIXES:
        raise HTTPException(status_code=400, detail="Invalid super group")

    prefix = SUPER_GROUP_PREFIXES[super_group]

    # Find all IDs with this prefix
    matching_ids = []
    for need in data.userNeeds:
        if need.id.startswith(f"{prefix}-"):
            try:
                # Extract the numeric part
                numeric_part = need.id.split("-")[1]
                matching_ids.append(int(numeric_part))
            except (IndexError, ValueError):
                # Skip IDs that don't match the pattern
                continue

    # Get the next number
    next_num = max(matching_ids) + 1 if matching_ids else 1

    # Format with leading zeros (3 digits)
    next_id = f"{prefix}-{next_num:03d}"

    return {"nextId": next_id, "prefix": prefix}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
