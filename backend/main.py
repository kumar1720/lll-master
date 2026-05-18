from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, documents
import os

app = FastAPI(
    title="Laganlakshmi AI Chatbot API",
    description="FastAPI backend for RAG-based Real Estate Chatbot",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(documents.router)

# Mount the React frontend static files
from fastapi.staticfiles import StaticFiles
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {"message": "Welcome to Laganlakshmi AI API. Powered by FastAPI & Gemini."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
