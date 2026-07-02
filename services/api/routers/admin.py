from fastapi import APIRouter, HTTPException, Body
from supabase import create_client
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

def get_supabase():
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    )


class ReviewAction(BaseModel):
    status: str  # approved or rejected
    reviewer_notes: Optional[str] = None
    reviewer_id: Optional[str] = None


@router.get("/queue")
def get_queue():
    sb = get_supabase()
    return sb.table("moderation_queue").select("*").eq("status", "pending").execute().data


@router.patch("/queue/{id}")
def review_item(id: str, action: ReviewAction):
    sb = get_supabase()
    from datetime import datetime, timezone
    res = sb.table("moderation_queue").update({
        "status": action.status,
        "reviewer_notes": action.reviewer_notes,
        "reviewer_id": action.reviewer_id,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", id).execute()
    return res.data


@router.get("/stats")
def get_stats():
    sb = get_supabase()
    total_requests = sb.table("prayer_requests").select("id", count="exact").execute().count
    total_missionaries = sb.table("missionaries").select("id", count="exact").execute().count
    pending_queue = sb.table("moderation_queue").select("id", count="exact").eq("status", "pending").execute().count
    return {
        "total_requests": total_requests,
        "total_missionaries": total_missionaries,
        "pending_moderation": pending_queue,
    }
