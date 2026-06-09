import "./imageSliderStyle.css";
import { useState } from "react";

export default function ImageSlider({ imageSlider }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const plusSlides = (n) =>
    setCurrentSlide(
      (prev) => (prev + n + imageSlider.length) % imageSlider.length
    );
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="slideshow-container" aria-roledescription="carousel">
      {imageSlider.map((img, index) => (
        <div
          key={img.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${imageSlider.length}`}
        >
          <img src={img.src} alt={img.alt} />

          <button
            className="prev"
            onClick={() => plusSlides(-1)}
            aria-label="Previous slide"
            type="button"
          >
            ❮
          </button>
          <button
            className="next"
            onClick={() => plusSlides(1)}
            aria-label="Next slide"
            type="button"
          >
            ❯
          </button>
        </div>
      ))}
      <div
        className="dots-container"
        role="tablist"
        aria-label="Slide navigation"
      >
        {imageSlider.map((img, index) => (
          <button
            key={img.id}
            type="button"
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={index === currentSlide}
          />
        ))}
      </div>
    </div>
  );
}
