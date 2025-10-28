import React, { useEffect, useState } from "react";
import "./tracker.css";

// --- Development Tracker Card ---
function DevelopmentTracker({ hub }) {
  const milestones = (hub.milestones || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState("");

  // 🚨 Auto alert for overdue milestones
  useEffect(() => {
    if (hub.status === "development" && milestones.length > 0) {
      const overdue = milestones.find((m) => m.toLowerCase().includes("delay"));
      if (overdue) {
        alert(`⚠️ Alert: Hub "${hub.name}" has a possible delay: ${overdue}`);
      }
    }
  }, [hub, milestones]);

  const addChallenge = () => {
    if (!newChallenge.trim()) return;
    setChallenges([...challenges, { text: newChallenge, resolved: false }]);
    setNewChallenge("");
  };

  const toggleResolved = (idx) => {
    setChallenges(
      challenges.map((c, i) =>
        i === idx ? { ...c, resolved: !c.resolved } : c
      )
    );
  };

  return (
    <div className="tracker-card">
      <h4>
        {hub.name} <span className="county">({hub.county})</span>
      </h4>

      {/* 📊 Gantt-style bar */}
      <div className="gantt-bar">
        {milestones.map((m, i) => (
          <div
            key={i}
            className="gantt-segment"
            style={{
              flex: 1,
              background: i % 2 === 0 ? "#3b82f6" : "#60a5fa",
            }}
            title={m}
            onClick={() => alert(`🎉 Milestone achieved: ${m}`)}
          >
            <span className="gantt-label">{m}</span>
          </div>
        ))}
      </div>

      {/* 📝 Challenges log */}
      <div className="challenges-section">
        <h5>Challenges & Resolutions</h5>
        <div className="challenge-input">
          <input
            value={newChallenge}
            onChange={(e) => setNewChallenge(e.target.value)}
            placeholder="Log a challenge..."
          />
          <button onClick={addChallenge}>➕ Add</button>
        </div>
        <ul className="challenge-list">
          {challenges.map((c, i) => (
            <li
              key={i}
              className={c.resolved ? "resolved" : ""}
              onClick={() => toggleResolved(i)}
            >
              {c.text} {c.resolved ? "✅" : "⚠️"}
            </li>
          ))}
          {challenges.length === 0 && (
            <li className="muted">No challenges logged yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// --- Main Tracker Component ---
export default function Tracker({ hubs }) {
  return (
    <div className="dev-tracking-section">
      <h3>🚧 Development Tracking</h3>
      {hubs.some((h) => h.status === "development") ? (
        hubs
          .filter((h) => h.status === "development")
          .map((hub) => <DevelopmentTracker key={hub._id} hub={hub} />)
      ) : (
        <p className="muted">No hubs currently in development 🚀</p>
      )}
    </div>
  );
}










