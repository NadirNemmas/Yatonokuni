import HomeButton from "../Buttons/HomeButton.jsx";
import SubmitButton from "../Buttons/SubmitButton.jsx";
import "./styles/forms.scss";

export default function SubmitForm({
  title,
  message,
  onSubmit,
  onSecondary,
  loading = false,
  primaryButtonLabel,
  secondaryButtonLabel,
  children,
  textEndForm,
}) {
  return (
    <div id="submitForm" className="submitForm">
      <h2>{title}</h2>
      {message && (
        <p className={`alert-message${message.type ? ` alert-message--${message.type}` : ""}`}>
          {message.text ?? message}
        </p>
      )}
      <form onSubmit={onSubmit}>
        {children}
        <SubmitButton
          title={primaryButtonLabel}
          loading={loading}
          loadingText="..."
        ></SubmitButton>
        {onSecondary ? (
          <button className="button" type="button" onClick={onSecondary}>
            {secondaryButtonLabel}
          </button>
        ) : (
          <HomeButton title={secondaryButtonLabel}></HomeButton>
        )}
      </form>
      {textEndForm && <p>{textEndForm}</p>}
    </div>
  );
}
