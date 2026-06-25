from typing import Optional, Tuple

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

from config.settings import GEMINI_API_KEY, GEMINI_MODEL

OPTIMIZATION_SYSTEM_PROMPT = (
    "You are an expert prompt engineer. Improve the user's prompt so it is "
    "clearer, more specific, and more effective for AI models. "
    "Return only the optimized prompt text with no explanations, labels, "
    "or markdown formatting."
)


def optimize_prompt(user_prompt: str) -> Tuple[Optional[str], Optional[str], int]:
    """
    Send a prompt to Gemini and return an optimized version.

    Returns:
        (optimized_prompt, error_message, http_status_code)
    """
    if not user_prompt or not user_prompt.strip():
        return None, "prompt is required.", 400

    if not GEMINI_API_KEY:
        return None, "Gemini API key is not configured.", 500

    try:
        genai.configure(api_key=GEMINI_API_KEY)

        model = genai.GenerativeModel(
            GEMINI_MODEL,
            system_instruction=OPTIMIZATION_SYSTEM_PROMPT,
        )

        response = model.generate_content(user_prompt.strip())

        if not response or not response.text:
            return None, "Gemini returned an empty response.", 502

        return response.text.strip(), None, 200

    except google_exceptions.ResourceExhausted:
        return (
            None,
            "Gemini API rate limit exceeded. Please try again later.",
            429,
        )

    except google_exceptions.GoogleAPIError:
        return None, "Gemini API request failed. Please try again later.", 502

    except Exception:
        return None, "Failed to optimize prompt. Please try again later.", 500