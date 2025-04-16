import asyncio
import json
from typing import List
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.api.routes.rag.assistant_chain import process_question 

router = APIRouter(prefix="/rag" , tags=["rag_chatbot"])


class ClientMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ClientMessage]

async def rag_stream_generator(response_text: str, protocol: str):
    # Simulate streaming by splitting response into tokens (words)
    for token in response_text.split():
        if protocol == 'text':
            yield f"{token} "
            await asyncio.sleep(0.02)  # Simulate processing delay
        elif protocol == 'data':
            yield f'0:{json.dumps(token + " ")}\n'
            await asyncio.sleep(0.02)
    
    if protocol == 'data':
        yield 'd:{"finishReason":"stop"}\n'

@router.post("/api/chat")
async def chat_endpoint(request: ChatRequest, protocol: str = Query('data')):
    try:
        # Extract conversation history and latest message
        messages = [msg.content for msg in request.messages]
        latest_message = messages[-1] if messages else ""
        
        # Get RAG response (assuming process_question returns full text)
        response_text = process_question(question=latest_message, messages=messages)
        
        # Create streaming response
        stream = rag_stream_generator(response_text, protocol)
        return StreamingResponse(stream, media_type="text/plain", headers={'x-vercel-ai-data-stream': 'v1'})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
