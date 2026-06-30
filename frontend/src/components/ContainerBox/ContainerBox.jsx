import "./styles/container-box.scss";
export default function ContainerBox({ children, onClick, id }) {
  return (
    <div
      id={id}
      className={`div-box-container${onClick ? " div-box-container--clickable" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
