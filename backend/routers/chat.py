from fastapi import APIRouter, HTTPException
from schemas.chat import ChatRequest, ChatResponse
from services.rag_pipeline import rag_service
import traceback

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Predefined quick actions
        quick_actions = {
            "Steps to Buy": "Please provide a detailed step-by-step guide on how to buy a property through Laganlakshmi.",
            "Steps to Sell": "What is the complete process to sell my property through Laganlakshmi?",
            "Steps to Rent": "What are the steps involved in renting out a property?"
        }
        
        query = quick_actions.get(request.message, request.message)
        
        answer = await rag_service.answer_question(
            query=query,
            chat_history=request.chat_history,
            use_rag=request.use_rag
        )
        return ChatResponse(response=answer)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

