import React, { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const QUICK_ACTION_LABELS = {
  buy: "What are the steps to buy a property?",
  sell: "What are the steps to sell a property?",
  rent: "What are the steps to rent a property?",
  locality: "Tell me about property localities and price ranges in Delhi NCR.",
  rules: "Explain property rules, stamp duty, and RERA regulations.",
};

const WELCOME_MSG = {
  id: "welcome",
  role: "bot",
  content: "Hi! I'm your Lagan Lakshmi property assistant 🏠\n\nI can help you with:\n- **Steps to buy, sell, or rent** property\n- **Locality information** and pricing\n- **Rules & regulations** (stamp duty, RERA, loans)\n- **PDF document** Q&A and summarization\n\nHow can I help you today?",
  timestamp: new Date().toISOString(),
  sources: [],
};

const ChatWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [pdfStatus, setPdfStatus] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = useCallback((role, content, sources = []) => {
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), role, content, timestamp: new Date().toISOString(), sources },
    ]);
  }, []);

  const sendMessage = useCallback(async (text, quickAction = null) => {
    if (!text.trim() || loading) return;

    addMessage("user", text);
    setInput("");
    setLoading(true);

    try {
      // Map local messages to the format expected by the backend
      const chatHistory = messages
        .filter(m => m.role !== 'system' && m.id !== 'welcome')
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
        .slice(-10); // Keep last 10 messages for context

      const res = await fetch(`${API_BASE}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          chat_history: chatHistory,
          use_rag: !!pdfStatus // Enable RAG if a PDF was successfully processed
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      addMessage("bot", data.response);
    } catch (err) {
      addMessage("bot", "Sorry, I'm having trouble connecting. Please try again shortly.");
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId, addMessage]);

  const handleQuickAction = useCallback((key) => {
    sendMessage(QUICK_ACTION_LABELS[key], key.match(/^(buy|sell|rent)$/) ? key : null);
  }, [sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) {
      setPdfStatus({ type: "error", message: "Please upload a valid PDF file." });
      return;
    }

    setPdfLoading(true);
    setPdfStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", sessionId);
    formData.append("summarize", "true");

    try {
      const res = await fetch(`${API_BASE}/api/documents/summarize`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setPdfStatus({ type: "success", message: `✅ "${file.name}" indexed. You can now ask questions about it!` });
      if (data.summary) {
        addMessage("bot", `**Summary of "${file.name}":**\n\n${data.summary}`);
      }
    } catch (err) {
      setPdfStatus({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="chat-widget" role="dialog" aria-label="Property assistant chatbot">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar" aria-hidden="true">🏠</div>
          <div>
            <div className="chat-title">Property Assistant</div>
            <div className="chat-subtitle">Lagan Lakshmi Infra · Online</div>
          </div>
        </div>
        <button className="chat-close" onClick={onClose} aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} disabled={loading} />

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="msg-row bot">
            <div className="msg-avatar" aria-hidden="true">🏠</div>
            <div className="msg-bubble bot">
              <div className="typing-dots" aria-label="Assistant is typing">
                <span/><span/><span/>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* PDF Upload */}
      {showPdfUpload && (
        <div className="pdf-upload-area">
          <div
            className="pdf-drop-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files[0]);
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF document"
          >
            {pdfLoading ? "⏳ Processing PDF..." : "📎 Click or drag a property PDF here"}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          {pdfStatus && (
            <div className="pdf-result">{pdfStatus.message}</div>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <button
          className={`pdf-toggle-btn ${showPdfUpload ? "active" : ""}`}
          onClick={() => setShowPdfUpload((v) => !v)}
          aria-label="Toggle PDF upload"
          title="Upload property PDF"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </button>
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Ask about buying, renting, localities..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Type your message"
        />
        <button
          className="send-btn"
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;