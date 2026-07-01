import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DeleteConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(5);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setCount(5);
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          onConfirm();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  function handleCancel() {
    clearInterval(intervalRef.current);
    onCancel();
  }

  return (
    <div className="la-overlay" onClick={handleCancel}>
      <div className="la-modal" onClick={(e) => e.stopPropagation()}>
        <div className="la-delete-confirm">
          <p className="la-delete-confirm__message">{message}</p>
          <div className="la-delete-confirm__countdown">{count}</div>
          <div className="la-delete-confirm__actions">
            <button className="btn-danger" onClick={onConfirm}>{t("lostark.deleteModal.delete")}</button>
            <button className="btn-cancel" onClick={handleCancel}>{t("lostark.deleteModal.cancel")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
