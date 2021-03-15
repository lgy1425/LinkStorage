from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime, and_, Text
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.base import Base


class Category(Base):
    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("member.id"))
    name = Column(String(30))
    color = Column(String(10))
    deleted_at = Column(DateTime, nullable=True)

    @classmethod
    def get(cls, id):
        return cls.query.filter(cls.id == id).first()

    @classmethod
    def getCategories(cls, user_id):
        return cls.query.filter(and_(cls.deleted_at == None, cls.user_id == user_id)).all()

    @classmethod
    def save(cls, category):
        db.session.add(category)
        db.session.commit()

    @classmethod
    def encode(cls, category):
        c_json = {
            "id": category.id,
            "name": category.name,
            "color": category.color,
        }

        return c_json

    @classmethod
    def encodes(cls, categories):
        categories_json = []

        for c in categories:
            categories_json.append(cls.encode(c))

        return categories_json

    @classmethod
    def update(cls, id, name, color):
        category = cls.query.filter(cls.id == id).first()
        category.name = name
        category.color = color
        db.session.commit()

        return category

    @classmethod
    def delete(cls, id):
        category = cls.query.filter(cls.id == id).first()
        category.deleted_at = datetime.now()

        db.session.commit()

        return category


class Link(Base):
    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("member.id"))
    url = Column(Text)
    icon = Column(String(255))
    title = Column(String(255))
    description = Column(Text)
    html = Column(Text)
    category_id = Column(Integer, ForeignKey("category.id"))
    star = Column(Boolean)
    pdf_url = Column(String(255))

    @classmethod
    def encode(cls, link):
        l_json = {
            "id": link.id,
            "url": link.url,
            "icon": link.icon,
            "title": link.title,
            "description": link.description,
            "html": link.html,
            "category_id": link.category_id,
            "start": link.star,
            "pdf_url": link.pdf_url
        }

        return l_json

    @classmethod
    def encodes(cls, links):
        links_json = []

        for link in links:
            links_json.append(cls.encode(link))

        return links_json
