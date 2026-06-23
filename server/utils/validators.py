from typing import Optional, Tuple

REQUIRED_FIELDS = ("title", "category", "originalPrompt", "optimizedPrompt")


def validate_prompt_payload(payload: Optional[dict]) -> Tuple[bool, Optional[str]]:
    """
    Validate prompt request body.
    All four fields must be present. title, category, and originalPrompt
    must be non-empty strings. optimizedPrompt may be an empty string.
    """
    if payload is None or not isinstance(payload, dict):
        return False, "Request body must be a valid JSON object."

    for field in REQUIRED_FIELDS:
        if field not in payload:
            return False, f"{field} is required."

        if not isinstance(payload[field], str):
            return False, f"{field} must be a string."

    title = payload["title"].strip()
    category = payload["category"].strip()
    original_prompt = payload["originalPrompt"].strip()

    if not title:
        return False, "title is required."

    if not category:
        return False, "category is required."

    if not original_prompt:
        return False, "originalPrompt is required."

    return True, None
