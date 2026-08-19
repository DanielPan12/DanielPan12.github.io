import { useState } from 'react';
import './PhotoCarousel.css';

const PhotoCarousel = ({ images, alt, fit = 'cover', initialIndex = 0 }) => {
  const [index, setIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const go = delta => {
    setIndex(prev => (prev + delta + images.length) % images.length);
  };

  return (
    <div className="photo-carousel">
      <img src={images[index]} alt={alt} className="photo-carousel__image" style={{ objectFit: fit }} />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="photo-carousel__arrow photo-carousel__arrow--prev"
            onClick={() => go(-1)}
            aria-label="上一张"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="photo-carousel__arrow photo-carousel__arrow--next"
            onClick={() => go(1)}
            aria-label="下一张"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="photo-carousel__dots">
            {images.map((_, i) => (
              <span key={i} className={`photo-carousel__dot ${i === index ? 'is-active' : ''}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoCarousel;
