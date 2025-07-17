from fastapi import APIRouter, UploadFile, File
from services.supabase_client import supabase
from utils.ocr_utils import extract_text, get_card_metadata

router = APIRouter()

@router.post("/scan-card")
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