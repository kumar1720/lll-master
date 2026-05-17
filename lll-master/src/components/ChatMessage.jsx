import React from "react";

const formatMessage = (text) => {
  // Convert **bold**, bullet lists, and newlines
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n/g, "<br/>");
};

const ChatMessage = ({ message }) => {
  const isBot = message.role === "bot";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`msg-row ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <div className="msg-avatar" aria-hidden="true">🏠</div>
      )}
      <div>
        <div
          className={`msg-bubble ${isBot ? "bot" : "user"}`}
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
        {isBot && message.sources?.length > 0 && (
          <div className="msg-sources">
            📄 Source: {message.sources.map((s) => s.file).join(", ")}
          </div>
        )}
        <div className={`msg-time ${isBot ? "" : "text-right"}`}>{time}</div>
      </div>
      {!isBot && (
        <div className="msg-avatar" aria-hidden="true">👤</div>
      )}
    </div>
  );
};

export default ChatMessage;