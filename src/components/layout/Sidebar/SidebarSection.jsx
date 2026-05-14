function SidebarSection({ label }) {
  return (
    <p className="px-4 no-scrollbar overflow-auto pt-4 pb-1 text-xs font-medium uppercase tracking-widest text-light-text-tertiary dark:text-dark-text-tertiary">
      {label}
    </p>
  );
}

export default SidebarSection;
