#!/bin/bash

echo "🛠 Setting up Tiwhanawhana Backend..."

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install fastapi[all] openai supabase pytesseract pillow python-dotenv

if [ ! -f .env ]; then
  echo "Creating .env template..."
  cat <<EOT >> .env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
OPENAI_API_KEY=your-openai-api-key
EOT
fi

echo "✅ Setup complete! To run the backend:"
echo "source .venv/bin/activate && uvicorn main:app --reload"
