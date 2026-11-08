FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces run containers as uid 1000; the app writes uploads and
# the local Qdrant lock file, so it must own /app.
RUN useradd -m -u 1000 user
WORKDIR /app

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user . .
RUN mkdir -p uploads && chown -R user /app
USER user

# HF Spaces expect 7860; Render/Railway/Fly inject $PORT.
ENV PORT=7860
EXPOSE 7860
CMD sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --proxy-headers"
