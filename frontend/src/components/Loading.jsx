export default function Loading({ text = "Loading..." }) {
    return (
        <div className="loading-wrapper" role="status" aria-live="polite">
            <div className="loading-spinner" />
            <p className="loading-text">{text}</p>
        </div>
    );
}