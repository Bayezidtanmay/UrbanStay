import { useEffect, useRef, useState } from "react";

export default function ImageSlider({
    featuredImage,
    galleryImages = [],
    title,
}) {
    const allImages = [
        ...(featuredImage ? [featuredImage] : []),
        ...galleryImages.map((img) => img.image_path),
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    function goPrev() {
        setCurrentIndex((prev) =>
            prev === 0 ? allImages.length - 1 : prev - 1
        );
    }

    function goNext() {
        setCurrentIndex((prev) =>
            prev === allImages.length - 1 ? 0 : prev + 1
        );
    }

    function goToSlide(index) {
        setCurrentIndex(index);
    }

    function handleTouchStart(e) {
        touchStartX.current = e.changedTouches[0].clientX;
    }

    function handleTouchEnd(e) {
        touchEndX.current = e.changedTouches[0].clientX;
        const distance = touchStartX.current - touchEndX.current;

        if (distance > 50) {
            goNext();
        } else if (distance < -50) {
            goPrev();
        }
    }

    useEffect(() => {
        if (allImages.length <= 1 || lightboxOpen) return;

        const interval = setInterval(() => {
            goNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [allImages.length, lightboxOpen, currentIndex]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (!lightboxOpen) return;

            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "Escape") setLightboxOpen(false);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen]);

    if (allImages.length === 0) {
        return null;
    }

    return (
        <>
            <div className="slider-wrapper">
                <div
                    className="slider-main"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {allImages.length > 1 && (
                        <button
                            type="button"
                            className="slider-btn slider-btn-left"
                            onClick={goPrev}
                        >
                            ‹
                        </button>
                    )}

                    <img
                        src={allImages[currentIndex]}
                        alt={`${title} ${currentIndex + 1}`}
                        className="slider-image"
                        onClick={() => setLightboxOpen(true)}
                    />

                    {allImages.length > 1 && (
                        <button
                            type="button"
                            className="slider-btn slider-btn-right"
                            onClick={goNext}
                        >
                            ›
                        </button>
                    )}
                </div>

                {allImages.length > 1 && (
                    <div className="slider-thumbnails">
                        {allImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`slider-thumbnail ${index === currentIndex ? "active-thumbnail" : ""
                                    }`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button
                            type="button"
                            className="lightbox-close"
                            onClick={() => setLightboxOpen(false)}
                        >
                            ×
                        </button>

                        {allImages.length > 1 && (
                            <button
                                type="button"
                                className="slider-btn slider-btn-left"
                                onClick={goPrev}
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={allImages[currentIndex]}
                            alt={`${title} large ${currentIndex + 1}`}
                            className="lightbox-image"
                        />

                        {allImages.length > 1 && (
                            <button
                                type="button"
                                className="slider-btn slider-btn-right"
                                onClick={goNext}
                            >
                                ›
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}