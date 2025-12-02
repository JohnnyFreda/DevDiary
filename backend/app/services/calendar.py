from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional, List, Dict
from app.db.models.entry import Entry
from app.db.models.tag import Tag


def get_calendar_month_data(
    db: Session,
    user_id: int,
    year: int,
    month: int,
    project_id: Optional[int] = None,
    tag: Optional[str] = None
) -> Dict:
    """Get calendar month data with entry counts and average mood per day."""
    # Build query
    query = db.query(
        Entry.date,
        func.count(Entry.id).label('entry_count'),
        func.avg(Entry.mood).label('average_mood')
    ).filter(
        Entry.user_id == user_id,
        func.extract('year', Entry.date) == year,
        func.extract('month', Entry.date) == month
    )
    
    if project_id:
        query = query.filter(Entry.project_id == project_id)
    
    if tag:
        query = query.join(Entry.tags).filter(Tag.name == tag)
    
    results = query.group_by(Entry.date).all()
    
    # Convert to dictionary for easy lookup
    day_data = {row.date: {'entry_count': row.entry_count, 'average_mood': float(row.average_mood) if row.average_mood else None} for row in results}
    
    return day_data


