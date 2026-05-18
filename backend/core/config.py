import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real Estate Chatbot API"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "real-estate")
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "laganlakshmi")
    
    class Config:
        env_file = ".env"

    def __init__(self, **values):
        super().__init__(**values)
        if self.GEMINI_API_KEY:
            self.GEMINI_API_KEY = self.GEMINI_API_KEY.strip().strip("'\"")
        if self.PINECONE_API_KEY:
            self.PINECONE_API_KEY = self.PINECONE_API_KEY.strip().strip("'\"")
        if self.MONGODB_URL:
            self.MONGODB_URL = self.MONGODB_URL.strip().strip("'\"")

settings = Settings()
