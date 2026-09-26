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
  
  export default function PerformanceCharts({
    records,
  }: PerformanceChartsProps) {
    const chartRecords = [...records]
      .reverse()
      .slice(-10)
      .map((record) => ({
        name: `#${record.id}`,
        duration: record.durationMs,
        path: record.path,
      }));
  
    const statusCounts = records.reduce<
      Record<string, number>
    >((counts, record) => {
      const statusGroup = `${Math.floor(
        record.statusCode / 100
      )}xx`;
  
      counts[statusGroup] =
        (counts[statusGroup] ?? 0) + 1;
  
      return counts;
    }, {});
  
    const statusData = Object.entries(statusCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  
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
  
    return (
      <div className="performance-analysis">
        <h2>Performance Analysis</h2>
  
        <div className="analysis-summary">
          <div className="analysis-card">
            <span>Average Duration</span>
            <strong>
              {averageDuration.toFixed(2)} ms
            </strong>
          </div>
  
          <div className="analysis-card">
            <span>Fastest Request</span>
            <strong>{fastestRequest} ms</strong>
          </div>
  
          <div className="analysis-card">
            <span>Slowest Request</span>
            <strong>{slowestRequest} ms</strong>
          </div>
  
          <div className="analysis-card">
            <span>Total Requests</span>
            <strong>{records.length}</strong>
          </div>
        </div>
  
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Request Duration</h3>
  
            {chartRecords.length === 0 ? (
              <p>No request data available.</p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={chartRecords}>
                  <CartesianGrid strokeDasharray="3 3" />
  
                  <XAxis dataKey="name" />
  
                  <YAxis />
  
                  <Tooltip
                    formatter={(value) => [
                      `${value} ms`,
                      "Duration",
                    ]}
                    labelFormatter={(label) => label}
                  />
  
                  <Bar dataKey="duration" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
  
          <div className="chart-card">
            <h3>Status Distribution</h3>
  
            {statusData.length === 0 ? (
              <p>No status data available.</p>
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
                    label
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                      />
                    ))}
                  </Pie>
  
                  <Tooltip />
  
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    );
  }