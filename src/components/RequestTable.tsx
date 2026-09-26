import type { PerformanceRecord } from "../types/performance";

interface RequestTableProps {
  records: PerformanceRecord[];
  onSelect: (record: PerformanceRecord) => void;
}

function getStatusClass(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) {
    return "status-success";
  }

  if (statusCode >= 400) {
    return "status-error";
  }

  return "status-other";
}

export default function RequestTable({
  records,
  onSelect,
}: RequestTableProps) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="clickable-row"
              onClick={() => onSelect(record)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  onSelect(record);
                }
              }}
            >
              <td>
                <span className="method-badge">
                  {record.method}
                </span>
              </td>

              <td>{record.path}</td>

              <td>
                <span
                  className={getStatusClass(record.statusCode)}
                >
                  {record.statusCode}
                </span>
              </td>

              <td>{record.durationMs} ms</td>

              <td>
                {new Date(record.createdAtUtc).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && (
        <p className="empty-message">
          No performance records found.
        </p>
      )}
    </div>
  );
}