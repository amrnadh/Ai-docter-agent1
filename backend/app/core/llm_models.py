"""Single source of truth for hosted LLM / embedding model names.

Google retires Gemini model versions regularly (1.5 and 2.0 are gone), so
every call site reads the name from here, and each can be overridden with an
env var without a code change.
"""

import os
from typing import List, Optional

from langchain_google_genai import GoogleGenerativeAIEmbeddings

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001")
# gemini-embedding-001 supports Matryoshka truncation; 768 keeps vectors
# small and compatible with the Qdrant collection's configured size.
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "768"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


class GeminiEmbeddings(GoogleGenerativeAIEmbeddings):
    """Gemini embeddings that always request EMBEDDING_DIM-sized vectors."""

    def embed_documents(self, texts: List[str], *args, output_dimensionality: Optional[int] = None, **kwargs):
        return super().embed_documents(texts, *args, output_dimensionality=output_dimensionality or EMBEDDING_DIM, **kwargs)

    def embed_query(self, text: str, *args, output_dimensionality: Optional[int] = None, **kwargs):
        return super().embed_query(text, *args, output_dimensionality=output_dimensionality or EMBEDDING_DIM, **kwargs)

    async def aembed_documents(self, texts: List[str], *args, output_dimensionality: Optional[int] = None, **kwargs):
        return await super().aembed_documents(texts, *args, output_dimensionality=output_dimensionality or EMBEDDING_DIM, **kwargs)

    async def aembed_query(self, text: str, *args, output_dimensionality: Optional[int] = None, **kwargs):
        return await super().aembed_query(text, *args, output_dimensionality=output_dimensionality or EMBEDDING_DIM, **kwargs)


def make_embeddings(api_key: Optional[str] = None) -> GeminiEmbeddings:
    return GeminiEmbeddings(model=GEMINI_EMBEDDING_MODEL, google_api_key=api_key or os.getenv("GOOGLE_API_KEY"))
