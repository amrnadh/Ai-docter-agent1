"""Public status of the hosted imaging models.

The frontend calls this when an imaging page opens: the call itself wakes a
sleeping free-tier Space, and the response drives the "warming up" banner.
"""

from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool

from app.core.hf_client import hf_client

router = APIRouter()


@router.get("/status")
async def ml_status():
    return await run_in_threadpool(hf_client.status)
