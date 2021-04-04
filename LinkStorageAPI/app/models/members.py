from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime, Text
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
    fcm_token = Column(Text)

    @classmethod
    def checkDevice(cls, device_id):
        return cls.query.filter_by(device_id=device_id).first()

    @classmethod
    def getUserId(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def save(cls, member):
        db.session.add(member)
        db.session.commit()

    @classmethod
    def updateFCM(cls, member, fcm_token):
        member.fcm_token = fcm_token
        db.session.commit()

    @classmethod
    def get(cls,id) :
        return cls.query.filter(cls.id==id).first()