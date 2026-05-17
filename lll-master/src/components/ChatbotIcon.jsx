import React, { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";
import "../assets/css/chatbot.css";

const ChatbotIcon = () => {
  const [open, setOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    if (open) setHasNotification(false);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {open && <ChatWidget onClose={() => setOpen(false)} />}
      <button
        className="chatbot-icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close property assistant" : "Open property assistant"}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {hasNotification && !open && (
          <span className="chatbot-badge" aria-label="New notification" />
        )}
      </button>
    </>
  );
};

export default ChatbotIcon;