

import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../../services/api";
import "./hubs.css";
import TrackerModal from "./TrackerModal";
import "./tracker.css";
import EditHubModal from "./EditHubModal";
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
  Legend,
} from "recharts";

// Single source of truth for hub statuses
const HUB_STATUSES = [
  { value: "planning", label: "Planning" },
  { value: "development", label: "Development" },
  { value: "operational", label: "Operational" },
];

export default function Hubs() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHub, setEditingHub] = useState(null);

  const [reportPeriod, setReportPeriod] = useState("all"); 
  const [countyFilter, setCountyFilter] = useState("all"); 


  





const getFilteredForReport = () => {
  const now = new Date();
  let filtered = list;

  // --- Filter by report period ---
  if (reportPeriod === "year") {
    filtered = filtered.filter(
      h => new Date(h.createdAt).getFullYear() === now.getFullYear()
    );
  }
  if (reportPeriod === "quarter") {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    filtered = filtered.filter(h => {
      const d = new Date(h.createdAt);
      return (
        d.getFullYear() === now.getFullYear() &&
        Math.floor(d.getMonth() / 3) === currentQuarter
      );
    });
  }

  // --- Filter by county (NEW) ---
  if (countyFilter !== "all") {
    filtered = filtered.filter(
      h => h.county?.toLowerCase() === countyFilter.toLowerCase()
    );
  }

  return filtered;
};


