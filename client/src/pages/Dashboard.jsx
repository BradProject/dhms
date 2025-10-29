

// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import {
  FaUniversity,
  FaCheckCircle,
  FaRegLightbulb,
  FaTools,
  FaUsers,
  FaCommentDots,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "./dashboard.css";
import ChatBot from "./ChatBot";
import HubExplorerForm from "./HubExplorerForm";
import FeedbackForm from "./FeedbackForm";
import NewsCarousel from "./NewsCarousel";

// Utility component to recenter map when hub selected
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 10); // zoom closer
    }
  }, [lat, lng, map]);
  return null;
}

export default function Dashboard() {
  // const { data, loading, error } = useFetch("/reports/kpis");

  const [dateTime, setDateTime] = useState(new Date());
  const images = [
    "/assets/background1.jpg",
    "/assets/background2.jpg",
    "/assets/background3.jpg",
    "/assets/background4.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      6000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dayOfWeek = dateTime.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-US");

  // Map marker icon
  const hubIcon = new L.Icon({
    iconUrl: "/assets/pin2.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (loading) return <p className="loading">Loading...</p>;
  if (error)
    return <pre className="error">{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="dashboard">
      {/* Banner */}
      <header className="banner">
        {images.map((img, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentImage ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        <div className="banner-overlay">
          <h1>DIGITAL HUBS MANAGEMENT SYSTEM</h1>
          <p className="subtitle">
            Empowering communities through digital access across 47 counties
          </p>
          <div className="datetime">
            <span>
              {dayOfWeek}, {formattedDate}
            </span>
            <span className="time">{formattedTime}</span>
          </div>
        </div>
      </header>
      {/* KPIs */}
      <section className="kpis">
        <h2 className="dashboard-title">DIGITAL HUBS MANAGEMENT SYSTEM</h2>
        <div className="kpi-cards">
          <div className="card total" data-tooltip-id="total-tooltip">
            <FaUniversity className="icon" />
            <h3>Total Hubs</h3>
            <p>{data?.totalHubs}</p>
          </div>
          <Tooltip id="total-tooltip">
            📊 Growth trend of hubs over time
          </Tooltip>

          <div
            className="card operational"
            data-tooltip-id="operational-tooltip"
          >
            <FaCheckCircle className="icon" />
            <h3>Operational Hubs</h3>
            <p>{data?.operationalHubs}</p>
          </div>
          <Tooltip id="operational-tooltip">Currently active hubs</Tooltip>

          <div className="card planning" data-tooltip-id="planning-tooltip">
            <FaRegLightbulb className="icon" />
            <h3>Planning Hubs</h3>
            <p>{data?.planningHubs}</p>
          </div>
          <Tooltip id="planning-tooltip">💡 Hubs in planning stage</Tooltip>

          <div
            className="card development"
            data-tooltip-id="development-tooltip"
          >
            <FaTools className="icon" />
            <h3>Development Hubs</h3>
            <p>{data?.developmentHubs}</p>
          </div>
          <Tooltip id="development-tooltip">🛠️ Hubs under development</Tooltip>

          <div className="card population" data-tooltip-id="population-tooltip">
            <FaUsers className="icon" />
            <h3>Total People Trained</h3>
            <p>{data?.totalPopulation}</p>
          </div>
          <Tooltip id="population-tooltip">
            👥 People Trained across hubs
          </Tooltip>
        </div>
      </section>
      <NewsCarousel />
      <HubExplorerForm />
      {/* Info Card */}
      <section className="info-card-section">
        <div className="info-card-grid">
          <div className="info-card-visual">
            <img
              src="/assets/hub.jpg"
              alt="Digital Hub in Kenya"
              className="info-card-image"
            />
          </div>
          <div className="info-card-content">
            <h3 className="info-card-title">What Are Digital Hubs?</h3>
            <p className="info-card-text">
              Digital Hubs are community-focused centers equipped with internet
              connectivity, computers, and digital tools, designed to provide
              access to technology and digital literacy skills for citizens
              across Kenya. They serve as crucial infrastructure for fostering
              innovation, entrepreneurship, and public service delivery at the
              grassroots level.
            </p>
            <p className="info-card-text">
              {" "}
              The Ministry of ICT &amp; Digital Economy is committed to
              expanding this network, aiming to reach every corner of Kenya and
              empower its citizens with the tools and knowledge necessary for a
              thriving digital future.{" "}
            </p>
          </div>
        </div>
      </section>
      <ChatBot />
      {/* Drawer Toggle Button with Tooltip */}
      <button
        className="feedback-drawer-btn"
        data-tooltip-id="feedback-tooltip"
        data-tooltip-content="Give us a feedback"
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? "Close Feedback" : "Give Feedback"}
      </button>
      {/* Tooltip component */}
      <Tooltip id="feedback-tooltip" place="left" effect="solid" />
      {/* Feedback Drawer */}
      <div className={`feedback-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="feedback-drawer-header">
          <h3>Community Feedback</h3>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <FeedbackForm />
      </div>
      {/* Footer */}{" "}
      <footer className="footer">
        {" "}
        <div className="footer-container">
          <div className="footer-column">
            {" "}
            <h3 className="footer-title">
              The Ministry of Information, Communications <br /> and the Digital
              Economy (MICDE)
            </h3>{" "}
            <ul className="footer-contact">
              {" "}
              <li>GPO TelPosta Towers, Koinange Street</li>
              <li>P.O BOX 30025-00100 Nairobi, Kenya</li>{" "}
              <li>+254-020-4920000 /1 OR +254-020-920030</li>
              <li>info@information.go.ke</li> <li>ict.go.ke</li>{" "}
            </ul>{" "}
          </div>{" "}
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>{" "}
            <ul className="footer-links">
              {" "}
              <li>
                <a href="https://ict.go.ke/" target="_blank">
                  {" "}
                  Home{" "}
                </a>{" "}
              </li>{" "}
              <li>
                <a href="https://jitume.konza.go.ke/" target="_blank">
                  {" "}
                  Jitume Program{" "}
                </a>{" "}
              </li>
              <li>
                {" "}
                <a href="https://ajiradigital.go.ke/" target="_blank">
                  {" "}
                  Ajira Digital{" "}
                </a>
              </li>{" "}
              <li>
                {" "}
                <a href="https://jitume.konza.go.ke/" target="_blank">
                  {" "}
                  Jitume Program{" "}
                </a>
              </li>{" "}
              <li>
                {" "}
                <a
                  href="https://ict.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Ministry of ICT{" "}
                </a>{" "}
              </li>{" "}
              <li>
                {" "}
                <a
                  href="https://www.ecitizen.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  E-Citizen{" "}
                </a>{" "}
              </li>
              <li>
                {" "}
                <a
                  href="https://konza.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Konza Techno City{" "}
                </a>{" "}
              </li>{" "}
              <li>
                {" "}
                <a
                  href="https://www.hudumakenya.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Huduma Centre{" "}
                </a>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          <div className="footer-column">
            {" "}
            <h3 className="footer-title">Connect With Us</h3>{" "}
            <div className="social-icons">
              {" "}
              <a href="#">
                {" "}
                <i className="fab fa-facebook-f"></i>{" "}
              </a>{" "}
              <a href="#">
                {" "}
                <i className="fab fa-twitter"></i>{" "}
              </a>{" "}
              <a href="#">
                {" "}
                <i className="fab fa-instagram"></i>{" "}
              </a>{" "}
              <a href="#">
                {" "}
                <i className="fab fa-youtube"></i>{" "}
              </a>{" "}
              <a href="#">
                {" "}
                <i className="fab fa-linkedin-in"></i>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="footer-bottom">
          {" "}
          <p>
            {" "}
            © The Ministry of Information, Communications and the Digital
            Economy (MICDE). All Rights Reserved.{" "}
          </p>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
}
