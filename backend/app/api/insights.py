from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.session import get_db
from app.db.models.user import User
from app.core.auth import get_current_user
from app.services.insights import get_summary, get_mood_trend

router = APIRouter()


@router.get("/summary")
async def get_insights_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get summary insights (streak, entry count, average mood)."""
    return get_summary(db, current_user.id)


@router.get("/mood-trend")
async def get_mood_trend_data(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mood trend data for the last N days."""
    return get_mood_trend(db, current_user.id, days)


