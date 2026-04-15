export default function SkeletonProfile() {
    return (
        <div className="details-card section-card profile-card">
            <div className="profile-card-top">
                <div className="profile-card-left">
                    <div className="skeleton skeleton-avatar" />

                    <div className="skeleton-profile-lines">
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-text" />
                        <div className="skeleton skeleton-text" />
                        <div className="skeleton skeleton-text short" />
                    </div>
                </div>

                <div className="skeleton skeleton-button" />
            </div>

            <div className="profile-bio-box">
                <div className="skeleton skeleton-title small" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" />
            </div>
        </div>
    );
}