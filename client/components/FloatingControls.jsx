import React from "react";
import "../pages/dashboard.css";
export default function FloatingControls() {
  return (
    <div className="floating-controls">
      <button className="chat-btn">💬 Chat</button>
      <button className="scroll-btn" onClick={() => window.scrollTo(0, 0)}>⬆️ Top</button>
    </div>
  );
}
