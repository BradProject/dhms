

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./logs.css";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      const allLogs = res.data;

      // 🔥 Filter out logs older than 5 days
      const now = new Date();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      const recentLogs = allLogs.filter((log) => new Date(log.timestamp) >= fiveDaysAgo);

      setLogs(recentLogs);
      setFiltered(recentLogs);
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  };

  // 🔍 Handle search + date filters
  useEffect(() => {
    let data = [...logs];

    if (search.trim()) {
      data = data.filter(
        (l) =>
          l.action?.toLowerCase().includes(search.toLowerCase()) ||
          l.details?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      data = data.filter((l) => {
        const t = new Date(l.timestamp);
        return t >= from && t <= to;
      });
    }

    setFiltered(data);
  }, [search, fromDate, toDate, logs]);

  return (
    <div className="logs-container">
      <header className="logs-header">
        <h2>📜 Hub Activity Logs (Last 5 Days)</h2>
        <div className="logs-filters">
          <input
            type="text"
            placeholder="Search by action or hub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="logs-date-range">
            <label>
              From:
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </label>
          </div>
        </div>
      </header>

      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>Hub Name</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((log, idx) => (
                <tr key={log._id}>
                  <td>{idx + 1}</td>
                  <td>{log.action}</td>
                  <td>{log.details?.name || "—"}</td>
                  <td>
                    {log.details?.county
                      ? `County: ${log.details.county}`
                      : JSON.stringify(log.details || {}, null, 2)}
                  </td>
                  <td>
                    {new Date(log.timestamp).toLocaleString("en-KE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-logs">
                  No logs found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
