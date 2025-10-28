import React from "react";
import "../pages/dashboard.css";
export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Kenya Digital Hubs Tracker</p>
      <nav>
        <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Contact</a>
      </nav>
    </footer>
  );
}
