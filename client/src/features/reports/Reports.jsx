

import React, { useRef, useState, useEffect } from "react";
import API from "../../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import "./report.css";

export default function Reports() {
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [charts, setCharts] = useState({});
  const pdfRef = useRef();

  //  Fetch counties for dropdown
  useEffect(() => {
    const loadCounties = async () => {
      try {
        const res = await API.get("/hubs/counties");
        setCounties(res.data || []);
      } catch (err) {
        console.error("Error loading counties:", err);
      }
    };
    loadCounties();
  }, []);

  // Fetch KPI data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Since backend exposes /reports/kpis, we use that
        // const res = await API.get("/reports/kpis");
        const res = await API.get(`/reports/kpis?county=${selectedCounty}`);

        setCharts(res.data || {});
      } catch (err) {
        console.error("Failed to load report data:", err);
      }
    };
    loadData();
  }, [selectedCounty]);


// Export PDF with official header and date
const handleDownloadPDF = async () => {
  const input = pdfRef.current;

  // Capture current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create a high-quality screenshot of the report
  const canvas = await html2canvas(input, {
  scale: 2,
  ignoreElements: (element) => element.classList.contains("no-print"),
});

  const imgData = canvas.toDataURL("image/png");

  // Initialize PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // === Add Kenyan Government Header ===
  try {
    const logoUrl = `${window.location.origin}/kenya_logo.png`;
    const logoBlob = await fetch(logoUrl).then((res) => res.blob());
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });

    // Add logo centered at the top
    pdf.addImage(logoBase64, "PNG", pageWidth / 2 - 10, 10, 20, 20);
  } catch (err) {
    console.warn("Logo not found or failed to load:", err);
  }

  // Text headers
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Republic of Kenya", pageWidth / 2, 40, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(
    "The Ministry of Information, Communications and the Digital Economy (MICDE)",
    pageWidth / 2,
    48,
    { align: "center" }
  );

  pdf.setFontSize(10);
  pdf.text(
    `Innovation Hub Analytics Report ${
      selectedCounty !== "all" ? `– ${selectedCounty}` : ""
    }`,
    pageWidth / 2,
    56,
    { align: "center" }
  );

  // === Add Date on Top-Right ===
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text(`Date: ${formattedDate}`, pageWidth - 20, 20, { align: "right" });

  // === Separator line ===
  pdf.setDrawColor(0);
  pdf.line(20, 60, pageWidth - 20, 60);

  // === Add Screenshot Below Header ===
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth - 20;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 10, 65, pdfWidth, pdfHeight);

  // === Save the file with date in filename ===
  const dateSlug = today.toISOString().split("T")[0]; // e.g., 2025-10-10
  pdf.save(`InnovationHub-Report-${selectedCounty}-${dateSlug}.pdf`);
};


  const COLORS = ["#1abc9c", "#f39c12", "#e74c3c", "#3498db", "#9b59b6", "#2ecc71"];

  const hubsByStatus = charts.hubsByStatus || [];
  const topHubs = charts.topHubs || [];
  const servicesDistribution = charts.servicesDistribution || [];
  const hubGrowth = charts.hubGrowth || [];
  const peopleByCounty = charts.peopleByCounty || [];


  return (
    <div className="report-container" ref={pdfRef}>
      {/* Header */}
      <header className="report-header">
        <h2 className="report-title">
          📈 Innovation Hub Analytics{" "}
          {selectedCounty !== "all" && <span>– {selectedCounty}</span>}
        </h2>
        <div className="report-controls no-print">
  <select
    className="chart-select"
    value={selectedCounty}
    onChange={(e) => setSelectedCounty(e.target.value)}
  >
    <option value="all">All Counties</option>
    {counties.map((c) => (
      <option key={c.name} value={c.name}>
        {c.name} ({c.count})
      </option>
    ))}
  </select>

  <button onClick={handleDownloadPDF} className="download-btn">
    <Download size={16} /> Export PDF
  </button>
</div>

      </header>

      {/* KPI Summary */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <h3>Total Hubs</h3>
          <p>{charts.totalHubs || 0}</p>
        </div>
        {/* <div className="kpi-card">
          <h3>Total Funding</h3>
          <p>KES {charts.totalFunding?.toLocaleString() || 0}</p>
        </div> */}
        <div className="kpi-card">
          <h3>Total People Trained</h3>
          <p>{charts.totalPopulation?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="chart-grid">
        {/* Hubs by Status */}
        <div className="chart-box">
          <h3>🏢 Hubs by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hubsByStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {hubsByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Hubs by County */}
        <div className="chart-box">
          <h3>🌍 Top 10 Hubs by County</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topHubs}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Services Offered Distribution */}
        <div className="chart-box">
          <h3>🧩 Services Offered Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicesDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {servicesDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hubs Growth Over Time */}
        <div className="chart-box">
          <h3>📅 Hubs Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hubGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2ecc71" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* People Trained by County */}
        <div className="chart-box">
          <h3>👥 People Trained by County</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peopleByCounty} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="county" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="trained" fill="#9b59b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
