import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

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
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {items.length > 0 && (
                            <button
                                type="button"
                                className="notification-mark-all"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <p className="notification-empty">No notifications yet.</p>
                    ) : (
                        <div className="notification-list">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`notification-item ${item.is_read ? "" : "notification-unread"}`}
                                >
                                    <div className="notification-text">
                                        <strong>{item.title}</strong>
                                        <p>{item.message}</p>
                                    </div>

                                    <div className="notification-actions">
                                        {item.link ? (
                                            <Link
                                                to={item.link}
                                                onClick={() => markOneAsRead(item.id)}
                                                className="notification-link"
                                            >
                                                Open
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                className="notification-link"
                                                onClick={() => markOneAsRead(item.id)}
                                            >
                                                Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}