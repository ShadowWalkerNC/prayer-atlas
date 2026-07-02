from fastapi import APIRouter, HTTPException
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


class MissionaryIn(BaseModel):
    display_name: str
    bio: Optional[str] = None
    region_id: Optional[str] = None
    organization_id: Optional[str] = None
    category: Optional[str] = None
    visibility_level: Optional[str] = "public"


@router.get("/")
def list_missionaries(region_id: Optional[str] = None):
    sb = get_supabase()
    query = sb.table("missionaries").select("*").eq("status", "active")
    if region_id:
        query = query.eq("region_id", region_id)
    return query.execute().data


@router.get("/{id}")
def get_missionary(id: str):
    sb = get_supabase()
    res = sb.table("missionaries").select("*").eq("id", id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Missionary not found")
    return res.data


@router.post("/")
def create_missionary(payload: MissionaryIn):
    sb = get_supabase()
    res = sb.table("missionaries").insert(payload.dict()).execute()
    return res.data
