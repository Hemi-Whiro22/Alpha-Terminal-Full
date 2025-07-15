from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from tiwhanawhana import app as core_app
from assistant_routes import router as assistant_router
from shared.supabase_client import supabase
from shared.openai_client import get_card_metadata
from shared.ocr import extract_text

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(assistant_router, prefix="/assistant")
@app.get("/")
def root():
    return {"message": "Tiwhanawhana backend is online. AWAOOOO!"}

@app.post("/scan-card")
async def scan_card(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text(contents)
    metadata = get_card_metadata(text)
    supabase.storage.from_("ocr-images").upload(file.filename, contents)
    supabase.table("ocr_logs").insert({
        "filename": file.filename,
        "text": text,
        "metadata": metadata
    }).execute()
    return {"card_text": text, "metadata": metadata}

@app.post("/price-check")
async def price_check(name: str = Form(...)):
    return {"card_name": name, "estimated_price": "TBC"}

@app.post("/list-card")
async def list_card(name: str = Form(...), rarity: str = Form(...), price: float = Form(...)):
    supabase.table("card_listings").insert({
        "name": name,
        "rarity": rarity,
        "price": price
    }).execute()
    return {"status": "listed", "card": name, "price": price}
