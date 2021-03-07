from flask import Flask
from .routes import bp as routes_bp


def route(flask_app: Flask):
    handle_exception_func = flask_app.handle_exception
    handle_user_exception_func = flask_app.handle_user_exception
    # - register blueprint
    flask_app.register_blueprint(routes_bp)

    flask_app.handle_exception = handle_exception_func
    flask_app.handle_user_exception = handle_user_exception_func
