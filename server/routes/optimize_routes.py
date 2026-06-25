from flask import Blueprint, jsonify, request

from services.gemini_service import optimize_prompt as run_optimization

optimize_bp = Blueprint("optimize", __name__, url_prefix="/api/optimize")


def success_response(data, status_code=200):
    """Return a standardized success response."""
    return jsonify({"success": True, "data": data}), status_code


def error_response(message, status_code=400):
    """Return a standardized error response."""
    return jsonify({"success": False, "message": message}), status_code


@optimize_bp.route("", methods=["POST"])
def optimize():
    """Optimize a user prompt using Gemini AI."""
    payload = request.get_json(silent=True)

    if payload is None or not isinstance(payload, dict):
        return error_response("Request body must be a valid JSON object.", 400)

    user_prompt = payload.get("prompt")

    if user_prompt is None:
        return error_response("prompt is required.", 400)

    if not isinstance(user_prompt, str):
        return error_response("prompt must be a string.", 400)

    if not user_prompt.strip():
        return error_response("prompt is required.", 400)

    optimized_prompt, error_message, status_code = run_optimization(user_prompt)

    if error_message:
        return error_response(error_message, status_code)

    return success_response({"optimizedPrompt": optimized_prompt}, 200)
