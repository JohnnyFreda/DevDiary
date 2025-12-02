from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    
    # Unique constraint: name must be unique per user
    __table_args__ = (UniqueConstraint("user_id", "name", name="unique_user_tag"),)
    
    # Relationships
    user = relationship("User", backref="tags")
    entries = relationship("Entry", secondary="entry_tags", back_populates="tags")


