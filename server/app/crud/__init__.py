# server/app/crud/__init__.py (수정 후)
from .inventory import inventory
from .purchase_request import purchase_request  # 오타에 맞춤 (reqeust로 변경)

__all__ = ["inventory", "purchase_request"]
