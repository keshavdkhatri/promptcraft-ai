import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables from server/.env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Flask settings
FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

# JSON storage path
PROMPTS_FILE = BASE_DIR / "storage" / "prompts.json"
