from flask import Blueprint, jsonify, request, Response
from app.models.link import Category
from app.models.members import Member

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
