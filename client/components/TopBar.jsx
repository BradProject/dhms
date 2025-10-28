import React from "react";
import "../pages/dashboard.css";


export default function TopBar({ date }) {
  return (
    <header className="topbar">
      <h1>Kenya Digital Hubs Tracker</h1>
      <div className="date-time">
        <span>{date.dayOfWeek}, {date.formattedDate}</span> | <span>{date.formattedTime}</span>
      </div>
    </header>
  );
}
