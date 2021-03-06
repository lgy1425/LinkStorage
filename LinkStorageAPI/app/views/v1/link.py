from flask import Blueprint, jsonify, request, Response
from app.models.link import Category
from app.models.link import Link, Alarm
from app.models.members import Member
import requests
from bs4 import BeautifulSoup
from urllib.request import urlretrieve
from app.views.utils import random_char, deEmojify
import subprocess


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


def parsingSite(url):
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

        try:
            title = soup.find("title").get_text()
        except:
            title = domain

        try:
            html = deEmojify(html)
            innertext = soup.get_text()
        except:
            html = ""
            innertext = ""

        fav_filename = random_char(12) + ".jpg"
        try:
            urlretrieve("https://www.google.com/s2/favicons?domain=" +
                        domain, "/usr/src/images/" + fav_filename)
        except:
            print("Here is local")

        icon = "https://lsapi.ggpark.kr/images/" + fav_filename

        return html, innertext, title, icon, domain


@bp.route("/update/link", methods=["POST"])
def updateLink():

    link = Link.get(request.json["id"])

    if "url" in request.json and link.url != request.json["url"]:
        url = request.json["url"]

        html, innertext, title, icon, domain = parsingSite(url)
        request.json["html"] = html
        request.json["innertext"] = innertext
        request.json["title"] = title
        request.json["icon"] = icon
        request.json["domain"] = domain
        request.json["pdf_url"] = ""

    try:
        link = Link.update(request.json)
    except:
        request.json["html"] = ""
        request.json["innertext"] = ""
        link = Link.update(request.json)

    return jsonify({
        "success": True,
        "link": Link.encode(link)
    })


@bp.route("/create/link", methods=["POST"])
def createLink():

    member = Member.getUserId(request.json["username"])

    try:
        url = request.json["url"]
        html, innertext, title, icon, domain = parsingSite(url)
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

        try:
            link = Link(l_obj)
            Link.save(link)
        except:
            l_obj["html"] = ""
            l_obj["innertext"] = ""
            link = Link(l_obj)
            Link.save(link)

        return jsonify({
            "success": True,
            "link": Link.encode(link)
        })
    except:
        return jsonify({
            "success": False
        })


@bp.route("/get/links", methods=["GET"])
def getLinks():

    member = Member.getUserId(request.args["username"])

    links = Link.getLinks(request.args, member.id)

    return jsonify({"links": Link.encodes(links)})


@bp.route("/get/link")
def getLink():

    return jsonify({"link": Link.getOne(int(request.args["id"]))})


@bp.route("/set/pdf")
def setPDF():
    link = Link.get(int(request.args["id"]))

    if link.pdf_url and len(link.pdf_url) > 0:
        return jsonify({"pdf_url": link.pdf_url})
    else:
        subprocess.call(['xvfb-run', 'wkhtmltopdf', link.url, str(link.id) + '.pdf'],
                        cwd="/usr/src/images/")
        # subprocess.call(['wkhtmltopdf', link.url, str(link.id) + '.pdf'],
        #                 cwd="/Users/mediwhale/Downloads/100samples/")

        pdf_url = "https://lsapi.ggpark.kr/images/" + str(link.id) + '.pdf'

        Link.update({"id": link.id, "pdf_url": pdf_url})

        return jsonify({"pdf_url": pdf_url})


@bp.route("/update/alarm", methods=["POST"])
def updateAlarm():
    alarm_id = int(request.json["id"])

    display_time = request.json["display_time"]
    alarm_time = display_time[0:16]

    if alarm_id == -1:
        a_json = {
            "link_id": int(request.json["link_id"]),
            "display_time": display_time,
            "local_timezone": int(request.json["local_timezone"]),
            "alarm_time": alarm_time
        }

        alarm = Alarm(a_json)
        Alarm.save(alarm)

    else:
        alarm = Alarm.get(alarm_id)

        a_json = {
            "link_id": int(request.json["link_id"]),
            "display_time": display_time,
            "local_timezone": int(request.json["local_timezone"]),
            "alarm_time": alarm_time,
            "deleted_at": None
        }

        Alarm.update(alarm_id, a_json)

    return jsonify({"success": True})


@bp.route("/delete/alarm", methods=["POST"])
def deleteAlarm():

    alarm = Alarm.delete(int(request.json["id"]))

    return jsonify({
        "success": True
    })
