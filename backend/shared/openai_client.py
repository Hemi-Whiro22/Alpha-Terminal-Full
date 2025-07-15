# shared/openai_client.py
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



def get_card_metadata(text: str) -> dict:
    prompt = f"""
    You are a Dragon Ball Super Fusion World card expert. Based on the OCR text below, identify the card's name, rarity, and set if possible:

    OCR Text:
    {text}

    Respond in JSON format with fields: name, rarity, set, number.
    """
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
