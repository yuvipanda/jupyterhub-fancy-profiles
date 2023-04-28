import os
from tornado.web import StaticFileHandler


HERE = os.path.dirname(__file__)

TEMPLATE_PATHS = [os.path.join(HERE, 'templates')]

STATIC_HANDLER_TUPLE = (
    '/kubespawner-dynamic-building-ui/static/(.*)',
    StaticFileHandler,
    {"path": os.path.join(HERE, "static")}
)