// ---------------------------
// 📦 EXPORT TO EXCEL
// ---------------------------
const exportToExcel = (period) => {
  const data = getFilteredForReport();

  const exportData = data.map((hub) => ({
    Name: hub.name,
    County: hub.county,
    Constituency: hub.constituency,
    Ward: hub.ward,
    Type: hub.type,
    Status: hub.status,
    Programs: hub.programs?.join(", "),
    Resources: hub.resources
      ? `${hub.resources.laptops} laptops, ${hub.resources.desktops} desktops, ${hub.resources.accessPoints} APs, ${hub.resources.bandwidth} Mbps`
      : "",
    "Implementing Partner": hub.implementingPartner || "",
    "Population Enrolled": hub.populationEnrolled || 0,
    Milestones: (hub.milestones || []).join(", "),
    Coordinates:
      hub.location?.coordinates?.length === 2
        ? `${hub.location.coordinates[1]}, ${hub.location.coordinates[0]}`
        : "",
    // ✅ New Contact Fields
    "Hub Manager Name": hub.contactPerson || "",
    "Phone Number": hub.phone || "",
    "Email": hub.email || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hubs Report");

  XLSX.writeFile(
    workbook,
    `hubs_report_${period}_${
      countyFilter !== "all" ? countyFilter : "all_counties"
    }.xlsx`
  );
};

// ---------------------------
// 📄 EXPORT TO PDF
// ---------------------------
const exportToPDF = async (period = "all") => {
  const data = getFilteredForReport();
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

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
  doc.addImage(logoImg, "PNG", pageWidth / 2 - 15, 20, 30, 30);

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Republic of Kenya", pageWidth / 2, 65, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    "The Ministry of Information, Communications and the Digital Economy (MICDE)",
    pageWidth / 2,
    80,
    { align: "center" }
  );

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Digital Hubs Report", pageWidth / 2, 100, { align: "center" });

  if (countyFilter !== "all") {
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(`County: ${countyFilter}`, pageWidth / 2, 115, { align: "center" });
  }

  doc.setLineWidth(0.5);
  doc.line(
    40,
    countyFilter !== "all" ? 125 : 110,
    pageWidth - 40,
    countyFilter !== "all" ? 125 : 110
  );

  // --- Summary box ---
  const totalPopulation = data.reduce(
    (sum, hub) => sum + (hub.populationEnrolled || 0),
    0
  );
  const totalResources = data.reduce(
    (acc, hub) => {
      acc.laptops += hub.resources?.laptops || 0;
      acc.desktops += hub.resources?.desktops || 0;
      acc.accessPoints += hub.resources?.accessPoints || 0;
      acc.bandwidth += hub.resources?.bandwidth || 0;
      return acc;
    },
    { laptops: 0, desktops: 0, accessPoints: 0, bandwidth: 0 }
  );

  const summaryText = [
    `Period: ${period.toUpperCase()}`,
    `Total Population: ${totalPopulation.toLocaleString()}`,
    `Laptops: ${totalResources.laptops}`,
    `desktops: ${totalResources.desktops}`,
    `Access Points: ${totalResources.accessPoints}`,
    `Bandwidth: ${totalResources.bandwidth} Mbps`,
  ].join("   |   ");

  const boxY = 120;
  const boxHeight = 40;
  doc.setDrawColor(22, 160, 133);
  doc.setLineWidth(1);
  doc.rect(40, boxY, pageWidth - 80, boxHeight);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text(summaryText, pageWidth / 2, boxY + 25, { align: "center" });

  const today = new Date().toISOString().split("T")[0];
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, pageWidth - 40, 30, { align: "right" });

  // --- Data Table ---
  autoTable(doc, {
    startY: boxY + boxHeight + 20,
    head: [
      [
        "Name",
        "County",
        "Constituency",
        "Ward",
        "Type",
        "Status",
        "Programs",
        "Resources",
        "Partner",
        "Population",
        "Milestones",
        "Coordinates",
        // ✅ Added columns
        "Hub Manager",
        "Phone",
        "Email",
      ],
    ],
    body: data.map((hub) => [
      hub.name,
      hub.county,
      hub.constituency || "",
      hub.ward,
      hub.type,
      hub.status,
      hub.programs?.join(", ") || "",
      hub.resources
        ? `${hub.resources.laptops}L, ${hub.resources.desktops}D, ${hub.resources.accessPoints}AP, ${hub.resources.bandwidth}Mbps`
        : "",
      hub.implementingPartner || "",
      hub.populationEnrolled || 0,
      (hub.milestones || []).join(", "),
      hub.location?.coordinates?.length === 2
        ? `${hub.location.coordinates[1]}, ${hub.location.coordinates[0]}`
        : "",
      // ✅ New fields
      hub.contactPerson || "",
      hub.phone || "",
      hub.email || "",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 160, 133] },
    tableWidth: "100%",
    theme: "grid",

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

  doc.save(`hubs_report_${period}_landscape.pdf`);
};



const logAction = async (action, details = {}) => {
  try {
    await API.post("/logs", {
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};








  const [form, setForm] = useState({
  name: "",
  county: "",
  constituency: "",
  ward: "",
  type: "Innovation Hub",
  status: "planning",

  contactPerson: "",
  phone: "",
  email: "",

  milestones: "",
  lat: "",
  lng: "",
  photos: [],
  programs: [],
  resources: { laptops: "", desktops: "", accessPoints: "", bandwidth: "" },
  implementingPartner: "",
  populationEnrolled: "",
});

const fetchCoordinates = async (hubName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        hubName
      )}`
    );
    const data = await response.json();

    if (data.length > 0) {
      setForm((prev) => ({
        ...prev,
        lat: parseFloat(data[0].lat).toFixed(6),
        lng: parseFloat(data[0].lon).toFixed(6),
      }));
    } else {
      console.warn("No coordinates found for:", hubName);
    }
  } catch (error) {
    console.error("Geocode error:", error);
  }
};





  // search and filter
  const [searchName, setSearchName] = useState("");
  const [searchCounty, setSearchCounty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [searchConstituency, setSearchConstituency] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // live updates
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const pollRef = useRef(null);

  // lightbox
  const [lightbox, setLightbox] = useState({
    open: false,
    photos: [],
    index: 0,
  });

  // tracker popup
  const [showTracker, setShowTracker] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/hubs");
      setList(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  // 📸 multiple file uploads
  const handleFiles = (files) => {
    if (!files?.length) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((base64s) => {
      setForm((f) => ({ ...f, photos: [...f.photos, ...base64s] }));
    });
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
    };
    await logAction("Add Hub", { name: form.name, county: form.county });

    await API.post("/hubs", payload);
    setForm({
      name: "",
      county: "",
      ward: "",
      type: "Innovation Hub",
      status: "planning",
      milestones: "",
      lat: "",
      lng: "",
      photos: [],
      programs: [],
      resources: { laptops: "", desktops: "", accessPoints: "", bandwidth: "" },
      implementingPartner: "",
      populationEnrolled: form.populationEnrolled
    ? Number(form.populationEnrolled)
    : 0,
    });
    load();
  };

  // ✅ Update hub status and log the action
const updateStatus = async (id, newStatus) => {
  try {
    // 1. Update the hub
    await API.patch(`/hubs/${id}`, { status: newStatus });

    // 2. Log the action
    await logAction("Update Status", { hubId: id, newStatus });

    // 3. Reload hubs
    load();
  } catch (err) {
    console.error("Failed to update hub:", err);
  }
};

// ✅ Delete a hub and log the action
const deleteHub = async (id) => {
  if (!window.confirm("Are you sure you want to delete this hub?")) return;

  try {
    // 1. Delete the hub
    await API.delete(`/hubs/${id}`);

    // 2. Log the action
    await logAction("Delete Hub", { hubId: id });

    // 3. Reload hubs
    load();
  } catch (err) {
    console.error("Failed to delete hub:", err);
  }
};



  const filteredList = useMemo(() => {
  return list.filter((hub) => {
    const matchesName = hub.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchesCounty = hub.county?.toLowerCase().includes(searchCounty.toLowerCase());
    const matchesConstituency = hub.constituency?.toLowerCase().includes(searchConstituency.toLowerCase());
    const matchesType = filterType ? hub.type === filterType : true;
    const matchesStatus = filterStatus ? hub.status === filterStatus : true;
    return matchesName && matchesCounty && matchesConstituency && matchesType && matchesStatus;
  });
}, [list, searchName, searchCounty, searchConstituency, filterType, filterStatus]);

  // pagination slicing
  const totalPages = Math.ceil(filteredList.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentPageData = filteredList.slice(startIndex, startIndex + perPage);

  // chart data
  const statusCounts = useMemo(
    () =>
      HUB_STATUSES.map((s) => ({
        name: s.label,
        value: list.filter((h) => h.status === s.value).length,
      })),
    [list]
  );

  const fmtTime = (d) =>
    d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // tracker
  const trackerStats = useMemo(() => {
    const stats = { planning: 0, development: 0, operational: 0 };
    list.forEach((hub) => {
      if (hub.status in stats) stats[hub.status]++;
    });
    return stats;
  }, [list]);

  return (
    <div className="hubs-page">
      <div className="page-header">
        <h2 className="page-title">🏢 Digital Hub Inventory</h2>
        <div className="live-chip">
          <span className="pulse-dot" /> Live
          <span className="last-refresh">Updated {fmtTime(lastRefresh)}</span>
        </div>
      </div>
      {/* tracker toggle button */}
      <button className="ghost" onClick={() => setShowTracker(true)}>
        🚧 Open Development Tracker
      </button>
     <h3>📑 Add Hub Form</h3>
      <form onSubmit={save} className="hub-form inventory">
      

      <div className="form-row">
{/* ===== Contact Information Section ===== */}
<label className="contact-label">
  Hub Manager Name &nbsp;&nbsp;
  <input
    type="text"
    name="contactPerson"
    className="contact-input"
    value={form.contactPerson || ""}
    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
    placeholder="Enter your name..."
    required
  />
</label>

<label className="contact-label">
  Phone Number &nbsp;&nbsp;
  <input
    type="tel"
    name="phone"
    className="contact-input"
    value={form.phone || ""}
    onChange={(e) => setForm({ ...form, phone: e.target.value })}
    placeholder="Your number (+254..)"
    required
  />
</label>

<label className="contact-label">
  Email &nbsp;&nbsp;
  <input
    type="email"
    name="email"
    className="contact-input"
    value={form.email || ""}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    placeholder="Your email"
    required
  />
</label>

          
         <input
  placeholder="Hub Name"
  value={form.name}
  onChange={(e) => {
    const newName = e.target.value;
    setForm({ ...form, name: newName });


    if (newName.trim().length > 2) {
      fetchCoordinates(`${newName}, ${form.county || ""}`);
    }
  }}
  required
/>

          <input
            placeholder="County"
            value={form.county}
            onChange={(e) => setForm({ ...form, county: e.target.value })}
            required
          />
          <input
            placeholder="Constituency"
            value={form.constituency}
            onChange={(e) => setForm({ ...form, constituency: e.target.value })}
          />
          <input
            placeholder="Ward"
            value={form.ward}
            onChange={(e) => setForm({ ...form, ward: e.target.value })}
          />
        </div>

        <div className="form-row">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Innovation Hub</option>
            <option>Jitume Center</option>
            <option>CIH (Constituency Innovation Hub)</option>
            <option>Community ICT Center</option>
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {HUB_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          
          
          

  <input
    placeholder="Latitude"
    value={form.lat}
    onChange={(e) => setForm({ ...form, lat: e.target.value })}
    type="number"
    step="any"
  />
  <input
    placeholder="Longitude"
    value={form.lng}
    onChange={(e) => setForm({ ...form, lng: e.target.value })}
    type="number"
    step="any"
  />
  <button
    type="button"
    style={{
      backgroundColor: "#10b981",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    }}
    onClick={() => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((f) => ({
            ...f,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
          }));
        },
        (err) => {
          console.error("Failed to get location:", err);
          alert("Unable to retrieve your location");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }}
  >
    📍 Get my GPS Location
  </button>
        </div>

        {/* Programs Multi-select */}
        <div className="form-row">
          <label>Programs:</label>
          <select
            multiple
            value={form.programs}
            onChange={(e) =>
              setForm({
                ...form,
                programs: Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                ),
              })
            }
          >
            <option value="Ajira Digital">Ajira Digital</option>
            <option value="Jitume">Jitume</option>
            <option value="KEPSA Skilling">KEPSA Skilling</option>
            <option value="Private Sector">Private Sector</option>
            
          </select>
        </div>

        {/* Resources */}
        <div className="form-row">
          <input
            placeholder="Laptops"
            type="number"
            value={form.resources.laptops}
            onChange={(e) =>
              setForm({
                ...form,
                resources: { ...form.resources, laptops: e.target.value },
              })
            }
          />
          <input
            placeholder="Desktops"
            type="number"
            value={form.resources.desktops}
            onChange={(e) =>
              setForm({
                ...form,
                resources: { ...form.resources, desktops: e.target.value },
              })
            }
          />
          <input
            placeholder="Access Points"
            type="number"
            value={form.resources.accessPoints}
            onChange={(e) =>
              setForm({
                ...form,
                resources: { ...form.resources, accessPoints: e.target.value },
              })
            }
          />
          <input
            placeholder="Bandwidth (Mbps)"
            type="number"
            value={form.resources.bandwidth}
            onChange={(e) =>
              setForm({
                ...form,
                resources: { ...form.resources, bandwidth: e.target.value },
              })
            }
          />
        </div>

        {/* Implementing Partner */}
        <div className="form-row">
          <input
            placeholder="Implementing Partner (Internet provider)"
            value={form.implementingPartner}
            onChange={(e) =>
              setForm({ ...form, implementingPartner: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <input
            placeholder="People Trained"
            type="number"
            value={form.populationEnrolled}
            onChange={(e) =>
              setForm({ ...form, populationEnrolled: e.target.value })
            }
          />
        </div>


        <div className="form-row">
          <textarea
            placeholder="Services Offered"
            value={form.milestones}
            onChange={(e) => setForm({ ...form, milestones: e.target.value })}
            rows={2}
          />
        </div>

        <div className="form-row media-row">
          <div className="upload-card">
            <label className="upload-label">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: "none" }}
              />
              <div className="upload-drop">
                <span>Upload hub photo</span>
              </div>
            </label>
            {form.photos.length > 0 && (
              <div className="thumb-list">
                {form.photos.map((p, i) => (
                  <div key={i} className="thumb">
                    <img src={p} alt={`hub-${i}`} />
                    <button
                      type="button"
                      className="clear-photo"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          photos: f.photos.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="map-card">
            {/* <div className="map-title">GIS Preview</div> */}
            {form.lat && form.lng ? (
              <iframe
                title="map"
                className="map-embed"
                src={`https://maps.google.com/maps?q=${form.lat},${form.lng}&z=14&output=embed`}
                loading="lazy"
              />
            ) : (
              <div className="map-placeholder">GIS Preview</div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary">
            ➕ Add Hub
          </button>
   
        </div>
      </form>
      <EditHubModal
        hub={editingHub}
        isOpen={!!editingHub}
        onClose={() => setEditingHub(null)}
        onUpdated={load}
      />
     
      {/* Chart */}
      <div className="chart-container">
        <h3>📊 Hubs by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={statusCounts}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#16a34a" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* Table */}
      <div className="table-containe">
        <h3>📑 Detailed Records</h3>

         {/* Filters & Search */}
      <label className="report-label">Search:</label>
      <div className="filters-card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name…"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by County…"
            value={searchCounty}
            onChange={(e) => setSearchCounty(e.target.value)}
          />
        </div>
        <div className="select-bar">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option>Innovation Hub</option>
            <option>Jitume Center</option>
            <option>CIH (Constituency Innovation Hub)</option>
            <option>Community ICT Center</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {HUB_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

        

          <div className="export-controls">
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

  <label className="report-label">County:</label>
  <select
    className="report-select"
    value={countyFilter}
    onChange={(e) => setCountyFilter(e.target.value)}
  >
    <option value="all">All Counties</option>
    {[...new Set(list.map(h => h.county))].map((county) => (
      <option key={county} value={county}>
        {county}
      </option>
    ))}
  </select>
</div>


          <div
  style={{
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
  }}
>
  <button
    style={{
      backgroundColor: "transparent",
      color: "#007bff",
      border: "2px solid #007bff",
      borderRadius: "8px",
      padding: "10px 18px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = "#007bff";
      e.target.style.color = "#fff";
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color = "#007bff";
    }}
    onClick={() => exportToExcel(reportPeriod)}
  >
    📄 Download Excel
  </button>

  <button
    style={{
      backgroundColor: "transparent",
      color: "#28a745",
      border: "2px solid #28a745",
      borderRadius: "8px",
      padding: "10px 18px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = "#28a745";
      e.target.style.color = "#fff";
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color = "#28a745";
    }}
    onClick={() => exportToPDF(reportPeriod)}
  >
    🖨 Download PDF
  </button>
</div>



        {/* ✅ Pagination Bar */}
        <div className="pagination-bar">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ⬅ Prev
          </button>
          <span>
            Page <strong>{page}</strong> of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next ➡
          </button>
        </div>

        <div className="table-scrol">
          <table className="hub-tabl">
            <thead>
              <tr>
                <th>Photos</th>
                <th>Name</th>
                <th>County / Ward / Constituency</th>        
            
                
                <th>Type</th>
                <th>Programs</th>
                <th>Resources</th>
                <th>Implementing Partner</th>
                <th>People Trained</th>
                <th>Milestones</th>
                <th>Coordinates</th>
                <th>Status</th>                
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((x) => (
                <tr key={x._id}>
                  {/* 🔹 same row code as before */}
                  <td>
                    {x.photos?.length > 0 ? (
                      <div
                        className="mini-gallery"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            photos: x.photos,
                            index: 0,
                          })
                        }
                      >
                        {x.photos.slice(0, 2).map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt={`${x.name}-p${i}`}
                            className="mini-thumb"
                          />
                        ))}
                        {x.photos.length > 2 && (
                          <span className="more-photos">
                            +{x.photos.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mini-thumb placeholder">No photos</div>
                    )}
                  </td>
                  <td className="name-col">{x.name}</td>
                  <td>
                    <div className="muted">{x.county}</div>
                    <div className="muted">{x.constituency}</div>
                    <div className="muted">{x.ward}</div>
                  </td>
                  <td>{x.type || "—"}</td>
                  <td>
                    {(x.programs || []).map((p, i) => (
                      <span key={i} className="chip">
                        {p}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="muted">
                      {x.resources
                        ? `${x.resources.laptops || 0} laptops, ${
                            x.resources.desktops || 0
                          } desktops, ${x.resources.accessPoints || 0} APs, ${
                            x.resources.bandwidth || 0
                          } Mbps`
                        : "—"}
                    </div>
                  </td>
                  <td>{x.implementingPartner || "—"}</td>
                  <td>{x.populationEnrolled || 0}</td>
                  <td className="milestones-cell">
                    {(x.milestones || []).slice(0, 4).map((m, i) => (
                      <span key={i} className="chip">
                        {m.trim()}
                      </span>
                    ))}
                  </td>
                  <td className="coords">
                    {x.location?.coordinates?.length === 2 ? (
                      <>
                        <div className="muted">
                          {Number(x.location.coordinates[1]).toFixed(4)},{" "}
                          {Number(x.location.coordinates[0]).toFixed(4)}
                        </div>
                        <a
                          className="map-link"
                          href={`https://maps.google.com/?q=${x.location.coordinates[1]},${x.location.coordinates[0]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Map
                        </a>
                      </>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${x.status}`}>{x.status}</span>
                  </td>
                  <td>
                    {/* <StatusChanger
                      hub={x}
                      onChange={updateStatus}
                      onDelete={deleteHub}
                    /> */}

                    <StatusChanger
                      hub={x}
                      onChange={updateStatus}
                      onDelete={deleteHub}
                      onEdit={setEditingHub}
                    />
                  </td>
                </tr>
              ))}
              {currentPageData.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: 16 }}>
                    No hubs found 🔍
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Lightbox Modal */}
      {lightbox.open && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox({ open: false, photos: [], index: 0 })}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setLightbox({ open: false, photos: [], index: 0 })}
            >
              ✖
            </button>
            <img
              src={lightbox.photos[lightbox.index]}
              alt="hub-full"
              className="lightbox-img"
            />
          </div>
        </div>
      )}
      {/* Tracker Popup Modal */}
      <TrackerModal
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        stats={trackerStats}
      />
      {loading && <div className="overlay">Loading…</div>}
    </div>
  );
}

function StatusChanger({ hub, onChange, onDelete, onEdit }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => onEdit(hub)}
      >
        ✏️ Edit
      </button>

      <button
        style={{
          backgroundColor: "#dc2626",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => onDelete(hub._id)}
      >
        🗑 Delete
      </button>
    </div>
  );
}

// Enhanced Tracker to show progress vs 1450 target
function Tracker({ hubs }) {
  const target = 1450;
  const progress = hubs.length;
  const percent = ((progress / target) * 100).toFixed(1);

  return (
    <div className="tracker">
      <h3>Development Tracker</h3>
      <p>
        Total hubs: <b>{progress}</b> / {target} ({percent}%)
      </p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
