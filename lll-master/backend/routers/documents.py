from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from schemas.chat import SummaryResponse
from services.rag_pipeline import rag_service
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from core.config import settings
import tempfile
import os

router = APIRouter(prefix="/api/documents", tags=["documents"])

client = None
db = None
fs = None

def get_fs():
    global client, db, fs
    if fs is None:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB_NAME]
        fs = AsyncIOMotorGridFSBucket(db)
    return fs

async def process_pdf_background(file_id):
    grid_fs = get_fs()
    grid_out = await grid_fs.open_download_stream(file_id)
    contents = await grid_out.read()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
        temp_pdf.write(contents)
        temp_path = temp_pdf.name
        
    try:
        await rag_service.process_pdf(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    contents = await file.read()
    
    try:
        grid_fs = get_fs()
        file_id = await grid_fs.upload_from_stream(file.filename, contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving to MongoDB: {str(e)}")
        
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
        temp_pdf.write(contents)
        temp_path = temp_pdf.name
        
    try:
        result_msg = await rag_service.process_pdf(temp_path)
        return {"message": "File uploaded and processed successfully.", "details": result_msg, "file_id": str(file_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    contents = await file.read()
    
    try:
        grid_fs = get_fs()
        file_id = await grid_fs.upload_from_stream(file.filename, contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving to MongoDB: {str(e)}")
        
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
        temp_pdf.write(contents)
        temp_path = temp_pdf.name
        
    try:
        summary = await rag_service.summarize_pdf(temp_path)
        # Background process to add to vector db for subsequent chat context
        background_tasks.add_task(process_pdf_background, file_id)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing document: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

