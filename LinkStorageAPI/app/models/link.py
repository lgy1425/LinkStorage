from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime, and_, Text, or_, Float
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash
from sqlalchemy.orm import relationship

from app.extensions import db
from app.models.base import Base

from flask import jsonify


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
    html = Column(LONGTEXT)
    category_id = Column(Integer, ForeignKey("category.id"))
    star = Column(Boolean, default=False)
    pdf_url = Column(String(255))
    domain = Column(String(255))
    innertext = Column(LONGTEXT)
    deleted_at = Column(DateTime, nullable=True)
    category = relationship("Category")

    @classmethod
    def get(cls, id):
        return cls.query.filter(cls.id == id).first()

    @classmethod
    def encode(cls, link):

        l_json = {
            "id": link.id,
            "url": link.url,
            "icon": link.icon,
            "title": link.title,
            "description": link.description,
            "category_id": link.category_id,
            "star": link.star,
            "pdf_url": link.pdf_url,
            "domain": link.domain,
            "category": {
                "name": link.category.name,
                "color": link.category.color
            }
        }

        return l_json

    @classmethod
    def getOne(cls, id):
        link = cls.query.filter(cls.id == id).first()

        alarm = Alarm.getWithLinkId(link.id)

        if alarm and not alarm.deleted_at:
            alarm_ = {
                "id": alarm.id,
                "display_time": alarm.display_time,
                "local_timezone": alarm.local_timezone
            }
        else:
            alarm_ = -1

        l_json = {
            "id": link.id,
            "url": link.url,
            "icon": link.icon,
            "title": link.title,
            "description": link.description,
            "category_id": link.category_id,
            "star": link.star,
            "pdf_url": link.pdf_url,
            "domain": link.domain,
            "alarm": alarm_
        }

        return l_json

    @classmethod
    def encodes(cls, links):
        links_json = []

        for link in links:
            links_json.append(cls.encode(link))

        return links_json

    @classmethod
    def save(cls, link):
        db.session.add(link)
        db.session.commit()

    @classmethod
    def update(cls, form):
        update_dict = {}

        for key in ["url", "icon", "title", "description", "category_id", "star", "pdf_url", "domain", "html", "innertext"]:
            if key in form:
                update_dict[key] = form[key]

        link = cls.query.filter(cls.id == int(form["id"])).first()
        link.update_with_dict(update_dict)

        db.session.commit()

        return link

    @classmethod
    def delete(cls, id):
        link = cls.query.filter(cls.id == id).first()
        link.deleted_at = datetime.now()

        db.session.commit()

        return link

    @classmethod
    def getLinks(cls, args, user_id):

        q = cls.query.filter(
            and_(cls.user_id == user_id, cls.deleted_at == None))

        if "category_id" in args:
            q = q.filter(cls.category_id == int(args["category_id"]))
        if "search_key" in args and len(args["search_key"]) > 0:
            search_key = args["search_key"]
            q = q.filter(or_(cls.title.like("%" + search_key + "%"), cls.description.like(
                "%" + search_key + "%"), cls.innertext.like("%" + search_key + "%"), cls.url.like("%" + search_key + "%")))

        offset = 0
        limit = 10

        if "offset" in args:
            offset = int(args["offset"])

        q.join(Category, isouter=True)

        return q.order_by(cls.updated_at.desc()).offset(offset * limit).limit(limit).all()


class Alarm(Base):
    id = Column(Integer, primary_key=True)

    link_id = Column(Integer, ForeignKey("link.id"))
    display_time = Column(String(30))
    local_timezone = Column(Float)
    alarm_time = Column(String(30))

    deleted_at = Column(DateTime)
    noti_id = Column(String(200))

    @classmethod
    def get(cls, id):
        return cls.query.filter(cls.id == id).first()

    @classmethod
    def getWithLinkId(cls, link_id):
        return cls.query.filter(cls.link_id == link_id).first()

    @classmethod
    def save(cls, alarm):
        db.session.add(alarm)
        db.session.commit()

    @classmethod
    def update(cls, id, j_object):

        alarm = cls.query.filter(cls.id == id).first()
        alarm.update_with_dict(j_object)

        db.session.commit()

        return alarm

    @classmethod
    def delete(cls, id):
        alarm = cls.query.filter(cls.id == id).first()
        alarm.deleted_at = datetime.now()

        db.session.commit()

        return alarm
