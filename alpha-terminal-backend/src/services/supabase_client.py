from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv

def initialize_supabase_client() -> Client:
    env_path = Path(__file__).parent.parent.parent / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    
    url: str = os.getenv("SUPABASE_URL")
    key: str = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    
    return create_client(url, key)