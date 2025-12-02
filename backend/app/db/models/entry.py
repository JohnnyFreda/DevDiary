from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True, index=True)
    date = Column(Date, nullable=False, index=True)
    title = Column(String, nullable=True)
    body = Column(Text, nullable=True)
    looking_ahead = Column(Text, nullable=True)  # Tasks/projects for tomorrow
    mood = Column(Integer, nullable=False)  # 1-5
    focus_score = Column(Integer, nullable=True)  # 1-10
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="entries")
    project = relationship("Project", back_populates="entries")
    tags = relationship("Tag", secondary="entry_tags", back_populates="entries")


