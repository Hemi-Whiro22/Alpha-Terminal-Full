from fastapi import APIRouter, Form

router = APIRouter()

@router.post("/price-check")
async def price_check(name: str = Form(...)):
    return {"card_name": name, "estimated_price": "TBC"}