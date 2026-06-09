import "./styles/buttons.scss";

export default function SubmitButton({ title, loading, loadingText }) {
  return (
    <button className="button" type="submit" disabled={loading}>
      {{ loading } ? loadingText : title}
    </button>
  );
}
