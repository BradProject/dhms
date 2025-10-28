import React, { useState, useEffect } from "react";
import "./auth.css";

export default function ResetPasswordDirect() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]); // Store all existing emails
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all existing emails when component mounts
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/all-emails");
        const data = await res.json();
        if (res.ok) setEmails(data.emails); // expected format: { emails: ["a@example.com", "b@example.com"] }
      } catch (err) {
        console.error("Failed to fetch emails:", err);
      }
    };

    fetchEmails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword: confirm }),
      });

      const data = await res.json();
      if (res.ok) setMessage(data.message);
      else setMessage("❌ " + data.message);
    } catch (err) {
      setMessage("⚠️ " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        >
          <option value="" disabled>
            Select your email
          </option>
          {emails.map((e, idx) => (
            <option key={idx} value={e}>
              {e}
            </option>
          ))}
        </select>
  <br /><br />
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
