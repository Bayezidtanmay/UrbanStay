import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminBrokerMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState("");

    async function fetchMessages() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/admin/broker-messages");
            setMessages(data || []);
        } catch (err) {
            setError(err.message || "Failed to load broker messages.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    async function deleteMessage(id) {
        const confirmed = window.confirm("Delete this broker message?");
        if (!confirmed) return;

        try {
            setMessageText("");
            setError("");

            const data = await apiFetch(`/admin/broker-messages/${id}`, {
                method: "DELETE",
            });

            setMessageText(data.message || "Message deleted successfully.");
            fetchMessages();
        } catch (err) {
            setError(err.message || "Failed to delete broker message.");
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <h1>Broker Messages</h1>

            {messageText && <p className="success-text">{messageText}</p>}
            {error && <p className="error-text">{error}</p>}

            {messages.length === 0 ? (
                <p>No broker messages found.</p>
            ) : (
                <div className="message-list">
                    {messages.map((item) => (
                        <div key={item.id} className="message-item">
                            <h3>{item.broker?.name || "Unknown Broker"}</h3>
                            <p><strong>Area:</strong> {item.broker?.area}</p>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Email:</strong> {item.email}</p>
                            <p><strong>Message:</strong></p>
                            <p className="message-body">{item.message}</p>

                            <button
                                className="btn btn-danger"
                                onClick={() => deleteMessage(item.id)}
                            >
                                Delete Message
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}