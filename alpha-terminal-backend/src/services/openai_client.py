from openai import OpenAI

class OpenAIClient:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API Key must be set in environment variables.")
        self.client = OpenAI(api_key=self.api_key)

    def generate_response(self, prompt: str):
        response = self.client.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        return response.choices[0].text.strip()