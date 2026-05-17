import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaUpload, FaRobot } from 'react-icons/fa';
import './RealEstateChatbot.css'; // Assume basic CSS for scrollbars/layout

const API_BASE_URL = 'http://localhost:8000/api';

const RealEstateChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Laganlakshmi real estate assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useRag, setUseRag] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickActions = ["Steps to Buy", "Steps to Sell", "Steps to Rent"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chat_history: messages.slice(-10), // Send last 10 messages for context
          use_rag: useRag
        })
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();

      setMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Is the backend running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadStatus('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading and summarizing document...');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/summarize`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      
      setUseRag(true); 
      setUploadStatus('Context is now active! You can ask questions about the document.');
      
      setMessages(prev => [...prev, 
        { role: 'user', content: `Uploaded document: ${file.name}` },
        { role: 'assistant', content: `**Document Summary:**\n${data.summary}\n\nI have read the document. What would you like to know about it?` }
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Failed to upload document.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', border: '1px solid #e0e0e0', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div style={{ padding: '15px 20px', backgroundColor: '#0056b3', color: '#fff', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaRobot /> Laganlakshmi AI</h5>
        <label style={{ fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="checkbox" checked={useRag} onChange={(e) => setUseRag(e.target.checked)} />
          Use Doc Context
        </label>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
            <div style={{
              maxWidth: '85%', padding: '12px 16px', borderRadius: '18px',
              backgroundColor: msg.role === 'user' ? '#0056b3' : '#e9ecef',
              color: msg.role === 'user' ? '#fff' : '#333',
              fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div style={{ color: '#6c757d', fontSize: '13px', fontStyle: 'italic' }}>AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '10px 15px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
        {quickActions.map((action, idx) => (
          <button 
            key={idx} 
            onClick={() => handleSendMessage(action)}
            disabled={isLoading}
            style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '20px', border: '1px solid #0056b3', backgroundColor: '#fff', color: '#0056b3', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#0056b3'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#0056b3'; }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Upload Status */}
      {uploadStatus && <div style={{ fontSize: '12px', color: '#198754', padding: '5px 15px', textAlign: 'center', backgroundColor: '#e8f5e9' }}>{uploadStatus}</div>}

      {/* Input Area */}
      <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#fff', borderRadius: '0 0 12px 12px' }}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          style={{ border: 'none', background: 'transparent', color: '#6c757d', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Upload PDF Brochure or T&C"
        >
          <FaUpload size={20} />
        </button>
        
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
          disabled={isLoading}
        />
        
        <button 
          onClick={() => handleSendMessage(input)} 
          disabled={isLoading || !input.trim()}
          style={{ border: 'none', background: '#0056b3', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', opacity: (isLoading || !input.trim()) ? 0.6 : 1 }}
        >
          <FaPaperPlane size={16} />
        </button>
      </div>
    </div>
  );
};

export default RealEstateChatbot;
