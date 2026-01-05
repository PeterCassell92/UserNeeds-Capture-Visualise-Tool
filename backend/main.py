"""User Needs Management API - Main application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routers import user_needs, user_groups, user_super_groups, metadata, setup, demo_mode

# Create FastAPI application
app = FastAPI(
    title="User Needs Management API",
    description="API for managing user needs, groups, entities, and workflow phases",
    version="2.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(demo_mode.router)
app.include_router(user_super_groups.router)
app.include_router(user_needs.router)
app.include_router(user_groups.router)
app.include_router(metadata.router)
app.include_router(setup.router)


@app.get("/")
def read_root():
    """Root endpoint providing API information."""
    return {
        "message": "User Needs Management API",
        "version": "2.0.0",
        "documentation": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
