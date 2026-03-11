import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState("");

    async function fetchMessages() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/contact-messages");
            setMessages(data.data || []);
        } catch (err) {
            setError(err.message || "Failed to load contact messages.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    async function deleteMessage(id) {
        const confirmed = window.confirm("Delete this message?");
        if (!confirmed) return;

        try {
            setMessageText("");
            setError("");

            const data = await apiFetch(`/contact-messages/${id}`, {
                method: "DELETE",
            });

            setMessageText(data.message || "Message deleted successfully.");
            fetchMessages();
        } catch (err) {
            setError(err.message || "Failed to delete message.");
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <h1>Contact Messages</h1>

            {messageText && <p className="success-text">{messageText}</p>}
            {error && <p className="error-text">{error}</p>}

            {messages.length === 0 ? (
                <p>No contact messages found.</p>
            ) : (
                <div className="message-list">
                    {messages.map((item) => (
                        <div key={item.id} className="message-item">
                            <h3>{item.apartment?.title || "Unknown Apartment"}</h3>
                            <p><strong>Location:</strong> {item.apartment?.location}</p>
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