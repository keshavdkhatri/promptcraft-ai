from flask import Blueprint, jsonify, request

from services.prompt_service import (
    create_prompt as save_prompt,
    delete_prompt as remove_prompt,
    get_all_prompts,
)

prompt_bp = Blueprint("prompts", __name__, url_prefix="/api/prompts")


def success_response(data, status_code=200):
    """Return a standardized success response."""
    return jsonify({"success": True, "data": data}), status_code


def error_response(message, status_code=400):
    """Return a standardized error response."""
    return jsonify({"success": False, "message": message}), status_code


@prompt_bp.route("", methods=["POST"])
def create_prompt():
    """Save a new prompt."""
    payload = request.get_json(silent=True)

    try:
        prompt, error_message = save_prompt(payload)

        if error_message:
            return error_response(error_message, 400)

        return success_response(prompt, 201)

    except (ValueError, OSError) as error:
        return error_response(str(error), 500)


@prompt_bp.route("", methods=["GET"])
def get_prompts():
    """Return all saved prompts."""
    try:
        prompts = get_all_prompts()
        return success_response(prompts, 200)

    except (ValueError, OSError) as error:
        return error_response(str(error), 500)


@prompt_bp.route("/<prompt_id>", methods=["DELETE"])
def delete_prompt(prompt_id):
    """Delete a prompt by ID."""
    try:
        deleted, error_message = remove_prompt(prompt_id)

        if not deleted:
            status_code = 404 if error_message == "Prompt not found." else 400
            return error_response(error_message, status_code)

        return success_response({"id": prompt_id}, 200)

    except (ValueError, OSError) as error:
        return error_response(str(error), 500)
