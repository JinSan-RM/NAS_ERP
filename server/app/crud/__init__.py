# server/app/crud/__init__.py
from .inventory import inventory
from .purchase_request import purchase_request

__all__ = ["inventory", "purchase_request"]