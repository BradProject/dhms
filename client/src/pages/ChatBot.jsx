import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./chatbot.css";

// Connect socket to backend
const socket = io("https://dhms-79l7.onrender.com");

export default function ChatBot() {
  const initialMessage = [
  { sender: "bot", text: "Hello!  I'm your Digital Assistant. Ask me about digital hubs, training, or ICT programs." }
];


  const [messages, setMessages] = useState(initialMessage);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Listen for bot replies
  useEffect(() => {
    socket.on("bot reply", (msg) => {
      // Show "typing..." before displaying the bot response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: msg }]);
      }, 1000); // Typing delay
    });

    return () => socket.off("bot reply");
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    socket.emit("chat message", input);
    setInput("");
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setMessages(initialMessage);
    setInput("");
    setIsTyping(false);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setMessages(initialMessage);
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {/* Floating chat button */}
      {!isOpen && (
        <div className="chat-toggle-btn" onClick={handleOpenChat}>
          <span className="chat-toggle-text">Chat with us</span>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot">
          <div className="chat-header">
            Ask About Digital Hubs
            <span className="close-btn" onClick={handleCloseChat}>
              ✖
            </span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="msg bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
