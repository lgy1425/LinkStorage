"""empty message

Revision ID: fa772e051e34
Revises: aeb699c69ba9
Create Date: 2021-03-30 20:13:03.332857

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa772e051e34'
down_revision = 'aeb699c69ba9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('alarm',
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('link_id', sa.Integer(), nullable=True),
    sa.Column('display_time', sa.DateTime(), nullable=True),
    sa.Column('local_timezone', sa.String(length=20), nullable=True),
    sa.Column('alarm_time', sa.String(length=30), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.Column('noti_id', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['link_id'], ['link.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('alarm')
    # ### end Alembic commands ###
