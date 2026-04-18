import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

function getNotificationIcon(type) {
    if (type === "booking_status_updated" || type === "booking_created") {
        return "🔔";
    }

    if (type === "payment_success" || type === "booking_paid") {
        return "✅";
    }

    if (type === "booking_cancelled") {
        return "❌";
    }

    if (type === "broker_message" || type === "apartment_contact_message") {
        return "✉️";
    }

    return "🔔";
}

function getNotificationActionLabel(type) {
    if (
        type === "booking_status_updated" ||
        type === "booking_created" ||
        type === "booking_cancelled"
    ) {
        return "View Booking";
    }

    if (type === "payment_success" || type === "booking_paid") {
        return "View Payment";
    }

    if (type === "broker_message" || type === "apartment_contact_message") {
        return "Open Message";
    }

    return "Open";
}

function formatTimeAgo(dateString) {
    if (!dateString) return "";

    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now - created;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationBell() {
    const [items, setItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    async function fetchNotifications() {
        try {
            const data = await apiFetch("/notifications");
            setItems(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function markOneAsRead(id) {
        try {
            await apiFetch(`/notifications/${id}/read`, {
                method: "PATCH",
            });
            fetchNotifications();
        } catch (error) {
            console.error(error.message);
        }
    }

    async function markAllAsRead() {
        try {
            await apiFetch("/notifications/read-all", {
                method: "PATCH",
            });
            fetchNotifications();
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="notification-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className="notification-bell"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="notification-bell-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="notification-panel">
                    <div className="notification-panel-header">
                        <h3>Notifications</h3>

                        {items.length > 0 && (
                            <button
                                type="button"
                                className="notification-mark-all"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="notification-empty-state">
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="notification-panel-list">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`notification-card ${item.is_read ? "" : "notification-card-unread"}`}
                                    >
                                        <div className="notification-card-icon">
                                            <span>{getNotificationIcon(item.type)}</span>
                                        </div>

                                        <div className="notification-card-content">
                                            <h4>{item.title}</h4>
                                            <p>{item.message}</p>
                                            <span className="notification-time">
                                                {formatTimeAgo(item.created_at)}
                                            </span>

                                            <div className="notification-card-actions">
                                                {item.link ? (
                                                    <Link
                                                        to={item.link}
                                                        className="notification-action-btn"
                                                        onClick={() => markOneAsRead(item.id)}
                                                    >
                                                        {getNotificationActionLabel(item.type)}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="notification-action-btn"
                                                        onClick={() => markOneAsRead(item.id)}
                                                    >
                                                        Open
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="notification-panel-footer">
                                <button
                                    type="button"
                                    className="notification-footer-link"
                                    onClick={markAllAsRead}
                                >
                                    View All Notifications
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}