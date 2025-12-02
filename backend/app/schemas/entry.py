from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List


class EntryCreate(BaseModel):
    date: date
    title: Optional[str] = None
    body: Optional[str] = None
    looking_ahead: Optional[str] = None
    project_id: Optional[int] = None
    tags: List[str] = []
    mood: int
    focus_score: Optional[int] = None


class EntryUpdate(BaseModel):
    date: Optional[date] = None
    title: Optional[str] = None
    body: Optional[str] = None
    looking_ahead: Optional[str] = None
    project_id: Optional[int] = None
    tags: Optional[List[str]] = None
    mood: Optional[int] = None
    focus_score: Optional[int] = None


class TagResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class EntryResponse(BaseModel):
    id: int
    user_id: int
    project_id: Optional[int] = None
    date: date
    title: Optional[str] = None
    body: Optional[str] = None
    looking_ahead: Optional[str] = None
    mood: int
    focus_score: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    tags: List[TagResponse] = []
    project: Optional[ProjectResponse] = None

    class Config:
        from_attributes = True


