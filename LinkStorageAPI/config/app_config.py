import os


class LocalLevelConfig:
    ENV = 'localhost'
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'formDEV')

    JWT_SECRET_KEY = "sm_jwt_token_secret_key"


class DevLevelConfig(LocalLevelConfig):
    SECRET_KEY = os.getenv('SECRET_KEY', 'formDEV')
    ENV = 'development'


class ProductionLevelConfig(LocalLevelConfig):
    SECRET_KEY = os.getenv('SECRET_KEY', 'formProduction')
    ENV = 'production'
