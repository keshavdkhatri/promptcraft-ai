import json
from pathlib import Path

from typing import Optional

from config.settings import PROMPTS_FILE


def read_json(file_path: Optional[Path] = None) -> dict:
    """
    Read data from the JSON file.
    Returns default structure if the file is missing or empty.
    """
    path = file_path or PROMPTS_FILE

    if not path.exists():
        return {"prompts": []}

    try:
        with open(path, "r", encoding="utf-8") as file:
            content = file.read().strip()

            if not content:
                return {"prompts": []}

            data = json.loads(content)

            if not isinstance(data, dict) or "prompts" not in data:
                return {"prompts": []}

            if not isinstance(data["prompts"], list):
                return {"prompts": []}

            return data

    except json.JSONDecodeError:
        raise ValueError("Prompts file contains invalid JSON.")
    except OSError as error:
        raise OSError(f"Unable to read prompts file: {error}") from error


def write_json(data: dict, file_path: Optional[Path] = None) -> None:
    """Write data to the JSON file with safe formatting."""
    path = file_path or PROMPTS_FILE

    try:
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
            file.write("\n")

    except OSError as error:
        raise OSError(f"Unable to write prompts file: {error}") from error
