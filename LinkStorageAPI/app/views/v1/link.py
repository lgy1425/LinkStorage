from flask import Blueprint, jsonify, request, Response
from app.models.link import Category
from app.models.link import Link
from app.models.members import Member
import requests
from bs4 import BeautifulSoup
from urllib.request import urlretrieve
from app.views.utils import random_char, deEmojify


bp = Blueprint('v1_link', __name__, url_prefix='/v1/link')


@bp.route('/get/categories', methods=['GET'])
def getCategories():

    member = Member.getUserId(request.args["username"])

    categories = Category.getCategories(member.id)

    return jsonify({
        "categories": Category.encodes(categories)
    })


@bp.route("/create/category", methods=["POST"])
def createCategory():

    member = Member.getUserId(request.json["username"])
    c_obj = {
        "user_id": member.id,
        "color": request.json["color"],
        "name": request.json["name"]
    }

    category = Category(c_obj)
    Category.save(category)

    return jsonify({
        "category": Category.encode(category)
    })


@bp.route("/update/category", methods=["POST"])
def updateCategory():

    category = Category.update(int(request.json["id"]), request.json[
                               "name"], request.json["color"])

    return jsonify({
        "category": Category.encode(category)
    })


@bp.route("/delete/category", methods=["POST"])
def deleteCategory():

    category = Category.delete(int(request.json["id"]))

    return jsonify({
        "category": Category.encode(category)
    })


@bp.route("/delete/link", methods=["POST"])
def deleteLink():

    link = Link.delete(int(request.json["id"]))

    return jsonify({
        "link": Link.encode(link)
    })


@bp.route("/update/link",methods=["POST"])
def updateLink() :

    link = Link.update(request.json)

    return jsonify({
            "success": True,
            "link": Link.encode(link)
        })

@bp.route("/create/link", methods=["POST"])
def createLink():

    member = Member.getUserId(request.json["username"])

    url = request.json["url"]

    domin = ""
    if url.startswith("http://"):
        domain = url[7:].split("?")[0].split("/")[0]
    elif url.startswith("https://"):
        domain = url[8:].split("?")[0].split("/")[0]
    else:
        url = "http://" + url
        domain = url[7:].split("?")[0].split("/")[0]

    response = requests.get(request.json["url"])
    if response.ok:
        html = response.text
        html = html.replace("\t", "").replace("\n", "")
        soup = BeautifulSoup(html, "html.parser")
        title = soup.find("title").get_text()
        html = deEmojify(html)
        innertext = soup.get_text()
        innertext = deEmojify(innertext)

        fav_filename = random_char(12) + ".jpg"

        urlretrieve("https://www.google.com/s2/favicons?domain=" +
                    domain, "/usr/src/images/" + fav_filename)

        icon = "https://lsapi.ggpark.kr/images/" + fav_filename
        category_id = request.json["category_id"]
        description = request.json["description"]

        l_obj = {
            "user_id": member.id,
            "url": url,
            "icon": icon,
            "title": title,
            "description": description,
            "html": html,
            "category_id": category_id,
            "domain": domain,
            "innertext": innertext
        }

        link = Link(l_obj)
        Link.save(link)

        return jsonify({
            "success": True,
            "link": Link.encode(link)
        })

    else:
        return jsonify({
            "success": False
        })


@bp.route("/get/links",methods=["GET"])
def getLinks() :

    links = Link.getLinks(request.args)

    return jsonify({"links":links})
