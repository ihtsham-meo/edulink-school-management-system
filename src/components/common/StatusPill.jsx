function StatusPill({ status, styles }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const style =
    styles[status] ||
    "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";

  return (
    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${style}`}>
      {label}
    </span>
  );
}

export default StatusPill;
