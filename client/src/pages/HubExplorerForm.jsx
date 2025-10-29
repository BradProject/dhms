

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./hub-explorer.css";
import {
  MapPin,
  Building,
  Layers,
  Map,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://dhms-79l7.onrender.com/api/hubs/api";




// Kenya bounding box (approximate)
const kenyaBounds = [
  [-5.0, 33.5], // Southwest corner
  [5.5, 42.0],  // Northeast corner
];

function RecenterMap({ lat, lng, zoom = 10 }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null)
      map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}


// Different icons for each status
const iconBase = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const icons = {
  planning: iconBase("green"),
  development: iconBase("blue"),
  operational: iconBase("orange"),
  default: iconBase("grey"),
};

export default function HubExplorerForm() {
  const [hubs, setHubs] = useState([]);
  const [counties, setCounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    county: "",
    constituency: "",
    ward: "",
    status: "",
  });
  const [selectedHubId, setSelectedHubId] = useState("");
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]); // Nairobi
  const [mapZoom, setMapZoom] = useState(6);
  const [useStreetView, setUseStreetView] = useState(false);
  const [resettingMap, setResettingMap] = useState(false);

  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const fetchOpts = authToken
    ? { headers: { Authorization: `Bearer ${authToken}` }, mode: "cors" }
    : { mode: "cors" };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [hubsRes, countiesRes] = await Promise.all([
          fetch(`${API_BASE}hubs`, fetchOpts),
          fetch(`${API_BASE}hubs/counties`, fetchOpts),
        ]);
        if (!hubsRes.ok) throw new Error("Failed to fetch hubs");
        if (!countiesRes.ok) throw new Error("Failed to fetch counties");

        const hubsJson = await hubsRes.json();
        const countiesJson = await countiesRes.json();

        if (mounted) {
          setHubs(
            hubsJson.map((h) => ({
              id: h._id ?? h.id,
              name: h.name,
              county: h.county,
              constituency: h.constituency,
              ward: h.ward,
              type: h.type,
              status: h.status,
              location: h.location ?? { type: "Point", coordinates: [0, 0] },
              populationEnrolled: h.populationEnrolled ?? 0,
              programs: h.programs ?? [],
              milestones: h.milestones ?? [],
              resources: h.resources ?? {
                laptops: 0,
                desks: 0,
                accessPoints: 0,
                bandwidth: 0,
              },
            }))
          );
          setCounties(
            countiesJson.map((c) =>
              c.name
                ? { name: c.name, count: c.count }
                : { name: c._id, count: c.count ?? 0 }
            )
          );
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const constituenciesForCounty = useMemo(() => {
    if (!filters.county) return [];
    return Array.from(
      new Set(
        hubs
          .filter(
            (h) =>
              h.county?.toLowerCase() === filters.county.toLowerCase() &&
              h.constituency
          )
          .map((h) => h.constituency)
      )
    ).sort();
  }, [filters.county, hubs]);

  const wardsForConstituency = useMemo(() => {
    if (!filters.constituency) return [];
    return Array.from(
      new Set(
        hubs
          .filter(
            (h) =>
              h.constituency?.toLowerCase() ===
              filters.constituency.toLowerCase()
          )
          .map((h) => h.ward ?? "")
      )
    ).sort();
  }, [filters.constituency, hubs]);

  const hubsFiltered = useMemo(
    () =>
      hubs.filter((h) => {
        if (
          filters.county &&
          h.county?.toLowerCase() !== filters.county.toLowerCase()
        )
          return false;
        if (
          filters.constituency &&
          h.constituency?.toLowerCase() !== filters.constituency.toLowerCase()
        )
          return false;
        if (filters.ward && h.ward?.toLowerCase() !== filters.ward.toLowerCase())
          return false;
        if (filters.status && h.status !== filters.status) return false;
        return true;
      }),
    [filters, hubs]
  );

 useEffect(() => {
  if (resettingMap) return; 

  // 🟢 When a specific hub is selected → zoom in and center
  if (selectedHubId) {
    const hub = hubs.find((h) => h.id === selectedHubId);
    if (hub?.location?.coordinates?.length === 2) {
      const [lng, lat] = hub.location.coordinates;
      setMapCenter([lat, lng]);
      setMapZoom(13); // zoomed-in view
    }
  }
  // 🟡 When no hub selected → stay zoomed out (country level)
  else {
    setMapCenter([-1.286389, 36.817223]); // Kenya
    setMapZoom(6); // zoomed-out view
  }
}, [selectedHubId, resettingMap, hubs]);



  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setSelectedHubId("");
  };
  const handleHubChange = (e) => setSelectedHubId(e.target.value);
  
