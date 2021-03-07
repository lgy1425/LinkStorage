from flask import Blueprint, render_template, redirect
from flask_login import current_user, login_required

bp = Blueprint('routes', __name__, url_prefix='/')


@bp.route('/')
def index_():
    return "index.page test"
