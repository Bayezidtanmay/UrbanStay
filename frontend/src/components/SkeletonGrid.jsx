import SkeletonCard from "./SkeletonCard";

export default function SkeletonGrid({ count = 6 }) {
    return (
        <div className="apartment-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}