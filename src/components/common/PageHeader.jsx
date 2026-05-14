function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-light-text-primary dark:text-dark-text-primary text-xl font-semibold">
          {title}
        </h1>
        {subtitle && (
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;
