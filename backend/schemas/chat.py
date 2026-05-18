from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = []
    session_id: Optional[str] = "default"
    use_rag: Optional[bool] = False # Set to true to query uploaded documents

class ChatResponse(BaseModel):
    response: str
    
class SummaryResponse(BaseModel):
    summary: str
