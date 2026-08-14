import { useMemo, useState } from "react";
import { Card, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RequestStatusPill } from "../../components/StatusPills";
import { useApp } from "../../context/AppContext";
import { toFaDigits } from "../../lib/format";
import type { RequestStatus } from "../../types";

type Filter = "all" | RequestStatus;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "open", label: "باز" },
  { key: "in_progress", label: "در حال انجام" },
  { key: "done", label: "انجام شد" },
];

export default function AdminRequests() {
  const { requests } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all" ? requests : requests.filter((r) => r.status === filter),
    [requests, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length };
    for (const r of requests) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [requests]);

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">درخواست‌های تعمیر</h1>
        <div className="text-muted-bm" style={{ fontSize: "0.8rem" }}>
          {toFaDigits(requests.length)} درخواست در سابقه — پاسخ در ۲۴ ساعت، هدف
          SLA
        </div>
      </div>

      <Nav variant="pills" className="mb-3 gap-1 flex-nowrap overflow-auto">
        {filters.map((f) => (
          <Nav.Item key={f.key}>
            <Nav.Link
              active={filter === f.key}
              className={
                filter === f.key ? "bg-primary text-white" : "text-muted-bm"
              }
              onClick={() => setFilter(f.key)}
              href="#"
            >
              {f.label}
              <span className="ms-1 small opacity-75">
                ({toFaDigits(counts[f.key] ?? 0)})
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {filtered.length === 0 && (
        <Card className="bm-card">
          <Card.Body>
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-tools empty-icon" />
              <div className="fw-bold text-dark">
                درخواستی در این وضعیت نیست
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex flex-column gap-3">
        {filtered.map((r) => (
          <Card key={r.id} className="bm-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div className="">
                  <span className="status-pill status-blue ms-2">
                    {r.category}
                  </span>
                  <span
                    className="text-muted-bm d-block mt-1"
                    style={{ fontSize: "0.8rem" }}
                  >
                    واحد {toFaDigits(r.unitNum)} · {r.residentName} ·{" "}
                    {r.createdAt}
                  </span>
                </div>
                <RequestStatusPill status={r.status} />
              </div>
              <p className="mb-2" style={{ fontSize: "0.92rem" }}>
                {r.description}
              </p>
              <button
                className="btn btn-link p-0 text-decoration-none small fw-bold"
                onClick={() => navigate(`/admin/requests/${r.id}`)}
              >
                مشاهده و تغییر وضعیت
                <i aria-hidden="true" className="bi bi-chevron-left" />
              </button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
