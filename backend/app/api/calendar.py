from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, datetime
from calendar import monthrange
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.calendar import CalendarMonthResponse, CalendarDay
from app.core.auth import get_current_user
from app.services.calendar import get_calendar_month_data

router = APIRouter()


@router.get("/month", response_model=CalendarMonthResponse)
async def get_calendar_month(
    year: int = Query(...),
    month: int = Query(...),
    project_id: Optional[int] = Query(None),
    tag: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get calendar month view data."""
    # Get aggregated data for days with entries
    day_data = get_calendar_month_data(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
        project_id=project_id,
        tag=tag
    )
    
    # Get number of days in the month
    _, num_days = monthrange(year, month)
    
    # Build response with all days in month
    days = []
    for day in range(1, num_days + 1):
        current_date = date(year, month, day)
        if current_date in day_data:
            days.append(CalendarDay(
                date=current_date,
                entry_count=day_data[current_date]['entry_count'],
                average_mood=day_data[current_date]['average_mood']
            ))
        else:
            days.append(CalendarDay(
                date=current_date,
                entry_count=0,
                average_mood=None
            ))
    
    return CalendarMonthResponse(year=year, month=month, days=days)


