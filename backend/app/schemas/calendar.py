from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class CalendarDay(BaseModel):
    date: date
    entry_count: int
    average_mood: Optional[float] = None


class CalendarMonthResponse(BaseModel):
    year: int
    month: int
    days: List[CalendarDay]


