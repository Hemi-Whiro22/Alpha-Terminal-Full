import pytesseract
from PIL import Image
import io

def extract_text(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image)

def process_card_image(base64_str: str):
    # Step 1: Extract text using OCR
    text = extract_text(base64_str)

    # Step 2: Send to metadata fetcher (via OpenAI or other logic)
    metadata = get_card_metadata(text)

    return text, metadata
