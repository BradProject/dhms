import React from "react";
import "../pages/dashboard.css";
export default function LatestUpdates({ items }) {
  return (
    <section className="latest-updates">
      <h3>Latest Hub Updates</h3>
      <ul>
        {items.map((hub) => (
          <li key={hub.id}>
            <strong>{hub.title}</strong> – {hub.location} ({hub.status}) [Updated: {hub.updated}]
          </li>
        ))}
      </ul>
    </section>
  );
}
