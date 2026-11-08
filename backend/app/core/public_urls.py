"""Build browser-reachable URLs for files the API serves (see app/main.py)."""

import os
from urllib.parse import quote

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
RAG_IMAGES_DIR = os.path.join(DATA_DIR, "parsed_docs")  # served at /rag-images
RAG_DOCS_DIR = os.path.join(DATA_DIR, "raw")            # served at /rag-docs


def public_url(mount: str, filename: str) -> str:
    """e.g. public_url("rag-images", "x.png") -> https://api.example/rag-images/x.png.

    Uses PUBLIC_API_URL, else the host Hugging Face Spaces sets for us.
    """
    space_host = os.getenv("SPACE_HOST")
    default = f"https://{space_host}" if space_host else "http://localhost:8000"
    base = os.getenv("PUBLIC_API_URL", default).rstrip("/")
    return f"{base}/{mount}/{quote(os.path.basename(filename))}"
