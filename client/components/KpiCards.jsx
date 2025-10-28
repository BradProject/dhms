import React from "react";
import "../pages/dashboard.css";
export default function KpiCards({ data }) {
  return (
    <div className="kpi-cards">
      <div className="card">Total Hubs: {data.totalHubs}</div>
      <div className="card">Operational: {data.operationalHubs}</div>
      <div className="card">Planning: {data.planningHubs}</div>
      <div className="card">Development: {data.developmentHubs}</div>
      <div className="card">Funding: KES {data.totalFunding.toLocaleString()}</div>
    </div>
  );
}
