

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./funding.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function Funding() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    hubId: "",
    source: "NG-CDF",
    amount: 0,
    notes: "",
    allocationDate: "",
    partner: "",
  });
  const [hubs, setHubs] = useState([]);

  // Modal state
  const [editing, setEditing] = useState(null); // stores the funding being edited

  const load = async () => {
    const hubsRes = await API.get("https://dhms-79l7.onrender.com/api/hubs");
    // const hubsRes = await API.get("/hubs");
    setHubs(hubsRes.data);
    const { data } = await API.get("/funding");
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await API.post("/funding", {
      ...form,
      amount: Number(form.amount),
    });
    setForm({
      hubId: "",
      source: "NG-CDF",
      amount: 0,
      notes: "",
      allocationDate: "",
      partner: "",
    });
    load();
  };

  const startEdit = (funding) => {
    setEditing({
      ...funding,
      hubId: funding.hub?._id || funding.hubId, // ensure we have ID
    });
  };

  const updateFunding = async (e) => {
    e.preventDefault();
    await API.put(`/funding/${editing._id}`, {
      ...editing,
      amount: Number(editing.amount),
    });
    setEditing(null);
    load();
  };

  const deleteFunding = async (id) => {
    if (window.confirm("Are you sure you want to delete this funding record?")) {
      await API.delete(`/funding/${id}`);
      load();
    }
  };

  // Chart: Funding per hub
  const chartData = hubs.map((hub) => {
    const total = list
      .filter((f) => f.hub?._id === hub._id)
      .reduce((sum, f) => sum + f.amount, 0);
    return { hub: hub.name, amount: total };
  });

  // Chart: Funding by source
  const sourceTotals = list.reduce((acc, f) => {
    acc[f.source] = (acc[f.source] || 0) + f.amount;
    return acc;
  }, {});
  const sourceData = Object.entries(sourceTotals).map(([name, value]) => ({
    name,
    value,
  }));





 // Utility: filter by period
const filterByPeriod = (period) => {
  if (period === "all") return list;

  const now = new Date();
  if (period === "year") {
    return list.filter((f) => {
      return new Date(f.allocationDate).getFullYear() === now.getFullYear();
    });
  }

  if (period === "quarterly") {
    const quarter = Math.floor((now.getMonth() + 1) / 3) + 1;
    return list.filter((f) => {
      const d = new Date(f.allocationDate);
      const q = Math.floor((d.getMonth() + 1) / 3) + 1;
      return d.getFullYear() === now.getFullYear() && q === quarter;
    });
  }

  return list;
};

