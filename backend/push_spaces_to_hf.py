"""
Deploy MedSage to Hugging Face Spaces (free Docker hosting, 16GB RAM).

    huggingface-cli login                      # once, with a write token
    python3 push_spaces_to_hf.py               # all three Spaces
    python3 push_spaces_to_hf.py api           # just the FastAPI backend
    python3 push_spaces_to_hf.py api --secrets # also copy backend keys from ../.env
    python3 push_spaces_to_hf.py --restart     # factory-restart (fixes "Scheduling failure")

Set HF_USERNAME to deploy under a different account (default: Amar-nadh).
"""

import argparse
import os

from huggingface_hub import HfApi

HERE = os.path.dirname(os.path.abspath(__file__))
USERNAME = os.getenv("HF_USERNAME", "Amar-nadh")

API_README = """---
title: MedSage API
emoji: 🩺
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

FastAPI backend for MedSage (multi-agent medical assistant). See /docs.
"""

SPACES = {
    "api": {
        "repo_name": "medsage-api",
        "local_dir": HERE,
        "ignore": [
            "venv/*", "**/__pycache__/*", "*.pyc", ".DS_Store", "**/.DS_Store", "uploads/*",
            "hf-space-*/*", "app/data/raw_extras/*", "app/data/parsed_docs/*",
            "push_spaces_to_hf.py", "upload_models_to_hf.py", ".env",
        ],
        "readme": API_README,
    },
    "pytorch": {"repo_name": "medsage-pytorch", "local_dir": os.path.join(HERE, "hf-space-pytorch")},
    "tensorflow": {"repo_name": "medsage-tensorflow", "local_dir": os.path.join(HERE, "hf-space-tensorflow")},
}

# Backend env vars copied as Space secrets with --secrets. Everything else in
# .env (frontend-only keys) is deliberately left out.
BACKEND_SECRETS = [
    "DATABASE_URL", "GEMINI_API_KEY", "GOOGLE_API_KEY", "GROQ_API_KEY", "TAVILY_API_KEY",
    "ELEVEN_LABS_API_KEY", "HUGGINGFACE_TOKEN",
    "CLERK_SECRET_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_ISSUER", "CORS_ORIGINS",
    "HF_PYTORCH_SPACE_URL", "HF_TENSORFLOW_SPACE_URL", "GEMINI_MODEL", "GEMINI_EMBEDDING_MODEL",
    "PUBLIC_API_URL",
]


def read_env(path: str) -> dict:
    values = {}
    if not os.path.exists(path):
        return values
    for line in open(path):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            values[k.strip()] = v.strip().strip('"').strip("'")
    return values


def push(api: HfApi, key: str, sync_secrets: bool) -> None:
    spec = SPACES[key]
    repo_id = f"{USERNAME}/{spec['repo_name']}"
    print(f"\n🚀 {repo_id}")
    api.create_repo(repo_id, repo_type="space", space_sdk="docker", exist_ok=True)
    api.upload_folder(
        repo_id=repo_id,
        repo_type="space",
        folder_path=spec["local_dir"],
        ignore_patterns=spec.get("ignore", [".*"]),
        commit_message="Deploy from local",
    )
    if key == "api":
        # Only the figures cited in RAG answers, not the 60MB of page renders.
        api.upload_folder(
            repo_id=repo_id, repo_type="space",
            folder_path=os.path.join(HERE, "app", "data", "parsed_docs"),
            path_in_repo="app/data/parsed_docs",
            allow_patterns=["*-picture-*.png"],
            commit_message="Deploy RAG figures",
        )
    if "readme" in spec:
        api.upload_file(path_or_fileobj=spec["readme"].encode(), path_in_repo="README.md",
                        repo_id=repo_id, repo_type="space")
    if sync_secrets and key == "api":
        env = read_env(os.path.join(HERE, "..", ".env"))
        for name in BACKEND_SECRETS:
            if env.get(name):
                api.add_space_secret(repo_id, name, env[name])
                print(f"   🔑 {name}")
    print(f"   ✅ https://huggingface.co/spaces/{repo_id}  (build takes ~5-10 min)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("spaces", nargs="*", help=f"any of: {', '.join(SPACES)} (default: all)")
    parser.add_argument("--secrets", action="store_true", help="copy backend keys from ../.env into the api Space")
    parser.add_argument("--restart", action="store_true", help="factory-restart instead of uploading")
    args = parser.parse_args()
    unknown = set(args.spaces) - set(SPACES)
    if unknown:
        parser.error(f"unknown space(s): {', '.join(sorted(unknown))}")
    api = HfApi()

    for key in args.spaces or list(SPACES):
        if args.restart:
            repo_id = f"{USERNAME}/{SPACES[key]['repo_name']}"
            api.restart_space(repo_id, factory_reboot=True)
            print(f"🔄 Restarting {repo_id}")
        else:
            push(api, key, args.secrets)


if __name__ == "__main__":
    main()
