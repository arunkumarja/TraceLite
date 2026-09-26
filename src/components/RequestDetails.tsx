import { useEffect, useState } from "react";
import { getSqlForRequest } from "../api/performanceApi";
import type {
  PerformanceRecord,
  SqlPerformanceRecord,
} from "../types/performance";

interface RequestDetailsProps {
  record: PerformanceRecord;
  onBack: () => void;
}

export default function RequestDetails({
  record,
  onBack,
}: RequestDetailsProps) {
  const [sqlRecords, setSqlRecords] = useState<
    SqlPerformanceRecord[]
  >([]);

  const [loadingSql, setLoadingSql] = useState(true);

  const [sqlError, setSqlError] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadSqlRecords() {
      try {
        setLoadingSql(true);
        setSqlError(null);

        const records = await getSqlForRequest(record.id);

        setSqlRecords(records);
      } catch (error) {
        console.error(
          "Failed to load SQL records:",
          error
        );

        setSqlError(
          "Failed to load SQL queries."
        );
      } finally {
        setLoadingSql(false);
      }
    }

    loadSqlRecords();
  }, [record.id]);

  return (
    <div className="details-container">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="details-header">
        <h2>Request Details</h2>
      </div>

      <div className="request-info">
        <div className="detail-item">
          <span className="detail-label">
            Method
          </span>

          <span className="detail-value">
            {record.method}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Path
          </span>

          <span className="detail-value">
            {record.path}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Status
          </span>

          <span className="detail-value">
            {record.statusCode}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Duration
          </span>

          <span className="detail-value">
            {record.durationMs} ms
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Created
          </span>

          <span className="detail-value">
            {new Date(
              record.createdAtUtc
            ).toLocaleString()}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            Trace ID
          </span>

          <span className="detail-value trace-id">
            {record.traceId}
          </span>
        </div>
      </div>

      <div className="sql-section">
        <div className="sql-section-header">
          <h3>SQL Queries</h3>

          <span className="sql-count">
            {sqlRecords.length} queries
          </span>
        </div>

        {loadingSql && (
          <p className="loading-text">
            Loading SQL queries...
          </p>
        )}

        {sqlError && (
          <p className="error-text">
            {sqlError}
          </p>
        )}

        {!loadingSql &&
          !sqlError &&
          sqlRecords.length === 0 && (
            <div className="empty-state">
              <p>
                No SQL queries were recorded for
                this request.
              </p>
            </div>
          )}

        {!loadingSql &&
          !sqlError &&
          sqlRecords.length > 0 && (
            <div className="sql-list">
              {sqlRecords.map(
                (sqlRecord, index) => (
                  <div
                    className="sql-card"
                    key={sqlRecord.id}
                  >
                    <div className="sql-card-header">
                      <div>
                        <strong>
                          Query #{index + 1}
                        </strong>
                      </div>

                      <span className="sql-duration">
                        {sqlRecord.durationMs} ms
                      </span>
                    </div>

                    <div className="sql-metadata">
                      <span>
                        Type:{" "}
                        {sqlRecord.commandType}
                      </span>
                    </div>

                    <pre>
                      {sqlRecord.commandText}
                    </pre>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}