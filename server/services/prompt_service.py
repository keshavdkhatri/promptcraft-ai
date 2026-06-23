import uuid
from datetime import datetime, timezone
from typing import Optional, Tuple

from storage.file_handler import read_json, write_json
from utils.validators import validate_prompt_payload


def _generate_id() -> str:
    """Generate a unique prompt ID."""
    return str(uuid.uuid4())


def _generate_created_at() -> str:
    """Generate an ISO8601 UTC timestamp."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def create_prompt(payload: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Create and persist a new prompt."""
    is_valid, error_message = validate_prompt_payload(payload)
    if not is_valid:
        return None, error_message

    new_prompt = {
        "id": _generate_id(),
        "title": payload["title"].strip(),
        "category": payload["category"].strip(),
        "originalPrompt": payload["originalPrompt"].strip(),
        "optimizedPrompt": payload["optimizedPrompt"],
        "createdAt": _generate_created_at(),
    }

    data = read_json()
    data["prompts"].append(new_prompt)
    write_json(data)

    return new_prompt, None


def get_all_prompts() -> list[dict]:
    """Return all saved prompts."""
    data = read_json()
    return data.get("prompts", [])


def delete_prompt(prompt_id: str) -> Tuple[bool, Optional[str]]:
    """Delete a prompt by ID. Returns (deleted, error_message)."""
    if not prompt_id or not isinstance(prompt_id, str):
        return False, "Prompt ID is required."

    data = read_json()
    prompts = data.get("prompts", [])
    updated_prompts = [prompt for prompt in prompts if prompt.get("id") != prompt_id]

    if len(updated_prompts) == len(prompts):
        return False, "Prompt not found."

    data["prompts"] = updated_prompts
    write_json(data)

    return True, None
