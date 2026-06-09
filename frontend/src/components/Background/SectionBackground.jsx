import { sectionBackgrounds } from "../../lib/data/sectionBackgrounds.js";

export default function SectionBackground({
  sectionKey,
  className = "",
  id,
  children,
}) {
  const bg = sectionBackgrounds[sectionKey];

  return (
    <div
      className={className}
      style={{
        backgroundImage: bg ? `url(${bg})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
      id={id}
    >
      {children}
    </div>
  );
}
