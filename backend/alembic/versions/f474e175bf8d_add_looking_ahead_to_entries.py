"""add_looking_ahead_to_entries

Revision ID: f474e175bf8d
Revises: 001
Create Date: 2025-12-02 06:37:24.254665

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f474e175bf8d'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('entries', sa.Column('looking_ahead', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('entries', 'looking_ahead')
