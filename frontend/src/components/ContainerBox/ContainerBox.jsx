import "./styles/container-box.scss";
export default function ContainerBox({ children, onClick, id }) {
  return (
    <div
      id={id}
      className="div-box-container"
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
}
