# Laganlakshmi AI Backend

This is the FastAPI backend for the Laganlakshmi AI Chatbot. It provides a highly optimized Retrieval-Augmented Generation (RAG) pipeline designed specifically for real estate inquiries, document summarization, and interactive chatting.

## 🚀 Technology Stack
- **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **AI Framework:** [LangChain](https://python.langchain.com/)
- **LLM & Embeddings:** [Google Gemini (Generative AI)](https://ai.google.dev/)
- **Vector Database:** [Pinecone](https://www.pinecone.io/) (for similarity search)
- **Document Storage:** [MongoDB Atlas & GridFS](https://www.mongodb.com/products/platform/atlas-database) (for storing raw PDFs asynchronously via Motor)

---

## 🏗 System Architecture & Flowchart

```mermaid
graph TD
    %% Styling
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef router fill:#d0e8ff,stroke:#005bb5,stroke-width:2px;
    classDef process fill:#fff2cc,stroke:#d6b656,stroke-width:2px;
    classDef ai fill:#d5e8d4,stroke:#82b366,stroke-width:2px;
    classDef db fill:#f8cecc,stroke:#b85450,stroke-width:2px;

    %% Client Interactions
    Client((Client App)):::client

    %% API Routes
    Upload[/api/documents/upload/]:::router
    Chat[/api/chat/]:::router

    Client -->|Upload PDF| Upload
    Client -->|Ask Question| Chat

    %% Document Upload Flow
    Upload --> SaveToMongo{Save File}:::process
    SaveToMongo -->|Raw Binary| GridFS[(MongoDB GridFS)]:::db
    SaveToMongo -->|Parse Text| PyPDF[PyPDFLoader]:::process
    
    PyPDF --> Splitter[Recursive Character Text Splitter]:::process
    Splitter --> Embeddings[Google Gemini Embeddings]:::ai
    Embeddings -->|Vector Insert| Pinecone[(Pinecone Vector DB)]:::db

    %% Chat & RAG Flow
    Chat --> RAGCheck{Is RAG Enabled?}:::process
    
    RAGCheck -->|Yes| RewriteQuery[Rewrite Standalone Query based on Chat History]:::ai
    RewriteQuery --> SearchPinecone[Similarity Search in Pinecone]:::db
    SearchPinecone --> InjectContext[Inject Relevant Context into Prompt]:::process
    InjectContext --> CallLLM1[Google Gemini Flash LLM]:::ai
    CallLLM1 --> Response([Return AI Answer]):::client

    RAGCheck -->|No| CallLLM2[Google Gemini Flash LLM]:::ai
    CallLLM2 --> Response
```

---

## 🛠 Local Development Setup

### 1. Prerequisites
- Python 3.9+ 
- A MongoDB Atlas account.
- A Pinecone account.
- A Google Gemini API Key.

### 2. Installation
Create a virtual environment and install the dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables
Copy the example environment file and fill in your actual keys:
```bash
cp .env.example .env
```
Ensure your `.env` looks like this:
```env
GEMINI_API_KEY="your-gemini-api-key"
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="real-estate"
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0..."
MONGODB_DB_NAME="laganlakshmi"
```

### 4. Running the Server
```bash
python main.py
```
The server will start on `http://0.0.0.0:8000`. You can access the auto-generated Swagger UI documentation at `http://0.0.0.0:8000/docs`.

---

## 🌍 Deployment on Render

This backend is pre-configured to be deployed as a **Web Service** on [Render.com](https://render.com/).

1. Connect your GitHub repository to a new Render Web Service.
2. Set the following build configurations:
   - **Environment:** `Python`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
3. Add your Environment Variables in the Render dashboard.
4. Deploy! Render will automatically bind to the dynamic `$PORT`.
