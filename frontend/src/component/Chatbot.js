import { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const API_URL = "http://localhost:8085/chatbot/ask";
  const userId = 1;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch(
        `${API_URL}?userId=${userId}&message=${encodeURIComponent(input)}`
      );

      if (res.ok) {
        const botReply = await res.text();
        setMessages((prev) => [...prev, { sender: "Bot", text: botReply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "Bot", text: "⚠️ Error contacting chatbot" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Something went wrong!" },
      ]);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chat-header-section">
        <div className="chat-icon">💬</div>
        <div>
          <h2>AI Assistant</h2>
          <p>Ask me anything about workshops and bookings</p>
        </div>
      </div>
      
      <div className="chatbox">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Start a Conversation</h3>
            <p>Ask me about workshops, bookings, or any help you need!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="message-wrapper">
              <div className={msg.sender === "You" ? "user-msg" : "bot-msg"}>
                <div className="msg-avatar">{msg.sender === "You" ? "👤" : "🤖"}</div>
                <div className="msg-content">{msg.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>
          <span>Send</span>
          <span className="send-icon">➤</span>
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
