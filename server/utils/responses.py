# pyrefly: ignore [missing-import]
from flask import jsonify

def success_response(data, status_code=200):
    """Return a standardized success response."""
    return jsonify({"success": True, "data": data}), status_code

def error_response(message, status_code=400):
    """Return a standardized error response."""
    return jsonify({"success": False, "message": message}), status_code
