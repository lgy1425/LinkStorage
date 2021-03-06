from werkzeug.exceptions import HTTPException


def http_exception_handler(e: HTTPException):
    return e, e.code


def broad_exception_handler(e: Exception):
    return e, 500
