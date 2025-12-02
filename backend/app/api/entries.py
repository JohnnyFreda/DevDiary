from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.entry import Entry
from app.db.models.tag import Tag
from app.db.models.entry_tag import entry_tags
from app.schemas.entry import EntryCreate, EntryUpdate, EntryResponse
from app.core.auth import get_current_user
from app.services.entries import filter_entries

router = APIRouter()


@router.get("", response_model=List[EntryResponse])
async def get_entries(
    project_id: Optional[int] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get entries with optional filters."""
    entries = filter_entries(
        db=db,
        user_id=current_user.id,
        project_id=project_id,
        tag=tag,
        search=search,
        date_from=date_from,
        date_to=date_to
    )
    return entries


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific entry by ID."""
    entry = db.query(Entry).filter(
        Entry.id == entry_id,
        Entry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    return entry


@router.post("", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry_data: EntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new entry."""
    # Verify project belongs to user if provided
    if entry_data.project_id:
        from app.db.models.project import Project
        project = db.query(Project).filter(
            Project.id == entry_data.project_id,
            Project.user_id == current_user.id
        ).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
    
    # Create entry
    new_entry = Entry(
        user_id=current_user.id,
        project_id=entry_data.project_id,
        date=entry_data.date,
        title=entry_data.title,
        body=entry_data.body,
        mood=entry_data.mood,
        focus_score=entry_data.focus_score
    )
    db.add(new_entry)
    db.flush()
    
    # Handle tags
    if entry_data.tags:
        for tag_name in entry_data.tags:
            # Get or create tag
            tag = db.query(Tag).filter(
                Tag.user_id == current_user.id,
                Tag.name == tag_name
            ).first()
            
            if not tag:
                tag = Tag(user_id=current_user.id, name=tag_name)
                db.add(tag)
                db.flush()
            
            # Associate tag with entry
            db.execute(
                entry_tags.insert().values(entry_id=new_entry.id, tag_id=tag.id)
            )
    
    db.commit()
    db.refresh(new_entry)
    return new_entry


@router.put("/{entry_id}", response_model=EntryResponse)
async def update_entry(
    entry_id: int,
    entry_data: EntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing entry."""
    entry = db.query(Entry).filter(
        Entry.id == entry_id,
        Entry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    # Update fields
    if entry_data.date is not None:
        entry.date = entry_data.date
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.body is not None:
        entry.body = entry_data.body
    if entry_data.mood is not None:
        entry.mood = entry_data.mood
    if entry_data.focus_score is not None:
        entry.focus_score = entry_data.focus_score
    
    # Update project
    if entry_data.project_id is not None:
        if entry_data.project_id == 0:  # Allow clearing project
            entry.project_id = None
        else:
            from app.db.models.project import Project
            project = db.query(Project).filter(
                Project.id == entry_data.project_id,
                Project.user_id == current_user.id
            ).first()
            if not project:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            entry.project_id = entry_data.project_id
    
    # Update tags if provided
    if entry_data.tags is not None:
        # Remove all existing tags
        db.execute(
            entry_tags.delete().where(entry_tags.c.entry_id == entry.id)
        )
        
        # Add new tags
        for tag_name in entry_data.tags:
            tag = db.query(Tag).filter(
                Tag.user_id == current_user.id,
                Tag.name == tag_name
            ).first()
            
            if not tag:
                tag = Tag(user_id=current_user.id, name=tag_name)
                db.add(tag)
                db.flush()
            
            db.execute(
                entry_tags.insert().values(entry_id=entry.id, tag_id=tag.id)
            )
    
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an entry."""
    entry = db.query(Entry).filter(
        Entry.id == entry_id,
        Entry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    # Delete associated tags
    db.execute(
        entry_tags.delete().where(entry_tags.c.entry_id == entry.id)
    )
    
    db.delete(entry)
    db.commit()
    return None


