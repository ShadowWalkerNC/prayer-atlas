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
def list_regions():
    """Return all top-level country regions."""
    sb = get_supabase()
    res = sb.table("regions").select("*").eq("type", "country").execute()
    return res.data


@router.get("/{slug}")
def get_region(slug: str):
    """Return a single region by slug."""
    sb = get_supabase()
    res = sb.table("regions").select("*").eq("slug", slug).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Region not found")
    return res.data


@router.get("/{slug}/requests")
def get_region_requests(slug: str):
    """Return approved prayer requests for a region."""
    sb = get_supabase()
    region = sb.table("regions").select("id").eq("slug", slug).single().execute()
    if not region.data:
        raise HTTPException(status_code=404, detail="Region not found")
    res = sb.table("prayer_requests") \
        .select("*") \
        .eq("region_id", region.data["id"]) \
        .eq("status", "approved") \
        .execute()
    return res.data


@router.get("/{slug}/missionaries")
def get_region_missionaries(slug: str):
    """Return active missionaries linked to a region."""
    sb = get_supabase()
    region = sb.table("regions").select("id").eq("slug", slug).single().execute()
    if not region.data:
        raise HTTPException(status_code=404, detail="Region not found")
    res = sb.table("missionaries") \
        .select("*") \
        .eq("region_id", region.data["id"]) \
        .eq("status", "active") \
        .execute()
    return res.data
