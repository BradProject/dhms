//pages/FeedbackForm.jsx
import React, { useState } from "react";
import "./feedback-form.css";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const response = await fetch("https://dhms-79l7.onrender.com/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to send feedback");

    setStatus("success");
    setFormData({ name: "", email: "", message: "" });
  } catch (error) {
    console.error("Feedback error:", error);
    setStatus("error");
  }
};

  return (
    <section className="feedback-section">
      <h2 className="feedback-title">Community Feedback</h2>
      <p className="feedback-subtitle">
        Share your thoughts about the Digital Hubs. Your feedback helps us
        improve.
      </p>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Feedback *</label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
          ></textarea>
        </div>

        <button type="submit" className="feedback-submit-btn" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Submit Feedback"}
        </button>

        {status === "success" && (
          <p className="feedback-success">Thank you for your feedback!</p>
        )}
        {status === "error" && (
          <p className="feedback-error">Something went wrong. Try again.</p>
        )}
      </form>
    </section>
  );
}
