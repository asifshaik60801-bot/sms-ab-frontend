import { useMemo } from "react";

function SecurityAnalytics({ events, alerts, incidents, risks }) {

  const eventStats = useMemo(() => {
    return {
      critical: events.filter(
        (event) => event.severity === "CRITICAL"
      ).length,

      high: events.filter(
        (event) => event.severity === "HIGH"
      ).length,

      medium: events.filter(
        (event) => event.severity === "MEDIUM"
      ).length,

      low: events.filter(
        (event) => event.severity === "LOW"
      ).length,
    };
  }, [events]);

  const incidentStats = useMemo(() => {
    return {
      open: incidents.filter(
        (incident) => incident.status === "OPEN"
      ).length,

      investigating: incidents.filter(
        (incident) => incident.status === "INVESTIGATING"
      ).length,

      resolved: incidents.filter(
        (incident) => incident.status === "RESOLVED"
      ).length,
    };
  }, [incidents]);

  const alertStats = useMemo(() => {
    return {
      critical: alerts.filter(
        (alert) => alert.severity === "CRITICAL"
      ).length,

      high: alerts.filter(
        (alert) => alert.severity === "HIGH"
      ).length,

      medium: alerts.filter(
        (alert) => alert.severity === "MEDIUM"
      ).length,

      low: alerts.filter(
        (alert) => alert.severity === "LOW"
      ).length,
    };
  }, [alerts]);

  const averageRisk = useMemo(() => {

    if (risks.length === 0) {
      return 0;
    }

    const total = risks.reduce(
      (sum, risk) => sum + (risk.riskScore || 0),
      0
    );

    return Math.round(total / risks.length);

  }, [risks]);

  const getBarWidth = (value, total) => {

    if (total === 0) {
      return "0%";
    }

    return `${Math.max(
      8,
      Math.round((value / total) * 100)
    )}%`;
  };

  const totalEvents = events.length;

  const totalAlerts = alerts.length;

  return (
    <section className="panel analytics-panel">

      <div className="panel-header">

        <div>
          <h2>📊 Security Analytics</h2>

          <p>
            Real-time security monitoring statistics
          </p>
        </div>

      </div>

      <div className="analytics-grid">

        {/* Event Severity */}

        <div className="analytics-card">

          <h3>🛡️ Event Severity</h3>

          <div className="analytics-row">

            <span>CRITICAL</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill critical-fill"
                style={{
                  width: getBarWidth(
                    eventStats.critical,
                    totalEvents
                  )
                }}
              />
            </div>

            <strong>
              {eventStats.critical}
            </strong>

          </div>

          <div className="analytics-row">

            <span>HIGH</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill high-fill"
                style={{
                  width: getBarWidth(
                    eventStats.high,
                    totalEvents
                  )
                }}
              />
            </div>

            <strong>
              {eventStats.high}
            </strong>

          </div>

          <div className="analytics-row">

            <span>MEDIUM</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill medium-fill"
                style={{
                  width: getBarWidth(
                    eventStats.medium,
                    totalEvents
                  )
                }}
              />
            </div>

            <strong>
              {eventStats.medium}
            </strong>

          </div>

          <div className="analytics-row">

            <span>LOW</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill low-fill"
                style={{
                  width: getBarWidth(
                    eventStats.low,
                    totalEvents
                  )
                }}
              />
            </div>

            <strong>
              {eventStats.low}
            </strong>

          </div>

        </div>


        {/* Alert Severity */}

        <div className="analytics-card">

          <h3>🚨 Alert Severity</h3>

          <div className="analytics-row">

            <span>CRITICAL</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill critical-fill"
                style={{
                  width: getBarWidth(
                    alertStats.critical,
                    totalAlerts
                  )
                }}
              />
            </div>

            <strong>
              {alertStats.critical}
            </strong>

          </div>

          <div className="analytics-row">

            <span>HIGH</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill high-fill"
                style={{
                  width: getBarWidth(
                    alertStats.high,
                    totalAlerts
                  )
                }}
              />
            </div>

            <strong>
              {alertStats.high}
            </strong>

          </div>

          <div className="analytics-row">

            <span>MEDIUM</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill medium-fill"
                style={{
                  width: getBarWidth(
                    alertStats.medium,
                    totalAlerts
                  )
                }}
              />
            </div>

            <strong>
              {alertStats.medium}
            </strong>

          </div>

          <div className="analytics-row">

            <span>LOW</span>

            <div className="analytics-bar">
              <div
                className="analytics-fill low-fill"
                style={{
                  width: getBarWidth(
                    alertStats.low,
                    totalAlerts
                  )
                }}
              />
            </div>

            <strong>
              {alertStats.low}
            </strong>

          </div>

        </div>


        {/* Incident Status */}

        <div className="analytics-card">

          <h3>🔥 Incident Status</h3>

          <div className="incident-stat">

            <span>OPEN</span>

            <strong>
              {incidentStats.open}
            </strong>

          </div>

          <div className="incident-stat">

            <span>INVESTIGATING</span>

            <strong>
              {incidentStats.investigating}
            </strong>

          </div>

          <div className="incident-stat">

            <span>RESOLVED</span>

            <strong>
              {incidentStats.resolved}
            </strong>

          </div>

        </div>


        {/* Risk */}

        <div className="analytics-card">

          <h3>🎯 Risk Intelligence</h3>

          <div className="risk-number">
            {averageRisk}
          </div>

          <p>
            Average Risk Score
          </p>

          <div className="risk-number secondary-risk">
            {risks.length}
          </div>

          <p>
            Total Risk Assessments
          </p>

        </div>

      </div>

    </section>
  );
}

export default SecurityAnalytics;