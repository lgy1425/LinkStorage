import os
from flask_script import Manager, Server
from flask_migrate import MigrateCommand

from app import create_app
from datetime import datetime
from config.app_config import LocalLevelConfig
from config.db_config import LocalDBConfig
from constants.local_run import RUN_SETTING

app = create_app(LocalLevelConfig, LocalDBConfig)

manager = Manager(app)

manager.add_command('db', MigrateCommand)
manager.add_command("runserver", Server(**RUN_SETTING))


if __name__ == "__main__":
    manager.run()
