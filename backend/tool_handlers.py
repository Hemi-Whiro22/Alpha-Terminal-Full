# tool_handlers.py – Oracle Function Triggers 🧠

import requests
from shared.ocr import extract_text 
from shared.openai_client import get_card_metadata
from shared.supabase_client import supabase
from datetime import datetime
from fastapi import UploadFile, File, APIRouter
import base64

router = APIRouter()



@router.post("/ocr/image")
async def upload_image(image: UploadFile = File(...)):
    contents = await image.read()
    base64_str = base64.b64encode(contents).decode("utf-8")

    from shared.ocr import process_card_image  # if not already imported
    text, metadata = process_card_image(base64_str)

    return {"text": text, "metadata": metadata}



def scan_image(image_url: str):
    res = requests.get(image_url)
    if res.status_code != 200:
        return {"error": "Could not fetch image."}

    image_bytes = res.content
    text = extract_text(image_bytes)
    metadata = get_card_metadata(text)

    supabase.storage.from_("ocr-images").upload(image_url.split("/")[-1], image_bytes)
    supabase.table("ocr_logs").insert({
        "filename": image_url,
        "text": text,
        "metadata": metadata,
        "created_at": datetime.utcnow().isoformat()
    }).execute()

    return {"text": text, "metadata": metadata}


def get_market_price(card_name: str):
    # TODO: replace this stub with real market search
    return {"card_name": card_name, "estimated_price": "TBC"}


def save_listing(card_name: str, rarity: str, image_url: str, price: float):
    supabase.table("card_listings").insert({
        "name": card_name,
        "rarity": rarity,
        "price": price,
        "image_url": image_url,
        "listed": True,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    return {"status": "listed", "card": card_name, "price": price}

