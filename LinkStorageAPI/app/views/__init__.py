from flask import Flask
from .routes import bp as routes_bp
from app.views.v1.device import bp as device_bp
from app.views.v1.link import bp as link_bp
from app.views.v1.fcm import bp as fcm_bp


def route(flask_app: Flask):
    handle_exception_func = flask_app.handle_exception
    handle_user_exception_func = flask_app.handle_user_exception
    # - register blueprint
    flask_app.register_blueprint(routes_bp)
    flask_app.register_blueprint(device_bp)
    flask_app.register_blueprint(link_bp)
    flask_app.register_blueprint(fcm_bp)

    flask_app.handle_exception = handle_exception_func
    flask_app.handle_user_exception = handle_user_exception_func
