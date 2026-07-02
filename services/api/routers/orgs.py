from fastapi import APIRouter, HTTPException
from supabase import create_client
import os

router = APIRouter()

def get_supabase():
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    )


@router.get("/")
def list_orgs():
    sb = get_supabase()
    return sb.table("organizations").select("*").eq("verified", True).execute().data


@router.get("/{slug}")
def get_org(slug: str):
    sb = get_supabase()
    res = sb.table("organizations").select("*").eq("slug", slug).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Organization not found")
    return res.data