const clearFilters = () => {
  setResettingMap(true);

  // Reset all filters
  setFilters({ county: "", constituency: "", ward: "", status: "" });
  setSelectedHubId("");
  setUseStreetView(false);

  // Zoom out to Kenya
  setMapCenter([-1.286389, 36.817223]);
  setMapZoom(6);

  // Allow map to resume normal updates after a short delay
  setTimeout(() => setResettingMap(false), 800);
};



  const handleMapClick = () => {
    setUseStreetView((prev) => !prev);
  };

  return (
    <div className="hub-explorer-container">
      <h2 className="section-title">
        <MapPin className="icon" /> Digital Hubs Information 
      </h2>

      {loading && <div className="status">Loading hubs…</div>}
      {error && <div className="status error">Error: {error}</div>}

      <div className="hub-explorer-grid">
        {/* Filters */}
        <div className="filters">
          <div className="filter-header">
            <Building size={18} />
            <h3>Filter Hubs</h3>
          </div>

          <label>
            County:
            <select
              name="county"
              value={filters.county}
              onChange={handleFilterChange}
            >
              <option value="">All Counties</option>
              {counties.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </label>

          <label>
            Constituency:
            <select
              name="constituency"
              value={filters.constituency}
              onChange={handleFilterChange}
              disabled={!filters.county}
            >
              <option value="">All Constituencies</option>
              {constituenciesForCounty.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ward:
            <select
              name="ward"
              value={filters.ward}
              onChange={handleFilterChange}
              disabled={!filters.constituency}
            >
              <option value="">All Wards</option>
              {wardsForConstituency.map((w, i) => (
                <option key={i} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status:
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="planning">Planning</option>
              <option value="development">Development</option>
              <option value="operational">Operational</option>
            </select>
          </label>

          <label>
            Hub:
            <select
              value={selectedHubId}
              onChange={handleHubChange}
              disabled={hubsFiltered.length === 0}
            >
              <option value="">Select Hub</option>
              {hubsFiltered.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </label>

          <button className="clear-filters-btn" onClick={clearFilters}>
            <RefreshCw size={16} /> Clear Digital Hubs Selection
          </button>
        </div>

        {/* Map */}
        <div className="map" onClick={handleMapClick}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "550px", width: "100%", cursor: "pointer" }}
            scrollWheelZoom
            maxBounds={kenyaBounds}
            maxBoundsViscosity={1.0}
          >
            {useStreetView ? (
              <TileLayer
                attribution='Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}

            <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} zoom={mapZoom} />


            {/* {hubsFiltered.map((h) => {
              const [lng, lat] = h.location.coordinates;
              const icon = icons[h.status] || icons.default;
              const statusColor =
                h.status === "planning"
                  ? "green"
                  : h.status === "development"
                  ? "blue"
                  : h.status === "operational"
                  ? "orange"
                  : "gray";

              return (
                <Marker key={h.id} position={[lat, lng]} icon={icon}>
                  <Tooltip
                    direction="top"
                    offset={[0, -20]}
                    opacity={1}
                    className="custom-tooltip"
                  >
                    <div>
                      <strong>{h.name}</strong>
                      <br />
                      {h.county} — {h.constituency} — {h.ward}
                      <br />
                      <span style={{ color: statusColor, fontWeight: "600" }}>
                        Status: {h.status}
                      </span>
                      <br />
                      <small style={{ color: "#555" }}>
                        📍 {lat.toFixed(5)}, {lng.toFixed(5)}
                      </small>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })} */}

                        {/* Show marker only if a single hub is selected */}
            {selectedHubId &&
              hubsFiltered
                .filter((h) => h.id === selectedHubId)
                .map((h) => {
                  const [lng, lat] = h.location.coordinates;
                  const icon = icons[h.status] || icons.default;
                  const statusColor =
                    h.status === "planning"
                      ? "green"
                      : h.status === "development"
                      ? "blue"
                      : h.status === "operational"
                      ? "orange"
                      : "gray";

                  return (
                    <Marker key={h.id} position={[lat, lng]} icon={icon}>
                      <Tooltip
                        direction="top"
                        offset={[0, -20]}
                        opacity={1}
                        className="custom-tooltip"
                      >
                        <div>
                          <strong>{h.name}</strong>
                          <br />
                          {h.county} — {h.constituency} — {h.ward}
                          <br />
                          <span style={{ color: statusColor, fontWeight: "600" }}>
                            Status: {h.status}
                          </span>
                          <br />
                          <small style={{ color: "#555" }}>
                            📍 {lat.toFixed(5)}, {lng.toFixed(5)}
                          </small>
                        </div>
                      </Tooltip>
                    </Marker>
                  );
                })}

          </MapContainer>

          <div className="map-toggle-hint">
            {useStreetView
              ? "Satellite View (Click to switch to Map)"
              : "Map View (Click to switch to Satellite)"}
          </div>
        </div>
      </div>
    </div>
  );
}

