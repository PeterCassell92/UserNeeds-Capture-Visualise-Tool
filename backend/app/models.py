"""Pydantic models for User Needs Management API."""

from pydantic import BaseModel
from typing import List, Optional


class UserGroup(BaseModel):
    """User group model."""
    id: str
    name: str
    description: Optional[str] = None
    superGroup: Optional[str] = None


class Entity(BaseModel):
    """Entity model."""
    id: str
    name: str
    description: Optional[str] = None


class WorkflowPhase(BaseModel):
    """Workflow phase model."""
    id: str
    name: str
    order: int


class UserNeed(BaseModel):
    """User need model (complete)."""
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
    """User need creation model."""
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
    """User need update model (all fields optional)."""
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
    """Data store model containing all collections."""
    userGroups: List[UserGroup]
    entities: List[Entity]
    workflowPhases: List[WorkflowPhase]
    userNeeds: List[UserNeed]
