from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from services.supabase_client import supabase
from routes import logs, scan_card, price_check, list_card

env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(scan_card.router)
app.include_router(price_check.router)
app.include_router(list_card.router)

@app.get("/")
def root():
    return {"message": "Tiwhanawhana backend is online. AWAOOOO!"}