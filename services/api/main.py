from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import regions, requests, missionaries, orgs, admin

app = FastAPI(
    title="Prayer Atlas API",
    description="Python FastAPI backend for Prayer Atlas — handles processing, imports, jobs, and admin logic.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with deployed frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regions.router, prefix="/api/v1/regions", tags=["Regions"])
app.include_router(requests.router, prefix="/api/v1/requests", tags=["Prayer Requests"])
app.include_router(missionaries.router, prefix="/api/v1/missionaries", tags=["Missionaries"])
app.include_router(orgs.router, prefix="/api/v1/orgs", tags=["Organizations"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Prayer Atlas API"}
