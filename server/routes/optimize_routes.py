# pyrefly: ignore [missing-import]
from flask import Blueprint, jsonify, request

from utils.responses import success_response, error_response
from services.gemini_service import (
    optimize_prompt as run_optimization,
    evaluate_prompt as run_evaluation,
    test_prompt as run_testing,
)

optimize_bp = Blueprint("optimize", __name__, url_prefix="/api/optimize")

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


@optimize_bp.route("/evaluate", methods=["POST"])
def evaluate():
    """Evaluate a user prompt and return structured metrics."""
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

    evaluation, error_message, status_code = run_evaluation(user_prompt)

    if error_message:
        return error_response(error_message, status_code)

    return success_response(evaluation, 200)


@optimize_bp.route("/test", methods=["POST"])
def test():
    """Test a user prompt against Gemini, incorporating test_input."""
    payload = request.get_json(silent=True)

    if payload is None or not isinstance(payload, dict):
        return error_response("Request body must be a valid JSON object.", 400)

    user_prompt = payload.get("prompt")
    test_input = payload.get("testInput", "")

    if user_prompt is None:
        return error_response("prompt is required.", 400)

    if not isinstance(user_prompt, str):
        return error_response("prompt must be a string.", 400)

    if not user_prompt.strip():
        return error_response("prompt is required.", 400)

    if not isinstance(test_input, str):
        return error_response("testInput must be a string.", 400)

    test_response, error_message, status_code = run_testing(user_prompt, test_input)

    if error_message:
        return error_response(error_message, status_code)

    return success_response({"response": test_response}, 200)
