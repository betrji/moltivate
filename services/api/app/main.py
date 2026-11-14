from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from . import crud
from .database import init_db
from .routers import challenges, health, sessions, teams, users

app = FastAPI(
    title="Moltivate backend foundation",
    description=(
        "Off-chain drafts and progress tracking only. No camera, wallet, "
        "escrow, or verification worker is wired up yet; see architecture.md."
    ),
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.exception_handler(crud.NotFoundError)
def handle_not_found(request: Request, exc: crud.NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(crud.ConflictError)
def handle_conflict(request: Request, exc: crud.ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": str(exc)})


app.include_router(health.router)
app.include_router(users.router)
app.include_router(challenges.router)
app.include_router(teams.router)
app.include_router(sessions.router)
