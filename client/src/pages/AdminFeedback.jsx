import React, { useEffect, useState } from "react";
import "./admin-feedback.css";

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch feedback data from backend
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      let url = "https://kenya-digital-hubs-management-system-scyd.onrender.com/api/feedback";

      const params = [];
      if (search) params.push(`search=${search}`);
      if (statusFilter) params.push(`status=${statusFilter}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await fetch(url);
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Failed to load feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [search, statusFilter]);

  return (
    <section className="admin-feedback-section">
      <h2 className="admin-feedback-title">📋 Feedback Management</h2>

      {/* Filters */}
      <div className="admin-feedback-filters">
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading-text">Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <p className="no-feedback-text">No feedback found.</p>
      ) : (
        <div className="table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.name}</td>
                  <td>{fb.email}</td>
                  <td className="message-cell">
                    {fb.message.length > 40
                      ? fb.message.substring(0, 40) + "..."
                      : fb.message}
                  </td>
                  <td>
                    <span className={`status-badge ${fb.status}`}>
                      {fb.status}
                    </span>
                  </td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedFeedback(fb)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedFeedback && (
        <div className="feedback-modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div
            className="feedback-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Feedback Details</h3>
            <p><strong>Name:</strong> {selectedFeedback.name}</p>
            <p><strong>Email:</strong> {selectedFeedback.email}</p>
            <p><strong>Message:</strong> {selectedFeedback.message}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${selectedFeedback.status}`}>
                {selectedFeedback.status}
              </span>
            </p>
            <p><strong>Submitted on:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
            <button className="close-btn" onClick={() => setSelectedFeedback(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