// Export to Excel
const exportToExcel = (period = "all") => {
  const filtered = filterByPeriod(period);

  // Calculate totals
  const totalAmount = filtered.reduce((sum, f) => sum + f.amount, 0);
  const now = new Date();
  const year = now.getFullYear();
  const quarter = Math.floor((now.getMonth() + 1) / 3) + 1;

  let summary = "";
  if (period === "year") {
    summary = `Period: Year ${year}`;
  } else if (period === "quarter") {
    summary = `Period: Quarter ${quarter}, ${year}`;
  } else {
    summary = "Period: All Data";
  }
  summary += ` | Total Funding: KES ${totalAmount.toLocaleString()}`;

  // Prepare worksheet data
  const wsData = [
    ["Republic of Kenya"],
    ["The Ministry of Information, Communications and the Digital Economy (MICDE)"],
    ["Funding Report"],
    [""], // empty row
    [summary],
    [""], // empty row
    ["Hub", "Source", "Amount (KES)", "Date", "Partner", "Notes"], // table headers
    ...filtered.map((f) => [
      f.hub?.name || "-",
      f.source,
      f.amount.toLocaleString(),
      f.allocationDate || "-",
      f.partner || "-",
      f.notes || "-",
    ]),
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style headers (basic since xlsx doesn't support rich styling out of the box)
  ws["A1"].s = { font: { bold: true, sz: 14 } };
  ws["A2"].s = { font: { italic: true, sz: 12 } };
  ws["A3"].s = { font: { bold: true, sz: 13 } };
  ws["A5"].s = { font: { italic: true, color: { rgb: "FF0000" } } };

  // Auto width
  const colWidths = [
    { wch: 20 }, // Hub
    { wch: 20 }, // Source
    { wch: 15 }, // Amount
    { wch: 15 }, // Date
    { wch: 20 }, // Partner
    { wch: 30 }, // Notes
  ];
  ws["!cols"] = colWidths;

  // Create workbook and export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Funding Report");

  XLSX.writeFile(
    wb,
    `Funding_Report_${period}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};



// Export to PDF with charts
const exportToPDF = async (period = "all") => {
  const filtered = filterByPeriod(period);
  const doc = new jsPDF("p", "mm", "a4"); // portrait A4

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Add watermark ---
  doc.setFontSize(60);
  doc.setTextColor(200, 200, 200);
  // doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight / 2, {
  //   angle: 45,
  //   align: "center",
  // });
  doc.setTextColor(0, 0, 0);

  // --- Logo ---
  const logo = `${window.location.origin}/kenya_logo.png`;
  const logoImg = await fetch(logo)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );
  doc.addImage(logoImg, "PNG", pageWidth / 2 - 10, 10, 20, 20);

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Republic of Kenya", pageWidth / 2, 40, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    "The Ministry of Information, Communications and the Digital Economy (MICDE)",
    pageWidth / 2,
    50,
    { align: "center" }
  );

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Funding Report", pageWidth / 2, 65, { align: "center" });

  // --- Underline header ---
  doc.setLineWidth(0.5);
  doc.line(20, 70, pageWidth - 20, 70);

  // --- Extended Summary Totals ---
  const totalAmount = filtered.reduce((sum, f) => sum + f.amount, 0);
  const now = new Date();
  const year = now.getFullYear();
  const quarter = Math.floor((now.getMonth() + 1) / 3) + 1;

  let periodLabel = "All Data";
  if (period === "year") {
    periodLabel = `Year ${year}`;
  } else if (period === "quarter") {
    periodLabel = `Quarter ${quarter}, ${year}`;
  }

  const summaryText = [
    `Period: ${periodLabel}`,
    `Total Funding: KES ${totalAmount.toLocaleString()}`,
  ].join("   |   ");

  // --- Draw Key Metrics Box ---
  const boxY = 80;
  const boxHeight = 20;
  doc.setDrawColor(37, 99, 235); // border color (blue)
  doc.setLineWidth(1);
  doc.rect(20, boxY, pageWidth - 40, boxHeight);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text(summaryText, pageWidth / 2, boxY + 13, { align: "center" });

  // --- Timestamp (top-right) ---
  const today = new Date().toISOString().split("T")[0];
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, pageWidth - 20, 25, { align: "right" });

  // --- Table ---
  const tableColumn = [
    "Hub",
    "Source",
    "Amount (KES)",
    "Date",
    "Partner",
    "Notes",
  ];
  const tableRows = filtered.map((f) => [
    f.hub?.name || "-",
    f.source,
    f.amount.toLocaleString(),
    f.allocationDate || "-",
    f.partner || "-",
    f.notes || "-",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: boxY + boxHeight + 15,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",

    // --- Footer with page numbers & custom message ---
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();

      doc.setFontSize(10);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );

      doc.setFontSize(9);
      doc.text(
        "Confidential – Ministry of ICT",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    },
  });

  // --- Insert Charts ---
  // Bar chart (funding per hub)
  const chart1 = document.querySelector(".chart-container canvas");
  if (chart1) {
    const imgData = chart1.toDataURL("image/png", 1.0);
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Funding per Hub (Analysis)", pageWidth / 2, 20, {
      align: "center",
    });
    doc.addImage(imgData, "PNG", 15, 30, pageWidth - 30, 120);
  }

  // Pie chart (funding by source)
  const chart2 = document.querySelectorAll(".chart-container canvas")[1];
  if (chart2) {
    const imgData = chart2.toDataURL("image/png", 1.0);
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Funding by Source (Analysis)", pageWidth / 2, 20, {
      align: "center",
    });
    doc.addImage(imgData, "PNG", 15, 30, pageWidth - 30, 120);
  }

  // Save file
  doc.save(
    `Funding_Report_${period}_${new Date().toISOString().slice(0, 10)}.pdf`
  );
};




 const [reportPeriod, setReportPeriod] = useState("all");



  //  Define a color palette
  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#9333ea",
    "#0891b2",
    "#64748b",
  ];

  return (
    <div className="funding-page">
      <h2 className="page-title">Funding Management</h2>

      {/* Funding Form */}
      <form onSubmit={save} className="funding-form">
        <select
          value={form.hubId}
          onChange={(e) => setForm({ ...form, hubId: e.target.value })}
        >
          <option value="">Select hub</option>
          {hubs.map((h) => (
            <option value={h._id} key={h._id}>
              {h.name}
            </option>
          ))}
        </select>

        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option value="NG-CDF">NG-CDF</option>
          <option value="Ministry">Ministry</option>
          <option value="Mastercard Foundation">Mastercard Foundation</option>
          <option value="KEPSA">KEPSA</option>
          <option value="County Government">County Government</option>
          <option value="Private Sector">Private Sector</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={form.allocationDate}
          onChange={(e) => setForm({ ...form, allocationDate: e.target.value })}
        />

        <input
          placeholder="Implementing Partner"
          value={form.partner}
          onChange={(e) => setForm({ ...form, partner: e.target.value })}
        />

        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button type="submit">➕ Add Funding</button>
      </form>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>📊 Funding Overview (per Hub)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hub" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>📊 Funding by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#2563eb"
              label
            >
              {sourceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    
 <h3>📑 Detailed Records</h3>
<div className="export-controls">
  
   <br></br>
  <label className="report-label">Report Period:</label>
  <select
    className="report-select"
    value={reportPeriod}
    onChange={(e) => setReportPeriod(e.target.value)}
  >
    <option value="all">All Data</option>
    <option value="year">This Year</option>
    <option value="quarter">This Quarter</option>
  </select>
</div>


<div className="export-buttons">
  <button className="ghost" onClick={() => exportToExcel(reportPeriod)}>
    📄 Export Excel
  </button>
  <button className="ghost" onClick={() => exportToPDF(reportPeriod)}>
    🖨 Export PDF
  </button>
</div>


      {/* Funding Table */}
      <div className="table-container">
        <h3>📑 Detailed Records</h3>
        <table className="funding-table">
          <thead>
            <tr>
              <th>Hub</th>
              <th>Source</th>
              <th>Amount (KES)</th>
              <th>Date</th>
              <th>Partner</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((x, i) => (
              <tr key={x._id} className={i % 2 === 0 ? "even" : "odd"}>
                <td>{x.hub?.name}</td>
                <td>{x.source}</td>
                <td className="amount">{x.amount.toLocaleString()}</td>
                <td>{x.allocationDate?.slice(0, 10) || "-"}</td>
                <td>{x.partner || "-"}</td>
                <td>{x.notes}</td>
                <td>
                  <button onClick={() => startEdit(x)}> Edit</button>
                  <button onClick={() => deleteFunding(x._id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  No funding records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
     {editing && (
  <div className="edit-hub-overlay">
    <div className="edit-hub-modal">
      <div className="edit-hub-header">
        <h2>✏️ Edit Funding Record</h2>
        <button className="close-btn" onClick={() => setEditing(null)}>
          ✖
        </button>
      </div>

      <div className="edit-hub-body">
        <form onSubmit={updateFunding}>
          <div className="grid">
            <div className="form-group">
              <label>Hub</label>
              <select
                value={editing.hubId}
                onChange={(e) => setEditing({ ...editing, hubId: e.target.value })}
              >
                <option value="">Select hub</option>
                {hubs.map((h) => (
                  <option value={h._id} key={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Funding Source</label>
              <select
                value={editing.source}
                onChange={(e) => setEditing({ ...editing, source: e.target.value })}
              >
                <option value="NG-CDF">NG-CDF</option>
                <option value="Ministry">Ministry</option>
                <option value="Mastercard Foundation">Mastercard Foundation</option>
                <option value="KEPSA">KEPSA</option>
                <option value="County Government">County Government</option>
                <option value="Private Sector">Private Sector</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Allocation Date</label>
              <input
                type="date"
                value={editing.allocationDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setEditing({ ...editing, allocationDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Implementing Partner</label>
              <input
                placeholder="Implementing Partner"
                value={editing.partner}
                onChange={(e) => setEditing({ ...editing, partner: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Amount (KES)</label>
              <input
                placeholder="Amount"
                type="number"
                value={editing.amount}
                onChange={(e) => setEditing({ ...editing, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                placeholder="Notes"
                rows="3"
                value={editing.notes}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="edit-hub-footer">
            <button type="button" className="btn cancel" onClick={() => setEditing(null)}>
              ❌ Cancel
            </button>
            <button type="submit" className="btn save">
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
