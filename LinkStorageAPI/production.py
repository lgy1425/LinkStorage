import os

from app import create_app
from config.app_config import ProductionLevelConfig
from config.db_config import ProductionDBConfig
from datetime import datetime
from flask_script import Manager
from flask_migrate import MigrateCommand

# if 'SECRET_KEY' not in os.environ:
#    raise Warning('The secret key must be passed by the <SECRET_KEY> envvar.')

app = create_app(ProductionLevelConfig, ProductionDBConfig)

manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    manager.run()
