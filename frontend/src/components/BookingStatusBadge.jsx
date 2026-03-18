export default function BookingStatusBadge({ status }) {
    const normalized = String(status || "").toLowerCase();

    let className = "status-badge";
    if (normalized === "confirmed") className += " status-confirmed";
    else if (normalized === "pending") className += " status-pending";
    else if (normalized === "cancelled") className += " status-cancelled";

    return <span className={className}>{status}</span>;
}