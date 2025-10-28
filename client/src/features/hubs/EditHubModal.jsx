

import React, { useState, useEffect } from "react";
import API from "../../services/api";
import "./edithub.css";

export default function EditHubModal({ hub, isOpen, onClose, onUpdated }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sync form with hub
  useEffect(() => {
    if (hub) {
      setForm({
        ...hub,
        milestones: Array.isArray(hub.milestones)
          ? hub.milestones.join(", ")
          : hub.milestones || "",
        programs: Array.isArray(hub.programs)
          ? hub.programs.join(", ")
          : hub.programs || "",
        lat: hub.location?.coordinates?.[1] || "",
        lng: hub.location?.coordinates?.[0] || "",
        populationEnrolled: hub.populationEnrolled || "",
        constituency: hub.constituency || "",
        // resources
        laptops: hub.resources?.laptops ?? "",
        desktops: hub.resources?.desktops ?? "",
        accessPoints: hub.resources?.accessPoints ?? "",
        bandwidth: hub.resources?.bandwidth ?? "",
      });
    }
  }, [hub]);

  if (!isOpen || !hub) return null;

  // Save updates to backend
  const handleSave = async () => {
    if (
      form.type === "CIH (Constituency Innovation Hub)" &&
      !form.constituency.trim()
    ) {
      setError("Constituency is required for CIH type.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        milestones: form.milestones
          ? form.milestones.split(",").map((m) => m.trim())
          : [],
        programs: form.programs
          ? form.programs.split(",").map((p) => p.trim())
          : [],
        photos: hub.photos,
        location: {
          type: "Point",
          coordinates: [
            form.lng ? Number(form.lng) : 0,
            form.lat ? Number(form.lat) : 0,
          ],
        },
        resources: {
          laptops: Number(form.laptops) || 0,
          desktops: Number(form.desktops) || 0,
          accessPoints: Number(form.accessPoints) || 0,
          bandwidth: Number(form.bandwidth) || 0,
        },
        populationEnrolled: Number(form.populationEnrolled) || 0,
      };

      await API.put(`/hubs/${hub._id}`, payload);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update hub");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-hub-overlay" onClick={onClose}>
      <div className="edit-hub-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-hub-header">
          <h2>Edit Hub - {form.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="edit-hub-body">
          {error && <p className="error">{error}</p>}

          <div className="grid">
            <div className="form-group">
              <label>Hub Name</label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>County</label>
              <input
                value={form.county || ""}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Constituency</label>
              <input
                value={form.constituency || ""}
                onChange={(e) =>
                  setForm({ ...form, constituency: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Ward</label>
              <input
                value={form.ward || ""}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={form.type || ""}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Innovation Hub</option>
                <option>Jitume Center</option>
                <option>CIH (Constituency Innovation Hub)</option>
                <option>Community ICT Center</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status || ""}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="planning">Planning</option>
                <option value="development">Development</option>
                <option value="operational">Operational</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Programs (comma-separated [Ajira Digital,Jitume,....])</label>
            <textarea
              rows={2}
              value={form.programs || ""}
              onChange={(e) => setForm({ ...form, programs: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Milestones (comma-separated)</label>
            <textarea
              rows={2}
              value={form.milestones || ""}
              onChange={(e) => setForm({ ...form, milestones: e.target.value })}
            />
          </div>

          <h4>Resources</h4>
          <div className="grid">
            <div className="form-group">
              <label>Laptops</label>
              <input
                type="number"
                value={form.laptops || ""}
                onChange={(e) => setForm({ ...form, laptops: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Desktops</label>
              <input
                type="number"
                value={form.desktops || ""}
                onChange={(e) => setForm({ ...form, desktops: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Access Points</label>
              <input
                type="number"
                value={form.accessPoints || ""}
                onChange={(e) =>
                  setForm({ ...form, accessPoints: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Bandwidth (Mbps)</label>
              <input
                type="number"
                value={form.bandwidth || ""}
                onChange={(e) =>
                  setForm({ ...form, bandwidth: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid">
            <div className="form-group">
              <label>Population Enrolled</label>
              <input
                type="number"
                value={form.populationEnrolled || ""}
                onChange={(e) =>
                  setForm({ ...form, populationEnrolled: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Implementing Partner</label>
              <input
                value={form.implementingPartner || ""}
                onChange={(e) =>
                  setForm({ ...form, implementingPartner: e.target.value })
                }
              />
            </div>
          </div>

          <h4>Coordinates</h4>
          <div className="grid">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                value={form.lat || ""}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={form.lng || ""}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="edit-hub-footer">
          <button
            className="btn save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : " Save Changes"}
          </button>
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
