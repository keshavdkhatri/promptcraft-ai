from typing import Optional, Tuple
import json
import re
from pydantic import BaseModel, Field

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


class PromptEvaluation(BaseModel):
    score: int = Field(..., description="Overall prompt score from 0 to 100")
    clarity_score: int = Field(..., description="Clarity rating from 1 to 5")
    specificity_score: int = Field(..., description="Specificity rating from 1 to 5")
    context_score: int = Field(..., description="Context and constraints rating from 1 to 5")
    suggestions: list[str] = Field(..., description="List of 2-3 specific, actionable suggestions for improvement")


def evaluate_prompt(prompt_text: str) -> Tuple[Optional[dict], Optional[str], int]:
    """
    Evaluate a prompt using Gemini structured JSON outputs.

    Returns:
        (evaluation_dict, error_message, http_status_code)
    """
    if not prompt_text or not prompt_text.strip():
        return None, "prompt is required.", 400

    if not GEMINI_API_KEY:
        return None, "Gemini API key is not configured.", 500

    try:
        genai.configure(api_key=GEMINI_API_KEY)

        model = genai.GenerativeModel(
            GEMINI_MODEL,
            system_instruction=(
                "You are an expert prompt engineering auditor. Evaluate the user's prompt "
                "based on clarity, specificity, and context. Return a JSON object "
                "matching the requested schema."
            ),
        )

        response = model.generate_content(
            prompt_text.strip(),
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=PromptEvaluation,
            ),
        )

        if not response or not response.text:
            return None, "Gemini returned an empty response.", 502

        try:
            eval_data = json.loads(response.text.strip())
            return eval_data, None, 200
        except json.JSONDecodeError:
            return None, "Gemini returned invalid JSON format.", 502

    except google_exceptions.ResourceExhausted:
        return (
            None,
            "Gemini API rate limit exceeded. Please try again later.",
            429,
        )

    except google_exceptions.GoogleAPIError as err:
        return None, f"Gemini API request failed: {str(err)}", 502

    except Exception as err:
        return None, f"Failed to evaluate prompt: {str(err)}", 500


def test_prompt(prompt_text: str, test_input: str) -> Tuple[Optional[str], Optional[str], int]:
    """
    Run/test a prompt against Gemini, incorporating test_input.

    Returns:
        (generated_response, error_message, http_status_code)
    """
    if not prompt_text or not prompt_text.strip():
        return None, "prompt is required.", 400

    if not GEMINI_API_KEY:
        return None, "Gemini API key is not configured.", 500

    # Find brackets like [some variable]
    placeholders = re.findall(r"\[([^\]]+)\]", prompt_text)
    
    combined_prompt = prompt_text
    if placeholders and test_input.strip():
        lines = test_input.strip().split("\n")
        substituted = False
        parsed_vars = {}
        for line in lines:
            if ":" in line:
                key, val = line.split(":", 1)
                parsed_vars[key.strip().lower()] = val.strip()
            elif "=" in line:
                key, val = line.split("=", 1)
                parsed_vars[key.strip().lower()] = val.strip()
        
        if parsed_vars:
            for ph in placeholders:
                ph_lower = ph.lower()
                matched = False
                for k, v in parsed_vars.items():
                    if k in ph_lower or ph_lower in k:
                        combined_prompt = combined_prompt.replace(f"[{ph}]", v)
                        matched = True
                        substituted = True
                        break
        
        if not substituted:
            first_ph = placeholders[0]
            combined_prompt = combined_prompt.replace(f"[{first_ph}]", test_input.strip())
            substituted = True
            for ph in placeholders[1:]:
                combined_prompt = combined_prompt.replace(f"[{ph}]", "")
    else:
        if test_input.strip():
            combined_prompt = f"{prompt_text.strip()}\n\n[Test Input]:\n{test_input.strip()}"

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL)
        
        response = model.generate_content(combined_prompt)
        
        if not response or not response.text:
            return None, "Gemini returned an empty response.", 502
            
        return response.text.strip(), None, 200

    except google_exceptions.ResourceExhausted:
        return (
            None,
            "Gemini API rate limit exceeded. Please try again later.",
            429,
        )

    except google_exceptions.GoogleAPIError as err:
        return None, f"Gemini API request failed: {str(err)}", 502

    except Exception as err:
        return None, f"Failed to test prompt: {str(err)}", 500