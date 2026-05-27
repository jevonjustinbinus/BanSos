import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

# Resolve .env relative to this file so it works regardless of CWD.
_ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    """Return a Supabase client for backend-only database operations.

    Use SUPABASE_SERVICE_ROLE_KEY here because this code runs in FastAPI, not in
    the browser. Never expose the service-role key to React/Vite.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. "
            "Create a .env file inside 'bansos backend/'."
        )

    return create_client(url, key)
