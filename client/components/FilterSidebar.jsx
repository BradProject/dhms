import React from "react";
import "../pages/dashboard.css";
export default function FilterSidebar() {
  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>
      <label>
        County:
        <input type="text" placeholder="Enter county" />
      </label>
      <label>
        Status:
        <select>
          <option>All</option>
          <option>Active</option>
          <option>Planned</option>
          <option>Development</option>
        </select>
      </label>
      <button>Apply</button>
    </aside>
  );
}
