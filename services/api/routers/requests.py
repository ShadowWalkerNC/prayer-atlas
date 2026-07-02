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


class PrayerRequestIn(BaseModel):
    title: str
    body: str
    region_id: str
    category: Optional[str] = None
    urgency: Optional[str] = "normal"
    visibility: Optional[str] = "public"
    missionary_id: Optional[str] = None
    organization_id: Optional[str] = None


class InteractionIn(BaseModel):
    user_id: str
    interaction_type: str  # prayed, saved, followed


@router.get("/")
def list_requests(region_id: Optional[str] = None, urgency: Optional[str] = None):
    sb = get_supabase()
    query = sb.table("prayer_requests").select("*").eq("status", "approved")
    if region_id:
        query = query.eq("region_id", region_id)
    if urgency:
        query = query.eq("urgency", urgency)
    return query.order("created_at", desc=True).execute().data


@router.get("/{id}")
def get_request(id: str):
    sb = get_supabase()
    res = sb.table("prayer_requests").select("*").eq("id", id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Request not found")
    return res.data


@router.post("/")
def create_request(payload: PrayerRequestIn):
    sb = get_supabase()
    data = payload.dict()
    data["status"] = "pending"
    res = sb.table("prayer_requests").insert(data).execute()
    return res.data


@router.post("/{id}/interact")
def interact(id: str, payload: InteractionIn):
    sb = get_supabase()
    res = sb.table("prayer_interactions").upsert({
        "request_id": id,
        "user_id": payload.user_id,
        "interaction_type": payload.interaction_type,
    }).execute()
    return res.data
