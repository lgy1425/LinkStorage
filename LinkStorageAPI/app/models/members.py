from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.base import Base
from app.extensions import login_manager


class Member(Base, UserMixin):
    id = Column(Integer, primary_key=True)

    username = Column(String(30))
    platform = Column(String(10))
    device_id = Column(String(255))
