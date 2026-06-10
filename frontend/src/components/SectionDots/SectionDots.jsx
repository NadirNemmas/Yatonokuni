import { useState, useEffect } from "react";
import "./styles/section-dots.scss";

/**
 * sections: Array<{ id: string | null, label: string }>
 *   id: null  → scroll to top of page
 *   id: string → scroll to element with that DOM id
 */
export default function SectionDots({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observers = [];

    sections.forEach(({ id }) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // If the first section has no id (= "top"), reset active when near top
    const firstHasNoId = !sections[0]?.id;
    const onScroll = () => {
      if (firstHasNoId && window.scrollY < 80) setActiveId(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const scrollTo = (id) => {
    if (!id) window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (sections.length === 0) return null;

  return (
    <nav className="section-dots" aria-label="Navigation sections">
      {sections.map(({ id, label }) => {
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
