from sqlalchemy import DateTime, Column, func
from app.extensions import db


class Base(db.Model):
    __abstract__ = True

    def __init__(self, *args):
        if len(args) != 0:
            self.__dict__.update(args[0])

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())