import { useState, useEffect } from "react";
import "./styles/section-dots.scss";

/**
 * sections: Array<{ id: string, label: string }>
 * topLabel?: string — if provided, a "scroll to top" dot is prepended automatically
 */
export default function SectionDots({ sections = [], topLabel }) {
  const allSections = topLabel
    ? [{ id: null, label: topLabel }, ...sections]
    : sections;

  const [activeId, setActiveId] = useState(allSections[0]?.id ?? null);

  // Use a content-based key so the effect only re-runs when IDs actually change,
  // not every time the caller recreates the array reference.
  const sectionsKey = JSON.stringify(allSections.map((s) => s.id));

  useEffect(() => {
    if (allSections.length === 0) return;

    const observers = [];

    allSections.forEach(({ id }) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-10% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    const hasTopSection = !allSections[0]?.id;
    const onScroll = () => {
      if (hasTopSection && window.scrollY < 80) setActiveId(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTo = (id) => {
    if (!id) window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (allSections.length === 0) return null;

  return (
    <nav className="section-dots" aria-label="Navigation sections">
      {allSections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <div
            key={id ?? "__top__"}
            className={`section-dot-item${isActive ? " active" : ""}`}
          >
            <span className="dot-label">{label}</span>
            <button
              className="dot-btn"
              onClick={() => scrollTo(id)}
              aria-label={label}
              title={label}
            />
          </div>
        );
      })}
    </nav>
  );
}
