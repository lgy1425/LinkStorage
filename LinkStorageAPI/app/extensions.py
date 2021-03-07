from flask_cors import CORS
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
login_manager = LoginManager()


def init_sentry_sdk(app):
    if app.config["ENV"] == "production":
        init(
            integrations=[FlaskIntegration(), SqlalchemyIntegration()]
        )
