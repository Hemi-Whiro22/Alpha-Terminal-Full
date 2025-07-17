from fastapi import APIRouter, Form
from services.supabase_client import supabase

router = APIRouter()

@router.post("/list-card")
async def list_card(name: str = Form(...), rarity: str = Form(...), price: float = Form(...)):
    supabase.table("card_listings").insert({
        "name": name,
        "rarity": rarity,
        "price": price
    }).execute()
    return {"status": "listed", "card": name, "price": price}