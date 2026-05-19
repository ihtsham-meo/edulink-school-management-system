import { Loader2, X } from "lucide-react";

export function CrudModal({ title, children, footer, onClose, maxWidth = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full ${maxWidth} rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card`}>
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover hover:text-light-text-primary dark:text-dark-text-tertiary dark:hover:bg-dark-hover dark:hover:text-dark-text-primary"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary ${
          error ? "border-danger" : "border-light-border dark:border-dark-border"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export function TextAreaField({ label, value, onChange, error, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <textarea
        value={value ?? ""}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full resize-none rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary ${
          error ? "border-danger" : "border-light-border dark:border-dark-border"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export function SelectField({ label, value, options, onChange, error }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary ${
          error ? "border-danger" : "border-light-border dark:border-dark-border"
        }`}
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export function ModalButton({
  children,
  onClick,
  type = "button",
  variant = "secondary",
  isLoading = false,
}) {
  const styles =
    variant === "danger"
      ? "bg-danger text-white hover:bg-red-600"
      : variant === "primary"
        ? "bg-accent text-white hover:bg-accent-hover"
        : "border border-light-border text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${styles}`}
    >
      {isLoading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

export function DetailGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-light-border px-3 py-2 dark:border-dark-border"
        >
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            {label}
          </p>
          <p className="mt-1 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
            {value || "-"}
          </p>
        </div>
      ))}
    </div>
  );
}
