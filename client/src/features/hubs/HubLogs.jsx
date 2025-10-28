import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./hubs.css"; // Reuse your styling

export default function HubLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.hubName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hubs-container">
      <header className="hubs-header">
        <h2>📜 Hub Activity Logs</h2>
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hubs-search"
        />
      </header>

      <div className="hubs-table-wrapper">
        <table className="hubs-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Hub Name</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.action}</td>
                <td>{log.hubName || "-"}</td>
                <td>{log.details}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
