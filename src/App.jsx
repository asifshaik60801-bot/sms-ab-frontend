
import { useEffect, useState } from "react";
import api from "./api.js";

import Login from "./Login.jsx";
import Register from "./Register.jsx";
import UserManagement from "./UserManagement.jsx";
import AuditLogs from "./AuditLogs.jsx";

import SecurityEventForm from "./SecurityEventForm.jsx";
import RiskAssessment from "./RiskAssessment.jsx";
import IncidentManagement from "./IncidentManagement.jsx";
import SecurityAnalytics from "./SecurityAnalytics.jsx";

import SecurityEventExplorer from "./SecurityEventExplorer.jsx";
import SecurityEventDetails from "./SecurityEventDetails.jsx";

import AlertDetails from "./AlertDetails.jsx";
import IncidentDetails from "./IncidentDetails.jsx";

import "./App.css";

function App() {
  // =========================================================
  // STATE
  // =========================================================

  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [risks, setRisks] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("cyberSentinelUser") !== null &&
      localStorage.getItem("cyberSentinelToken") !== null
  );

  const [showRegister, setShowRegister] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("cyberSentinelUser") || "null"
  );

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboard = async () => {
    console.log("🔄 Loading CyberSentinel dashboard...");

    // SECURITY EVENTS
    try {
      const response = await api.get("/api/security-events");

      console.log("✅ Security Events:", response.data);

      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "❌ Security Events API Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      setEvents([]);
    }

    // ALERTS
    try {
      const response = await api.get("/api/alerts");

      console.log("✅ Alerts:", response.data);

      setAlerts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "❌ Alerts API Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      setAlerts([]);
    }

    // INCIDENTS
    try {
      const response = await api.get("/api/incidents");

      console.log("✅ Incidents:", response.data);

      setIncidents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "❌ Incidents API Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      setIncidents([]);
    }

    // RISK ASSESSMENTS
    try {
      const response = await api.get("/api/risk-assessments");

      console.log("✅ Risk Assessments:", response.data);

      setRisks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "❌ Risk Assessments API Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      setRisks([]);
    }
  };

  // =========================================================
  // LOAD DATA AFTER LOGIN
  // =========================================================

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboard();
    }
  }, [isLoggedIn]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("cyberSentinelUser");
    localStorage.removeItem("cyberSentinelToken");

    setIsLoggedIn(false);
    setShowRegister(false);

    setEvents([]);
    setAlerts([]);
    setIncidents([]);
    setRisks([]);

    setSelectedEvent(null);
    setSelectedAlert(null);
    setSelectedIncident(null);
  };

  // =========================================================
  // REGISTER PAGE
  // =========================================================

  if (!isLoggedIn && showRegister) {
    return (
      <Register
        onRegisterSuccess={() => {
          setShowRegister(false);
          alert("Registration successful! Please log in.");
        }}
        onShowLogin={() => {
          setShowRegister(false);
        }}
      />
    );
  }

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);
        }}
        onShowRegister={() => {
          setShowRegister(true);
        }}
      />
    );
  }

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const criticalEvents = events.filter(
    (event) =>
      String(event.severity || "").toUpperCase() === "CRITICAL"
  ).length;

  const highEvents = events.filter(
    (event) =>
      String(event.severity || "").toUpperCase() === "HIGH"
  ).length;

  const mediumEvents = events.filter(
    (event) =>
      String(event.severity || "").toUpperCase() === "MEDIUM"
  ).length;

  const lowEvents = events.filter(
    (event) =>
      String(event.severity || "").toUpperCase() === "LOW"
  ).length;

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="dashboard">

      {/* =====================================================
          LEFT SOC SIDEBAR
      ====================================================== */}

      <aside className="soc-sidebar">

        <div className="soc-brand">

          <div className="soc-logo">
            ◈
          </div>

          <div>
            <strong>🛡️ SecureX</strong>
            <span>SOC // COMMAND CENTER</span>
          </div>

        </div>

        <nav className="soc-nav">

          <div className="nav-title">
            MONITORING
          </div>

          <a href="#overview" className="active">
            <span>⌂</span>
            Overview
          </a>

          <a href="#threats">
            <span>◉</span>
            Threat Intelligence
          </a>

          <a href="#events">
            <span>◈</span>
            Security Events
          </a>

          <a href="#incidents">
            <span>⚠</span>
            Incidents
          </a>

          <a href="#risk">
            <span>◇</span>
            Risk Assessment
          </a>

          <div className="nav-title">
            ANALYSIS
          </div>

          <a href="#analytics">
            <span>▥</span>
            Analytics
          </a>

          <a href="#explorer">
            <span>⌕</span>
            Event Explorer
          </a>

          {user?.role === "ADMIN" && (
            <>
              <div className="nav-title">
                ADMINISTRATION
              </div>

              <a href="#users">
                <span>♙</span>
                Users
              </a>

              <a href="#audit">
                <span>▤</span>
                Audit Logs
              </a>
            </>
          )}

        </nav>

        <div className="sidebar-footer">

          <div className="mini-status">
            <span></span>
            SOC SYSTEMS OPERATIONAL
          </div>

          <small>
            SecureX v1.0
          </small>

        </div>

      </aside>


      {/* =====================================================
          MAIN SOC AREA
      ====================================================== */}

      <div className="soc-main">

        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header className="topbar">

          <div className="topbar-left">

            <div className="system-label">
              SECURITY OPERATIONS CENTER
            </div>

            <div className="system-status">
              <span className="status-dot"></span>
              SYSTEM ONLINE
            </div>

          </div>

          <div className="topbar-right">

            <div className="threat-level">
              <span>THREAT LEVEL</span>
              <strong>MONITORED</strong>
            </div>

            <div className="user-info">

              <div className="user-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="user-details">

                <strong>
                  {user?.name || "Security Analyst"}
                </strong>

                <span>
                  {user?.role || "ANALYST"}
                </span>

              </div>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              LOGOUT
            </button>

          </div>

        </header>


        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <main className="content">

          {/* ================================================
              PAGE HEADER
          ================================================= */}

          <section
            id="overview"
            className="dashboard-heading"
          >

            <div>

              <div className="eyebrow">
                LIVE SECURITY MONITORING
              </div>

              <h1>
                SOC Command Center
              </h1>

              <p>
                Cyber threat monitoring, incident response and
                security intelligence dashboard.
              </p>

            </div>

            <button
              className="refresh-btn"
              onClick={loadDashboard}
            >
              ↻ REFRESH DATA
            </button>

          </section>


          {/* ================================================
              KPI CARDS
          ================================================= */}

          <section className="stats-grid">

            <div className="stat-card critical-card">

              <div className="stat-card-top">
                <span className="stat-icon">
                  ⚠
                </span>

                <span className="stat-label">
                  CRITICAL THREATS
                </span>
              </div>

              <div className="stat-number">
                {criticalEvents}
              </div>

              <div className="stat-footer">
                Requires immediate attention
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">
                <span className="stat-icon">
                  ◉
                </span>

                <span className="stat-label">
                  ACTIVE ALERTS
                </span>
              </div>

              <div className="stat-number">
                {alerts.length}
              </div>

              <div className="stat-footer">
                Security alerts detected
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">
                <span className="stat-icon">
                  ◈
                </span>

                <span className="stat-label">
                  RISK ASSESSMENTS
                </span>
              </div>

              <div className="stat-number">
                {risks.length}
              </div>

              <div className="stat-footer">
                Threat risk evaluations
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">
                <span className="stat-icon">
                  ⚡
                </span>

                <span className="stat-label">
                  INCIDENTS
                </span>
              </div>

              <div className="stat-number">
                {incidents.length}
              </div>

              <div className="stat-footer">
                Security incidents tracked
              </div>

            </div>

          </section>


          {/* ================================================
              THREAT OVERVIEW
          ================================================= */}

          <section className="soc-overview-grid">

            <div
              id="threats"
              className="panel threat-panel"
            >

              <div className="panel-header">

                <div>

                  <span className="panel-kicker">
                    LIVE MONITOR
                  </span>

                  <h2>
                    Threat Activity
                  </h2>

                </div>

                <span className="live-badge">
                  ● LIVE
                </span>

              </div>


              <div className="threat-metrics">

                <div>
                  <span>EVENTS</span>
                  <strong>{events.length}</strong>
                </div>

                <div>
                  <span>CRITICAL</span>
                  <strong>{criticalEvents}</strong>
                </div>

                <div>
                  <span>HIGH</span>
                  <strong>{highEvents}</strong>
                </div>

              </div>


              <div className="activity-bars">

                {events.length === 0 ? (
                  <div className="empty-state">
                    No security events available
                  </div>
                ) : (
                  events.slice(0, 12).map((event, index) => {

                    const severity =
                      String(event.severity || "")
                        .toUpperCase();

                    let height = "35%";

                    if (severity === "CRITICAL") {
                      height = "95%";
                    } else if (severity === "HIGH") {
                      height = "75%";
                    } else if (severity === "MEDIUM") {
                      height = "55%";
                    } else if (severity === "LOW") {
                      height = "30%";
                    }

                    return (
                      <div
                        className="activity-bar-wrapper"
                        key={event.id || index}
                      >

                        <div
                          className={`activity-bar severity-${severity.toLowerCase()}`}
                          style={{
                            height
                          }}
                        ></div>

                      </div>
                    );

                  })
                )}

              </div>

            </div>


            {/* ==============================================
                SEVERITY DISTRIBUTION
            =============================================== */}

            <div className="panel severity-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-kicker">
                    THREAT ANALYSIS
                  </span>

                  <h2>
                    Severity Distribution
                  </h2>

                </div>

              </div>


              <div className="severity-list">

                <div className="severity-row">

                  <div className="severity-name">
                    <span className="severity-dot critical"></span>
                    Critical
                  </div>

                  <strong>
                    {criticalEvents}
                  </strong>

                </div>


                <div className="severity-row">

                  <div className="severity-name">
                    <span className="severity-dot high"></span>
                    High
                  </div>

                  <strong>
                    {highEvents}
                  </strong>

                </div>


                <div className="severity-row">

                  <div className="severity-name">
                    <span className="severity-dot medium"></span>
                    Medium
                  </div>

                  <strong>
                    {mediumEvents}
                  </strong>

                </div>


                <div className="severity-row">

                  <div className="severity-name">
                    <span className="severity-dot low"></span>
                    Low
                  </div>

                  <strong>
                    {lowEvents}
                  </strong>

                </div>

              </div>

            </div>

          </section>


          {/* ================================================
              SECURITY EVENT FORM
          ================================================= */}

          <section id="events">

            <SecurityEventForm
              onEventCreated={loadDashboard}
            />

          </section>


          {/* ================================================
              RISK ASSESSMENT
          ================================================= */}

          <section id="risk">

            <RiskAssessment
              risks={risks}
              onRiskUpdated={loadDashboard}
            />

          </section>


          {/* ================================================
              SECURITY ANALYTICS
          ================================================= */}

          <section id="analytics">

            <SecurityAnalytics
              events={events}
              alerts={alerts}
              incidents={incidents}
              risks={risks}
            />

          </section>


          {/* ================================================
              EVENT EXPLORER
          ================================================= */}

          <section id="explorer">

            <SecurityEventExplorer
              events={events}
              onSelectEvent={(event) => {
                setSelectedEvent(event);
              }}
            />

          </section>


          {/* ================================================
              EVENT DETAILS
          ================================================= */}

          {selectedEvent && (
            <SecurityEventDetails
              event={selectedEvent}
              onClose={() => {
                setSelectedEvent(null);
              }}
            />
          )}


          {/* ================================================
              ALERT DETAILS
          ================================================= */}

          {selectedAlert && (
            <AlertDetails
              alert={selectedAlert}
              onClose={() => {
                setSelectedAlert(null);
              }}
            />
          )}


          {/* ================================================
              INCIDENT DETAILS
          ================================================= */}

          {selectedIncident && (
            <IncidentDetails
              incident={selectedIncident}
              onClose={() => {
                setSelectedIncident(null);
              }}
            />
          )}


          {/* ================================================
              RECENT ALERTS + RISK ASSESSMENTS
          ================================================= */}

          <section className="two-column-grid">

            {/* ALERTS */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <span className="panel-kicker">
                    THREAT DETECTION
                  </span>

                  <h2>
                    Recent Security Alerts
                  </h2>

                </div>

                <span className="count-badge">
                  {alerts.length}
                </span>

              </div>


              {alerts.length === 0 ? (

                <div className="empty-state">
                  No active security alerts.
                </div>

              ) : (

                <div className="alert-list">

                  {alerts.slice(0, 8).map((alert, index) => (

                    <div
                      className="alert-item"
                      key={alert.id || index}
                      onClick={() => {
                        setSelectedAlert(alert);
                      }}
                    >

                      <div className="alert-indicator">
                        !
                      </div>

                      <div className="alert-content">

                        <strong>
                          {alert.title ||
                            alert.message ||
                            "Security Alert"}
                        </strong>

                        <span>
                          {alert.severity ||
                            "UNKNOWN"}{" "}
                          •{" "}
                          {alert.status ||
                            "ACTIVE"}
                        </span>

                      </div>

                      <span className="alert-arrow">
                        →
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* RISK */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <span className="panel-kicker">
                    RISK MANAGEMENT
                  </span>

                  <h2>
                    Risk Assessments
                  </h2>

                </div>

                <span className="count-badge">
                  {risks.length}
                </span>

              </div>


              {risks.length === 0 ? (

                <div className="empty-state">
                  No risk assessments available.
                </div>

              ) : (

                <div className="risk-list">

                  {risks.slice(0, 8).map((risk, index) => (

                    <div
                      className="risk-item"
                      key={risk.id || index}
                    >

                      <div>

                        <strong>
                          {risk.asset ||
                            risk.title ||
                            "Protected Asset"}
                        </strong>

                        <span>
                          Risk Score
                        </span>

                      </div>

                      <div className="risk-score">

                        {risk.riskScore ??
                          risk.score ??
                          "N/A"}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>


          {/* ================================================
              INCIDENT MANAGEMENT
          ================================================= */}

          <section id="incidents">

            <IncidentManagement
              incidents={incidents}
              onIncidentUpdated={loadDashboard}
              onSelectIncident={(incident) => {
                setSelectedIncident(incident);
              }}
            />

          </section>


          {/* ================================================
              INCIDENT TABLE
          ================================================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <span className="panel-kicker">
                  INCIDENT RESPONSE
                </span>

                <h2>
                  Security Incidents
                </h2>

              </div>

              <span className="count-badge">
                {incidents.length}
              </span>

            </div>


            {incidents.length === 0 ? (

              <div className="empty-state">
                No security incidents recorded.
              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>INCIDENT</th>
                      <th>SEVERITY</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>

                  </thead>

                  <tbody>

                    {incidents.slice(0, 10).map(
                      (incident, index) => {

                        const severity =
                          String(
                            incident.severity ||
                              "UNKNOWN"
                          ).toUpperCase();

                        return (
                          <tr
                            key={
                              incident.id ||
                              index
                            }
                          >

                            <td>
                              #{incident.id || index + 1}
                            </td>

                            <td>
                              {incident.title ||
                                incident.name ||
                                incident.description ||
                                "Security Incident"}
                            </td>

                            <td>

                              <span
                                className={`severity-badge ${severity.toLowerCase()}`}
                              >
                                {severity}
                              </span>

                            </td>

                            <td>
                              {incident.status ||
                                "OPEN"}
                            </td>

                            <td>

                              <button
                                className="table-action"
                                onClick={() => {
                                  setSelectedIncident(
                                    incident
                                  );
                                }}
                              >
                                VIEW
                              </button>

                            </td>

                          </tr>
                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* ================================================
              SECURITY EVENTS TABLE
          ================================================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <span className="panel-kicker">
                  EVENT STREAM
                </span>

                <h2>
                  Recent Security Events
                </h2>

              </div>

              <span className="count-badge">
                {events.length}
              </span>

            </div>


            {events.length === 0 ? (

              <div className="empty-state">
                No security events available.
              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>EVENT</th>
                      <th>TYPE</th>
                      <th>SEVERITY</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>

                  </thead>

                  <tbody>

                    {events.slice(0, 12).map(
                      (event, index) => {

                        const severity =
                          String(
                            event.severity ||
                              "UNKNOWN"
                          ).toUpperCase();

                        return (
                          <tr
                            key={
                              event.id ||
                              index
                            }
                          >

                            <td>
                              #{event.id || index + 1}
                            </td>

                            <td>
                              {event.description ||
                                event.message ||
                                event.title ||
                                "Security Event"}
                            </td>

                            <td>
                              {event.eventType ||
                                event.type ||
                                "SYSTEM"}
                            </td>

                            <td>

                              <span
                                className={`severity-badge ${severity.toLowerCase()}`}
                              >
                                {severity}
                              </span>

                            </td>

                            <td>
                              {event.status ||
                                "DETECTED"}
                            </td>

                            <td>

                              <button
                                className="table-action"
                                onClick={() => {
                                  setSelectedEvent(
                                    event
                                  );
                                }}
                              >
                                VIEW
                              </button>

                            </td>

                          </tr>
                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* ================================================
              SEVERITY OVERVIEW
          ================================================= */}

          <section className="panel severity-overview">

            <div className="panel-header">

              <div>

                <span className="panel-kicker">
                  SECURITY POSTURE
                </span>

                <h2>
                  Security Severity Overview
                </h2>

              </div>

            </div>


            <div className="severity-overview-grid">

              <div className="severity-box critical">

                <span>
                  CRITICAL
                </span>

                <strong>
                  {criticalEvents}
                </strong>

              </div>


              <div className="severity-box high">

                <span>
                  HIGH
                </span>

                <strong>
                  {highEvents}
                </strong>

              </div>


              <div className="severity-box medium">

                <span>
                  MEDIUM
                </span>

                <strong>
                  {mediumEvents}
                </strong>

              </div>


              <div className="severity-box low">

                <span>
                  LOW
                </span>

                <strong>
                  {lowEvents}
                </strong>

              </div>

            </div>

          </section>


          {/* ================================================
              ADMIN USER MANAGEMENT
          ================================================= */}

          {user?.role === "ADMIN" && (
            <section id="users">

              <UserManagement />

            </section>
          )}


          {/* ================================================
              ADMIN AUDIT LOGS
          ================================================= */}

          {user?.role === "ADMIN" && (
            <section id="audit">

              <AuditLogs />

            </section>
          )}


          {/* ================================================
              FOOTER
          ================================================= */}

          <footer className="soc-footer">

            <div>
              🛡️ SecureX SECURITY PLATFORM
            </div>

            <div>
              JAVA • SPRING BOOT • REACT • MYSQL
            </div>

            <div>
              SYSTEM STATUS:
              <span> OPERATIONAL</span>
            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default App;

