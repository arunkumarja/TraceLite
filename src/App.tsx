import { useEffect, useMemo, useState } from "react";
import { getPerformanceRecords } from "./api/performanceApi";

import MetricCard from "./components/MetricCard";
import RequestDetails from "./components/RequestDetails";
import RequestTable from "./components/RequestTable";
import ApiTester from "./components/ApiTester";
import PerformanceCharts from "./components/PerformanceCharts";

import type { PerformanceRecord } from "./types/performance";

import "./App.css";

type Page =
  | "dashboard"
  | "api-tester"
  | "performance-analyzer";

function App() {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<PerformanceRecord | null>(null);

  const [currentPage, setCurrentPage] =
    useState<Page>("dashboard");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await getPerformanceRecords();
      setRecords(data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load performance records. Check the API."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const averageDuration = useMemo(() => {
    if (records.length === 0) {
      return 0;
    }

    const total = records.reduce(
      (sum, record) => sum + record.durationMs,
      0
    );

    return Math.round(total / records.length);
  }, [records]);

  const successfulRequests = useMemo(() => {
    return records.filter(
      (record) =>
        record.statusCode >= 200 &&
        record.statusCode < 300
    ).length;
  }, [records]);

  function navigateTo(page: Page) {
    setCurrentPage(page);
    setSelectedRecord(null);
  }

  if (selectedRecord !== null) {
    return (
      <RequestDetails
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }

  return (
    <div className="app-shell">
      {/* Navigation */}
      <nav className="top-navigation">
        <div className="navigation-brand">
          <span className="brand-icon">T</span>

          <div>
            <strong>TraceLite</strong>
            <small>API Performance Analyzer</small>
          </div>
        </div>

        <div className="navigation-links">
          <button
            className={
              currentPage === "dashboard"
                ? "active-nav-button"
                : ""
            }
            onClick={() => navigateTo("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              currentPage === "api-tester"
                ? "active-nav-button"
                : ""
            }
            onClick={() => navigateTo("api-tester")}
          >
            API Tester
          </button>

          <button
            className={
              currentPage === "performance-analyzer"
                ? "active-nav-button"
                : ""
            }
            onClick={() =>
              navigateTo("performance-analyzer")
            }
          >
            Performance Analyzer
          </button>
        </div>

        {currentPage === "dashboard" && (
          <button
            className="nav-refresh-button"
            onClick={loadRecords}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        )}
      </nav>

      {/* Page content */}
      <main className="app-content">
        {/* Dashboard Page */}
        {currentPage === "dashboard" && (
          <section className="page-section">
            <header className="app-header">
              <div>
                <p className="brand-label">TRACELITE</p>

                <h1>Performance Dashboard</h1>

                <p className="header-description">
                  Monitor API request performance and SQL activity.
                </p>
              </div>
            </header>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <section className="metrics-grid">
              <MetricCard
                title="Total Requests"
                value={records.length}
                subtitle="Loaded records"
              />

              <MetricCard
                title="Average Duration"
                value={`${averageDuration} ms`}
                subtitle="Across loaded requests"
              />

              <MetricCard
                title="Successful Requests"
                value={successfulRequests}
                subtitle="HTTP 2xx responses"
              />
            </section>

            <section className="content-section">
              <div className="section-heading">
                <div>
                  <h2>Recent Requests</h2>

                  <p>
                    Select a request to view its details.
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="loading-message">
                  Loading performance data...
                </p>
              ) : (
                <RequestTable
                  records={records}
                  onSelect={setSelectedRecord}
                />
              )}
            </section>
          </section>
        )}

        {/* API Tester Page */}
        {currentPage === "api-tester" && (
          <section className="page-section tool-page">
            <div className="section-title">
              <span className="section-number">01</span>

              <div>
                <h2>External API Tester</h2>

                <p>
                  Test APIs and measure their response performance.
                </p>
              </div>
            </div>

            <ApiTester />
          </section>
        )}

        {/* Performance Analyzer Page */}
        {currentPage === "performance-analyzer" && (
          <section className="page-section tool-page">
            <div className="section-title">
              <span className="section-number">02</span>

              <div>
                <h2>Performance Analyzer</h2>

                <p>
                  Analyze API duration and HTTP status patterns.
                </p>
              </div>
            </div>

            <PerformanceCharts records={records} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;