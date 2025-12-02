from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import date
from typing import Optional, List
from app.db.models.entry import Entry
from app.db.models.tag import Tag


def filter_entries(
    db: Session,
    user_id: int,
    project_id: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None
) -> List[Entry]:
    """Filter entries based on various criteria."""
    query = db.query(Entry).filter(Entry.user_id == user_id)
    
    if project_id:
        query = query.filter(Entry.project_id == project_id)
    
    if date_from:
        query = query.filter(Entry.date >= date_from)
    
    if date_to:
        query = query.filter(Entry.date <= date_to)
    
    if search:
        search_filter = or_(
            Entry.title.ilike(f"%{search}%"),
            Entry.body.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if tag:
        # Filter by tag name
        query = query.join(Entry.tags).filter(Tag.name == tag)
    
    return query.order_by(Entry.date.desc(), Entry.created_at.desc()).all()


