

// src/hubs/TrackerModal.jsx
import React, { useMemo } from "react";
import "./tracker.css";

// Target hubs for KPI/progress tracking
const HUB_TARGET = 1450;

const TrackerModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  // Calculate overall progress
  const totalHubs = (stats.planning || 0) + (stats.development || 0) + (stats.operational || 0);
  const percentComplete = totalHubs > 0 ? Math.round((stats.operational / totalHubs) * 100) : 0;
  const targetPercent = Math.min(((totalHubs / HUB_TARGET) * 100).toFixed(1), 100);

  // Circle dimensions for SVG progress ring
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentComplete / 100) * circumference;

  return (
    <div className="tracker-overlay">
      <div className="tracker-card">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>📊 Hub Development Tracker</h2>

        {/* Circular progress for operational hubs */}
        <div className="progress-ring-wrapper">
          <svg className="progress-ring" width={size} height={size}>
            <circle
              className="progress-ring-bg"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              className="progress-ring-bar"
              stroke="#16a34a"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="progress-label">
            <span>{percentComplete}%</span>
            <small>Operational</small>
          </div>
        </div>

        {/* Horizontal target progress bar */}
        <div className="tracker-target">
          <p>
            Total hubs: <b>{totalHubs}</b> / {HUB_TARGET} ({targetPercent}%)
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${targetPercent}%` }} />
          </div>
        </div>

        {/* Breakdown by hub status */}
        {/* <div className="tracker-stats">
          <p>🟡 Planning: {stats.planning || 0}</p>
          <p>🔵 Development: {stats.development || 0}</p>
          <p>🟢 Operational: {stats.operational || 0}</p>
        </div> */}

        {/* Optional: Simple bar chart */}
        <div className="status-bar-chart">
          {["planning", "development", "operational"].map((key) => {
            const val = stats[key] || 0;
            const barPercent = totalHubs > 0 ? (val / totalHubs) * 100 : 0;
            const color =
              key === "planning" ? "#facc15" : key === "development" ? "#2563eb" : "#16a34a";
            return (
              <div key={key} className="bar-row">
                <span className="bar-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ width: `${barPercent}%`, backgroundColor: color }}
                  />
                </div>
                <span className="bar-value">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackerModal;
