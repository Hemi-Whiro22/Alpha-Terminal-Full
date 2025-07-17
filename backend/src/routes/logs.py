from fastapi import APIRouter
from services.supabase_client import supabase

router = APIRouter()

@router.get("/logs")
async def get_logs():
    data = supabase.table("ocr_logs").select("*").order("created_at", desc=True).limit(50).execute()
    return data.data