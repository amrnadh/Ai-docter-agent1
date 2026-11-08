"""Rebuild the local RAG vector index from the PDFs in app/data/raw.

Run this whenever the embedding model changes (vectors from different
embedding models are not comparable), then commit app/data/qdrant_db.

    cd backend
    pip install -r requirements.txt -r requirements-ingest.txt
    python -m app.scripts.ingest_rag            # app/data/raw
    python -m app.scripts.ingest_rag --extras   # also app/data/raw_extras
    python -m app.scripts.ingest_rag --reset    # drop the old collection first
"""

import argparse
import os
import shutil

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

from app.agents.config import Config  # noqa: E402
from app.agents.rag_agent import MedicalRAG  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--extras", action="store_true", help="also ingest app/data/raw_extras")
    parser.add_argument("--reset", action="store_true", help="delete the existing index before ingesting")
    args = parser.parse_args()

    config = Config()
    if args.reset:
        for path in (config.rag.vector_local_path, config.rag.doc_local_path):
            if os.path.isdir(path):
                shutil.rmtree(path)
                print(f"Removed {path}")

    rag = MedicalRAG(config)
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    dirs = ["raw"] + (["raw_extras"] if args.extras else [])
    for d in dirs:
        result = rag.ingest_directory(os.path.abspath(os.path.join(data_dir, d)))
        print(d, "->", result)


if __name__ == "__main__":
    main()
