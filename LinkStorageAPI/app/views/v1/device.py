from flask import Blueprint, jsonify, request, Response
from app.models.members import Member
from app.views.utils import random_char


bp = Blueprint('v1_device', __name__, url_prefix='/v1/device')


@bp.route('/save', methods=['POST'])
def save():

    member = Member.checkDevice(request.json["device_id"])

    if member is None:
        m_obj = {
            "username": random_char(12),
            "device_id": request.json["device_id"],
            "platform": request.json["platform"]
        }

        member = Member(m_obj)
        Member.save(member)

    return jsonify({
        "username": member.username
    })


@bp.route("/updatefcm", methods=['POST'])
def updateFCM():
    member = Member.getUserId(request.json["username"])

    Member.updateFCM(member, request.json["fcm_token"])

    return jsonify({
        "success": True
    })
