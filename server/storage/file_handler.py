import json
from pathlib import Path

from typing import Optional

from config.settings import PROMPTS_FILE

DEFAULT_DATA = {"prompts": []}


def _ensure_file_exists(file_path: Path) -> None:
    """Create the JSON file and parent directories if they do not exist."""
    file_path.parent.mkdir(parents=True, exist_ok=True)

    if not file_path.exists():
        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(DEFAULT_DATA, file, indent=2, ensure_ascii=False)
            file.write("\n")


def read_json(file_path: Optional[Path] = None) -> dict:
    """
    Read data from the JSON file.
    Returns default structure if the file is missing or empty.
    """
    path = file_path or PROMPTS_FILE

    try:
        _ensure_file_exists(path)

        with open(path, "r", encoding="utf-8") as file:
            content = file.read().strip()

            if not content:
                return DEFAULT_DATA.copy()

            data = json.loads(content)

            if not isinstance(data, dict) or "prompts" not in data:
                return DEFAULT_DATA.copy()

            if not isinstance(data["prompts"], list):
                return DEFAULT_DATA.copy()

            return data

    except json.JSONDecodeError:
        raise ValueError("Prompts file contains invalid JSON.")
    except OSError as error:
        raise OSError(f"Unable to read prompts file: {error}") from error


def write_json(data: dict, file_path: Optional[Path] = None) -> None:
    """Write data to the JSON file with safe formatting."""
    path = file_path or PROMPTS_FILE

    try:
        _ensure_file_exists(path)

        with open(path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
            file.write("\n")

    except OSError as error:
        raise OSError(f"Unable to write prompts file: {error}") from error
