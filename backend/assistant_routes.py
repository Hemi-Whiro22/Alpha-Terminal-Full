# assistant_routes.py – Assistants API Integration 🔮

from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from shared.openai_client import openai
from tool_handlers import scan_image, save_listing, get_market_price
import os

router = APIRouter()

ASSISTANT_ID = os.getenv("OPENAI_ASSISTANT_ID")



def handle_tool_call(tool_call):
    name = tool_call.function.name
    args = tool_call.function.arguments

    try:
        if name == "scan_image":
            return scan_image(**args)
        elif name == "save_listing":
            return save_listing(**args)
        elif name == "get_market_price":
            return get_market_price(**args)
        else:
            return {"error": f"Unknown function {name}"}
    except Exception as e:
        return {"error": str(e)}

@router.post("/thread/start")
def start_thread():
    thread = openai.beta.threads.create()
    return {"thread_id": thread.id}

@router.get("/thread/{thread_id}/history")
def thread_history(thread_id: str):
    messages = openai.beta.threads.messages.list(thread_id).data[::-1]
    return {"history": [
        {"role": m.role, "content": m.content[0].text.value}
        for m in messages if m.content
    ]}

class MessagePayload(BaseModel):
    message: str

@router.post("/thread/{thread_id}/message")
def send_message(thread_id: str, payload: MessagePayload):
    thread_id = thread_id
    message = payload.message

    openai.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message
    )

    run = openai.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ASSISTANT_ID,
        tool_choice="auto"
    )

    
    while True:
        run_status = openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        if run_status.status == "completed":
            break
        elif run_status.status == "requires_action":
            tool_outputs = []
            for tool_call in run_status.required_action.submit_tool_outputs.tool_calls:
                result = handle_tool_call(tool_call)
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": str(result)
                })
            openai.beta.threads.runs.submit_tool_outputs(
                thread_id=thread_id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )
        elif run_status.status in ["failed", "cancelled"]:
            raise HTTPException(status_code=500, detail="Run failed or cancelled")

    return {"status": "ok"}
