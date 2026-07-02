# Prayer Atlas — Python API Service

This is the FastAPI backend service for Prayer Atlas. It handles processing, background jobs, imports, and complex server-side logic that goes beyond what Supabase handles directly.

## Getting started

```bash
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn supabase pydantic python-dotenv
uvicorn main:app --reload
```

## Environment variables

Create a `.env` file with the following:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_supabase_jwt_secret
```

## Folder structure (planned)

```
services/api/
  main.py                  # FastAPI app entry point
  routers/
    regions.py
    requests.py
    missionaries.py
    orgs.py
    admin.py
  models/
    region.py
    request.py
    missionary.py
  jobs/
    digest.py              # Scheduled email digests
    expiry.py              # Archive expired requests
    import_geo.py          # GeoJSON region importer
  middleware/
    auth.py                # Supabase JWT verification
  utils/
    geo.py                 # Geospatial helpers
```
