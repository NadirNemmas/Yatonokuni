import HomeButton from "../Buttons/HomeButton.jsx";
import SubmitButton from "../Buttons/SubmitButton.jsx";
import "./submitFormStyle.css";

export default function SubmitForm({
  title,
  message,
  onSubmit,
  loading = false,
  primaryButtonLabel,
  secondaryButtonLabel,
  children,
  textEndForm,
}) {
  return (
    <div id="submitForm" className="submitForm">
      <h2>{title}</h2>
      {message && <p className="alert-message">{message}</p>}
      <form onSubmit={onSubmit}>
        {children}
        <SubmitButton
          title="Logging in..."
          handleClick={onSubmit}
          loading={loading}
          loadingText={primaryButtonLabel}
        ></SubmitButton>
        <HomeButton title={secondaryButtonLabel}></HomeButton>
      </form>
      {textEndForm && <p>{textEndForm}</p>}
    </div>
  );
}
