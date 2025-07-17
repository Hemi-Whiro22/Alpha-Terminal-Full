def extract_card_metadata(text: str) -> dict:
    # Function to extract metadata from card text
    metadata = {}
    # Example extraction logic (to be customized based on actual card text format)
    lines = text.splitlines()
    for line in lines:
        if "Name:" in line:
            metadata["name"] = line.split("Name:")[1].strip()
        elif "Rarity:" in line:
            metadata["rarity"] = line.split("Rarity:")[1].strip()
        elif "Price:" in line:
            metadata["price"] = float(line.split("Price:")[1].strip().replace("$", ""))
    return metadata

def format_card_metadata(metadata: dict) -> str:
    # Function to format card metadata for display or storage
    formatted_metadata = f"Card Name: {metadata.get('name', 'Unknown')}\n"
    formatted_metadata += f"Rarity: {metadata.get('rarity', 'Unknown')}\n"
    formatted_metadata += f"Price: ${metadata.get('price', 0.0):.2f}\n"
    return formatted_metadata