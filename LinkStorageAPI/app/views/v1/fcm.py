from flask import Blueprint, jsonify, request, Response
import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
import datetime
from app.models.link import Alarm,Link
from app.models.members import Member

bp = Blueprint('v1_fcm', __name__, url_prefix='/v1/fcm')

cred = credentials.Certificate("/www/cert/linkstorage-6bc08-firebase-adminsdk-2wwmp-39429e8954.json")
firebase_admin.initialize_app(cred)


@bp.route('/test')
def test():

    registration_token = ['cHgicLx3ekz_vW8gNNFrmF:APA91bH4rm-CSBPEgRlOG88TPsQfhz_2Hb7qyqBavE7l0B1MKw6PWhd2FPcEehb7YZ7kCYO8aKF2EeVPFLlqcaF9QLM890FmtRozD5Y04R4fjiWKeifiYvqMaydy_HwVeRGpq3qeVUy-',
                          'ckMXyMQIiEYmg3Hfc9SJ7v:APA91bHiklqkIN1Sik8VZTDVfWjMqJax8JNKihAtFcUv0WecKpWBY65HlOBaCrnsa1HYVXzHbw-tcVld4sEFWQVkCyHA2l4VBj5yUKdfmGU0YmukEose-BbyGcrO2BfMVChe7SIx85cP']

    message = messaging.MulticastMessage(
        data={
            'score': '850',
            'time': '2:45',
            "title": "test",
            "body": "test"
        },
        notification=messaging.Notification(
            title='This is a Notification Title',
            body='This is a Notification Body',
        ),
        tokens=registration_token,
    )

    # Send a message to the device corresponding to the provided
    # registration token.
    response = messaging.send_multicast(message)
    # Response is a message ID string.
    print('Successfully sent message:', response)

    return "success"


@bp.route("/send")
def send() :

    now = datetime.datetime.now(datetime.timezone.utc)
    now = datetime.datetime.strftime(now,"%Y-%m-%dT%H:%M")

    alarms = Alarm.getAlarmsInTime(now)

    for alarm in alarms :
        link = Link.get(alarm.link_id)
        member = Member.get(link.user_id)
        message = messaging.Message(
            data={
                'link_id': str(link.id)
            },
            notification=messaging.Notification(
                title='LinkStorage Alarm',
                body=link.title,
            ),
            token=member.fcm_token,
        )

        response = messaging.send(message)

    return "success"

