import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { PerformanceRecord } from "../types/performance";

interface PerformanceChartsProps {
  records: PerformanceRecord[];
}

/* =========================================================
   CHART COLORS
   ========================================================= */

const STATUS_COLORS: Record<string, string> = {
  "2xx": "#22c55e", // Green
  "3xx": "#3b82f6", // Blue
  "4xx": "#f59e0b", // Orange
  "5xx": "#ef4444", // Red
};

const DEFAULT_STATUS_COLOR = "#94a3b8";

const DURATION_BAR_COLOR = "#6366f1";

export default function PerformanceCharts({
  records,
}: PerformanceChartsProps) {
  /* =========================================================
     REQUEST DURATION DATA
     ========================================================= */

  const chartRecords = [...records]
    .reverse()
    .slice(-10)
    .map((record) => ({
      name: `#${record.id}`,
      duration: record.durationMs,
      path: record.path,
    }));

  /* =========================================================
     STATUS DATA
     ========================================================= */

  const statusCounts = records.reduce<Record<string, number>>(
    (counts, record) => {
      const statusGroup = `${Math.floor(
        record.statusCode / 100
      )}xx`;

      counts[statusGroup] =
        (counts[statusGroup] ?? 0) + 1;

      return counts;
    },
    {}
  );

  const statusData = Object.entries(statusCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  /* =========================================================
     PERFORMANCE SUMMARY
     ========================================================= */

  const averageDuration =
    records.length > 0
      ? records.reduce(
          (total, record) =>
            total + record.durationMs,
          0
        ) / records.length
      : 0;

  const fastestRequest =
    records.length > 0
      ? Math.min(
          ...records.map(
            (record) => record.durationMs
          )
        )
      : 0;

  const slowestRequest =
    records.length > 0
      ? Math.max(
          ...records.map(
            (record) => record.durationMs
          )
        )
      : 0;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="performance-analysis">
      <h2>Performance Analysis</h2>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="analysis-summary">
        <div className="analysis-card">
          <span>Average Duration</span>

          <strong>
            {averageDuration.toFixed(2)} ms
          </strong>
        </div>

        <div className="analysis-card">
          <span>Fastest Request</span>

          <strong>
            {fastestRequest} ms
          </strong>
        </div>

        <div className="analysis-card">
          <span>Slowest Request</span>

          <strong>
            {slowestRequest} ms
          </strong>
        </div>

        <div className="analysis-card">
          <span>Total Requests</span>

          <strong>
            {records.length}
          </strong>
        </div>
      </div>

      {/* =====================================================
          CHARTS
          ===================================================== */}

      <div className="charts-grid">
        {/* ===================================================
            REQUEST DURATION
            =================================================== */}

        <div className="chart-card">
          <h3>Request Duration</h3>

          {chartRecords.length === 0 ? (
            <p className="empty-chart-message">
              No request data available.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={chartRecords}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#cbd5e1",
                  }}
                  tickLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} ms`,
                    "Duration",
                  ]}
                  labelFormatter={(label) =>
                    `Request ${label}`
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #dbe4f0",
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                  labelStyle={{
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                />

                <Bar
                  dataKey="duration"
                  fill={DURATION_BAR_COLOR}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ===================================================
            STATUS DISTRIBUTION
            =================================================== */}

        <div className="chart-card">
          <h3>Status Distribution</h3>

          {statusData.length === 0 ? (
            <p className="empty-chart-message">
              No status data available.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={45}
                  paddingAngle={3}
                  label
                  labelLine
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        STATUS_COLORS[
                          entry.name
                        ] ??
                        DEFAULT_STATUS_COLOR
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #dbe4f0",
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}