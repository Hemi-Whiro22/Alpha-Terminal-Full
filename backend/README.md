# Alpha Terminal Backend

## Overview
The Alpha Terminal Backend is a FastAPI application designed to handle various functionalities related to card scanning, logging, and price checking. It interacts with a Supabase database for data storage and retrieval.

## Project Structure
```
alpha-terminal-backend
├── src
│   ├── main.py               # Entry point of the FastAPI application
│   ├── routes                # Contains route definitions for the API
│   │   ├── __init__.py       # Marks routes directory as a package
│   │   ├── logs.py           # Endpoint for retrieving logs
│   │   ├── scan_card.py      # Endpoint for scanning cards
│   │   ├── price_check.py     # Endpoint for checking card prices
│   │   └── list_card.py      # Endpoint for listing cards
│   ├── services              # Contains service definitions for external clients
│   │   ├── __init__.py       # Marks services directory as a package
│   │   ├── supabase_client.py # Initializes Supabase client
│   │   └── openai_client.py   # Initializes OpenAI client (if applicable)
│   └── utils                 # Contains utility functions
│       ├── __init__.py       # Marks utils directory as a package
│       ├── ocr_utils.py      # Utility functions for OCR
│       └── card_metadata.py   # Functions for card metadata processing
├── .env                      # Environment variables for configuration
├── requirements.txt          # Project dependencies
└── README.md                 # Project documentation
```

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd alpha-terminal-backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   SUPABASE_URL=<your_supabase_url>
   SUPABASE_KEY=<your_supabase_key>
   ```

5. **Run the application**:
   ```bash
   uvicorn src.main:app --reload
   ```

## Usage
- **GET /logs**: Retrieve the latest logs from the Supabase database.
- **POST /scan-card**: Upload a card image to extract text and metadata.
- **POST /price-check**: Check the estimated price of a card by name.
- **POST /list-card**: List a card with its details (name, rarity, price).

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.