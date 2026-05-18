import os
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Pinecone as PineconeStore
from pinecone import Pinecone
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from langchain_core.messages import HumanMessage, AIMessage

from core.config import settings

def _extract_text(content) -> str:
    if isinstance(content, list):
        return content[0].get('text', '')
    return str(content)

class RAGService:
    def __init__(self):
        # Determine if we have a valid-looking Gemini API Key
        self.is_gemini_valid = (
            bool(settings.GEMINI_API_KEY)
            and settings.GEMINI_API_KEY != "your-gemini-api-key"
            and "your-gemini" not in settings.GEMINI_API_KEY.lower()
        )

        if not self.is_gemini_valid:
            print("Warning: GEMINI_API_KEY not set or invalid. Chatbot running in Offline Fallback Mode.")
            self.llm = None
            self.embeddings = None
        else:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.3
                )
                self.embeddings = GoogleGenerativeAIEmbeddings(
                    model="models/gemini-embedding-2",
                    google_api_key=settings.GEMINI_API_KEY
                )
            except Exception as e:
                print(f"Error initializing Gemini Generative AI: {e}. Falling back to Offline Mode.")
                self.is_gemini_valid = False
                self.llm = None
                self.embeddings = None

        self.index_name = settings.PINECONE_INDEX_NAME
        if settings.PINECONE_API_KEY and self.is_gemini_valid:
            try:
                self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            except Exception as e:
                print(f"Error initializing Pinecone: {e}")
                self.pc = None
        else:
            self.pc = None

        self.vector_store = self._init_vector_store()
        
        self.qa_system_prompt = """You are an expert real estate AI assistant for Laganlakshmi. 
        Use the following pieces of retrieved context to answer the user's question about properties, 
        T&Cs, and guidelines. If you don't know the answer based on the context, say that you don't know, 
        but try to provide general helpful real estate advice if applicable.
        Keep your answers concise, professional, and helpful.
        
        Context: {context}"""
        
        self.general_system_prompt = """You are an expert real estate AI assistant for Laganlakshmi.
        Provide helpful, concise, and professional advice regarding buying, selling, renting properties, 
        localities, and amenities. Provide structured responses.
        """

    def _init_vector_store(self):
        if not self.is_gemini_valid or not settings.PINECONE_API_KEY:
            print("Warning: Pinecone vector store not initialized (no key or invalid Gemini API key).")
            return None
            
        try:
            index = self.pc.Index(self.index_name)
            return PineconeStore(index, self.embeddings, "text")
        except Exception as e:
            print(f"Error initializing Pinecone index: {e}")
            return None

    def _offline_fallback(self, query: str) -> str:
        q = query.lower()
        if "buy" in q or "buying" in q or "purchase" in q:
            return (
                "### How to Buy Property with Lagan Lakshmi Infra 🏠\n\n"
                "Here are the key steps to purchase your dream property:\n"
                "1. **Locality Selection:** Browse our listings in premium locations like **Moti Nagar** (e.g., DLF One Midtown) or other premium hubs in Delhi NCR.\n"
                "2. **Site Visit:** Schedule a guided tour of the property with one of our experienced property advisors.\n"
                "3. **Verification:** Inspect the property registration details under RERA and verify the title deeds.\n"
                "4. **Booking & Token:** Pay a token amount to block the property and sign the standard Agreement to Sell.\n"
                "5. **Home Loan & Registry:** Apply for a home loan (we support associations with major banks) and proceed with the sale deed registration.\n"
                "6. **Possession:** Complete final payments, pay the required stamp duty, and take official possession of the property!"
            )
        elif "sell" in q or "selling" in q:
            return (
                "### How to Sell Your Property with Lagan Lakshmi Infra 📈\n\n"
                "Ready to list your property? Follow these easy steps:\n"
                "1. **Property Assessment:** Share details about your property's size, location, and key amenities.\n"
                "2. **Pricing & Valuation:** Our experts will help you perform a valuation to set a competitive and premium market price.\n"
                "3. **Media Listing:** We will arrange high-quality photography and virtual tour walkthroughs.\n"
                "4. **Active Showings:** We present your property to verified, high-intent buyers.\n"
                "5. **Finalizing Deal:** Once an offer is accepted, we facilitate the sale agreement drafting, legal checks, and secure transaction closure."
            )
        elif "rent" in q or "renting" in q or "lease" in q:
            return (
                "### Renting Guidelines at Lagan Lakshmi 🔑\n\n"
                "Renting a residential or commercial space is simple:\n"
                "1. **Find Listings:** Filter homes by price range, BHK, and specific amenities (like covered parking, gym, power backup).\n"
                "2. **Schedule Viewing:** Visit the property and confirm terms with the landlord (rent, security deposit, maintenance fees).\n"
                "3. **Agreement:** Sign a standard 11-month lease/rent agreement (stamped and registered).\n"
                "4. **Move-in:** Complete utility transfers and society check-in formalities."
            )
        elif "locality" in q or "delhi" in q or "ncr" in q or "moti" in q or "gurugram" in q:
            return (
                "### Premium Locality Insights (Delhi NCR) 📍\n\n"
                "- **Moti Nagar (West Delhi):** Extremely popular, featuring premium projects like **DLF One Midtown** (with pricing around ₹2.5L/month rent for 3BHK high-end apartments).\n"
                "- **Gurugram:** High demand for corporate-executive housing, offering modern amenities, high-rises, and excellent connectivity.\n"
                "- **Noida/Greater Noida:** Great for affordable and mid-range modern apartments with spacious layouts and close proximity to IT hubs."
            )
        elif "rule" in q or "guideline" in q or "rera" in q or "stamp" in q:
            return (
                "### Essential Real Estate Rules & Regulations 📋\n\n"
                "- **RERA Compliance:** Always ensure any new launch project is registered under the Real Estate Regulatory Authority (RERA) to safeguard your investment.\n"
                "- **Stamp Duty:** A mandatory registration tax. In Delhi NCR, it generally ranges between **4% to 8%** based on state laws, gender of the buyer, and property type.\n"
                "- **Bank Loan Documentation:** Keep your PAN, Aadhaar, salary slips, 3-year ITR, and property title chain records ready to secure fast mortgage approvals."
            )
        elif "document" in q or "pdf" in q or "upload" in q:
            return (
                "### Document Analysis & Q&A Feature 📎\n\n"
                "You can use the **attachment icon** in the input area to upload any property PDF or Terms & Conditions sheet.\n"
                "Once uploaded, our AI will automatically:\n"
                "1. Generate a comprehensive summary of the document.\n"
                "2. Index the document details into our memory.\n"
                "3. Answer questions specifically based on the document's content!"
            )
        else:
            return (
                "### Lagan Lakshmi Property Assistant 🏠 (Offline Mode)\n\n"
                "Hello! I am currently operating in **Offline Mode** because a valid `GEMINI_API_KEY` was not found in the configuration.\n\n"
                "However, I can help you with standard questions. Try asking about:\n"
                "- 🏠 **How to buy a property**\n"
                "- 📈 **How to sell your property**\n"
                "- 🔑 **Renting guidelines**\n"
                "- 📍 **Localities (Delhi NCR & Moti Nagar)**\n"
                "- 📋 **RERA rules, stamp duty, or guidelines**\n"
                "- 📎 **How to upload and analyze PDFs**"
            )

    async def process_pdf(self, file_path: str):
        if not self.is_gemini_valid or self.vector_store is None:
            return "Skipping Pinecone vector indexing because Gemini Generative AI or Pinecone is in offline mode."

        import asyncio
        
        def _process():
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            )
            splits = text_splitter.split_documents(docs)
            
            self.vector_store.add_documents(splits)
            return f"Successfully processed {len(splits)} text chunks."
            
        return await asyncio.to_thread(_process)

    async def summarize_pdf(self, file_path: str) -> str:
        if not self.is_gemini_valid or self.llm is None:
            return (
                "**📄 Document Uploaded Successfully!**\n\n"
                "I have saved this PDF in our system database. However, document summarization is "
                "currently offline because a valid `GEMINI_API_KEY` was not detected in the environment. "
                "Please configure a valid key in your `backend/.env` file to enable instant AI summaries!"
            )

        import asyncio
        try:
            def _load_docs():
                loader = PyPDFLoader(file_path)
                return loader.load()
                
            docs = await asyncio.to_thread(_load_docs)
            full_text = "\n\n".join([doc.page_content for doc in docs])
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert real estate analyst. Summarize the following property brochure or T&C document concisely. Highlight key amenities, rules, and important details."),
                ("user", "Document text:\n{text}")
            ])
            
            chain = prompt | self.llm
            response = await chain.ainvoke({"text": full_text[:150000]})
            return _extract_text(response.content)
        except Exception as e:
            print(f"Error during PDF summarization: {e}")
            return (
                "**📄 Document Processed**\n\n"
                f"An error occurred during summarization: {e}. Chatbot is running in fallback mode."
            )

    def _format_chat_history(self, history) -> List:
        formatted_history = []
        for msg in history:
            if msg.role == 'user':
                formatted_history.append(HumanMessage(content=msg.content))
            else:
                formatted_history.append(AIMessage(content=msg.content))
        return formatted_history

    async def answer_question(self, query: str, chat_history: List, use_rag: bool = False) -> str:
        if not self.is_gemini_valid or self.llm is None:
            return self._offline_fallback(query)

        try:
            formatted_history = self._format_chat_history(chat_history)
            
            has_vectors = False
            if self.vector_store is not None and self.pc is not None:
                try:
                    stats = self.pc.Index(self.index_name).describe_index_stats()
                    if stats.total_vector_count > 0:
                        has_vectors = True
                except Exception:
                    pass
                    
            if use_rag and has_vectors:
                retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
                
                contextualize_q_system_prompt = """Given a chat history and the latest user question \
                which might reference context in the chat history, formulate a standalone question \
                which can be understood without the chat history. Do NOT answer the question, \
                just reformulate it if needed and otherwise return it as is."""
                
                contextualize_q_prompt = ChatPromptTemplate.from_messages([
                    ("system", contextualize_q_system_prompt),
                    MessagesPlaceholder("chat_history"),
                    ("human", "{input}"),
                ])
                
                # Simple manual history aware retrieval
                history_chain = contextualize_q_prompt | self.llm
                if len(formatted_history) > 0:
                    standalone_query = await history_chain.ainvoke({
                        "input": query,
                        "chat_history": formatted_history
                    })
                    search_query = _extract_text(standalone_query.content)
                else:
                    search_query = query
                    
                docs = await retriever.ainvoke(search_query)
                context_text = "\n\n".join([doc.page_content for doc in docs])
                
                qa_prompt = ChatPromptTemplate.from_messages([
                    ("system", self.qa_system_prompt),
                    MessagesPlaceholder("chat_history"),
                    ("human", "{input}"),
                ])
                
                qa_chain = qa_prompt | self.llm
                response = await qa_chain.ainvoke({
                    "context": context_text,
                    "input": query,
                    "chat_history": formatted_history
                })
                return _extract_text(response.content)
            else:
                prompt = ChatPromptTemplate.from_messages([
                    ("system", self.general_system_prompt),
                    MessagesPlaceholder("chat_history"),
                    ("human", "{input}")
                ])
                chain = prompt | self.llm
                response = await chain.ainvoke({
                    "input": query,
                    "chat_history": formatted_history
                })
                return _extract_text(response.content)
        except Exception as e:
            print(f"Runtime error in LLM execution: {e}. Falling back to offline responses.")
            return self._offline_fallback(query)

rag_service = RAGService()
