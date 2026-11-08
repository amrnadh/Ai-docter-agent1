# Deploying MedSage (free tier)

```
 Vercel (Next.js)  ──JWT──▶  HF Space: medsage-api (FastAPI, 16GB RAM)
        │                         ├──▶ Supabase Postgres
     Clerk auth                   ├──▶ Gemini / Groq / Tavily APIs
                                  ├──▶ local Qdrant index (committed)
                                  └──▶ HF Spaces: medsage-pytorch, medsage-tensorflow
```

Everything here is $0/month. Free HF Spaces sleep after ~48h idle; the
imaging pages ping `/api/v1/ml/status` on open, which wakes them and shows a
"warming up" banner instead of an error.

## 1. New accounts and keys

Fill `.env` (backend) from `.env.example` and `frontend/.env.local` from
`frontend/.env.example`.

| Service | Where | Notes |
|---|---|---|
| Clerk | dashboard.clerk.com → API Keys | Use the **same instance** in frontend and backend. Add your Vercel domain under Domains / allowed origins. |
| Supabase | Project → Database → Session pooler URI | Fresh project: migrations run automatically on backend start. Then `python -m app.scripts.seed_doctors`. |
| Google AI Studio | aistudio.google.com/apikey | `GEMINI_API_KEY` and `GOOGLE_API_KEY` |
| Groq | console.groq.com/keys | |
| Tavily | app.tavily.com | |
| Hugging Face | hf.co/settings/tokens (write) | Only for deploying; runtime token only if Spaces are private |
| Vapi, ElevenLabs | optional | Features degrade gracefully without them |

## 2. Rebuild the RAG index (once, after changing embedding models)

The committed index was built with the retired `text-embedding-004`, so it
must be rebuilt with the current Gemini embedding model:

```bash
cd backend
pip install -r requirements.txt -r requirements-ingest.txt
python -m app.scripts.ingest_rag --reset
git add app/data/qdrant_db app/data/docs_db
```

## 3. Backend + models → Hugging Face Spaces

```bash
cd backend
huggingface-cli login
python3 push_spaces_to_hf.py pytorch tensorflow   # model servers
python3 push_spaces_to_hf.py api --secrets        # backend + keys from ../.env
```

Backend URL: `https://<hf-username>-medsage-api.hf.space` (check `/health`).
If a Space shows "Scheduling failure", run `python3 push_spaces_to_hf.py --restart`.

## 4. Frontend → Vercel

Project root: `frontend`. Add the variables from `frontend/.env.example`, with
`NEXT_PUBLIC_API_URL` set to the backend URL above. Then add the Vercel domain
to `CORS_ORIGINS` on the backend Space and to Clerk's allowed origins.
