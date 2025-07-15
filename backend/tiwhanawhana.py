# Tiwhanawhana: Kaitiaki AI Backend 🐺

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from assistant_routes import router as assistant_router
from shared.supabase_client import supabase
from shared.openai_client import get_card_metadata
from shared.ocr import extract_text
from typing import Optional
from datetime import datetime
import csv
import io
import os

app = FastAPI()
app.include_router(assistant_router, prefix="/assistant")

@app.get("/")
def root():
    return {"message": "Tiwhanawhana backend is online. AWAOOOO!"}

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend operational."}

@app.post("/scan-card")
async def scan_card(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text(contents)
        metadata = get_card_metadata(text)

        supabase.storage.from_("ocr-images").upload(file.filename, contents)
        supabase.table("ocr_logs").insert({
            "filename": file.filename,
            "text": text,
            "metadata": metadata,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"card_text": text, "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/price-check")
async def price_check(name: str = Form(...)):
    return {"card_name": name, "estimated_price": "TBC"}

@app.post("/list-card")
async def list_card(
    name: str = Form(...),
    rarity: str = Form(...),
    price: float = Form(...),
    image_url: Optional[str] = Form(None)
):
    supabase.table("card_listings").insert({
        "name": name,
        "rarity": rarity,
        "price": price,
        "image_url": image_url,
        "listed": True,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    return {"status": "listed", "card": name, "price": price}

@app.get("/logs")
def get_logs():
    logs = supabase.table("ocr_logs").select("*").order("created_at", desc=True).limit(5).execute()
    return {"logs": logs.data}

@app.get("/env-check")
def env_check():
    return {
        "SUPABASE_URL": os.getenv("SUPABASE_URL"),
        "SUPABASE_KEY": "SET" if os.getenv("SUPABASE_KEY") else "MISSING",
        "OPENAI_API_KEY": "SET" if os.getenv("OPENAI_API_KEY") else "MISSING"
    }

@app.post("/stamp")
def stamp_scan(filename: str = Form(...)):
    supabase.table("ocr_logs").update({"verified": True}).eq("filename", filename).execute()
    return {"status": "stamped", "filename": filename}

@app.post("/clear-logs")
def clear_logs():
    supabase.table("ocr_logs").delete().neq("id", "").execute()
    return {"status": "cleared"}

@app.get("/export-csv")
def export_csv():
    listings = supabase.table("card_listings").select("*").order("created_at", desc=True).execute()
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["name", "rarity", "price", "image_url"])
    writer.writeheader()
    for card in listings.data:
        writer.writerow({
            "name": card.get("name"),
            "rarity": card.get("rarity"),
            "price": card.get("price"),
            "image_url": card.get("image_url") or ""
        })
    return Response(content=output.getvalue(), media_type="text/csv")

# ---------------- SQL for Supabase ----------------

# ocr_logs
'''
create table ocr_logs (
  id uuid primary key default gen_random_uuid(),
  filename text,
  text text,
  metadata jsonb,
  verified boolean default false,
  created_at timestamptz default now()
);
'''

# card_listings
'''
create table card_listings (
  id uuid primary key default gen_random_uuid(),
  name text,
  rarity text,
  price numeric,
  image_url text,
  listed boolean default true,
  created_at timestamptz default now()
);
'''

# storage bucket (manually create in Supabase):
# Name: ocr-images
# Public: true

# ---------------- Shared Files ----------------

# shared/supabase_client.py
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# shared/ocr.py
import pytesseract
from PIL import Image
import io

def extract_text(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image)

# shared/openai.py
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_card_metadata(text: str) -> dict:
    prompt = f"""
    You are a Dragon Ball Super Fusion World card expert. Based on the OCR text below, identify the card's name, rarity, and set if possible:

    OCR Text:
    {text}

    Respond in JSON format with fields: name, rarity, set, number.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

