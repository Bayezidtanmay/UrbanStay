export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-image" />
            <div className="skeleton-card-body">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
                <div className="skeleton skeleton-price" />
            </div>
        </div>
    );
}