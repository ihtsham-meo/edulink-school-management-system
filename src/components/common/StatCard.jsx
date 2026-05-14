function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  const gradients = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-emerald-500 to-teal-400",
    orange: "from-amber-400 to-orange-400",
    red: "from-red-500 to-rose-400",
    purple: "from-violet-500 to-purple-400",
    cyan: "from-cyan-500 to-sky-400",
    pink: "from-pink-500 to-rose-400",
    indigo: "from-indigo-500 to-violet-400",
    teal: "from-teal-500 to-cyan-400",
    lime: "from-lime-500 to-green-400",
    amber: "from-amber-500 to-yellow-400",
    rose: "from-rose-500 to-pink-400",
    sky: "from-sky-500 to-blue-400",
    violet: "from-violet-500 to-indigo-400",
    fuchsia: "from-fuchsia-500 to-purple-400",
    emerald: "from-emerald-500 to-teal-400",
    sunset: "from-orange-400 to-pink-500",
    ocean: "from-blue-400 to-cyan-600",
    forest: "from-green-400 to-emerald-600",
    candy: "from-pink-400 to-purple-500",
    fire: "from-red-400 to-orange-500",
    midnight: "from-indigo-600 to-blue-900",
    aurora: "from-teal-400 to-indigo-500",
    coral: "from-rose-400 to-orange-400",
    lavender: "from-purple-400 to-pink-400",
    golden: "from-yellow-400 to-orange-500",
    steel: "from-slate-400 to-gray-600",
    mint: "from-emerald-300 to-teal-500",
  };

  const shadowColors = {
    blue: "0 8px 20px rgba(59, 130, 246, 0.3)",
    green: "0 8px 20px rgba(16, 185, 129, 0.3)",
    orange: "0 8px 20px rgba(251, 146, 60, 0.3)",
    red: "0 8px 20px rgba(239, 68, 68, 0.3)",
    purple: "0 8px 20px rgba(147, 51, 234, 0.3)",
    cyan: "0 8px 20px rgba(34, 211, 238, 0.3)",
    pink: "0 8px 20px rgba(236, 72, 153, 0.3)",
    indigo: "0 8px 20px rgba(99, 102, 241, 0.3)",
    teal: "0 8px 20px rgba(20, 184, 166, 0.3)",
    lime: "0 8px 20px rgba(132, 204, 22, 0.3)",
    amber: "0 8px 20px rgba(217, 119, 6, 0.3)",
    rose: "0 8px 20px rgba(244, 63, 94, 0.3)",
    sky: "0 8px 20px rgba(14, 165, 233, 0.3)",
    violet: "0 8px 20px rgba(139, 92, 246, 0.3)",
    fuchsia: "0 8px 20px rgba(217, 70, 239, 0.3)",
    emerald: "0 8px 20px rgba(16, 185, 129, 0.3)",
    sunset: "0 8px 20px rgba(251, 146, 60, 0.3)",
    ocean: "0 8px 20px rgba(59, 130, 246, 0.3)",
    forest: "0 8px 20px rgba(34, 197, 94, 0.3)",
    candy: "0 8px 20px rgba(236, 72, 153, 0.3)",
    fire: "0 8px 20px rgba(239, 68, 68, 0.3)",
    midnight: "0 8px 20px rgba(79, 70, 229, 0.3)",
    aurora: "0 8px 20px rgba(20, 184, 166, 0.3)",
    coral: "0 8px 20px rgba(251, 113, 133, 0.3)",
    lavender: "0 8px 20px rgba(168, 85, 247, 0.3)",
    golden: "0 8px 20px rgba(202, 138, 4, 0.3)",
    steel: "0 8px 20px rgba(107, 114, 128, 0.3)",
    mint: "0 8px 20px rgba(16, 185, 129, 0.3)",
  };

  return (
    <div
      style={{
        boxShadow: shadowColors[gradient] || shadowColors.blue,
      }}
      className={`relative bg-gradient-to-br ${gradients[gradient] || gradients.blue} rounded-xl p-4 text-white overflow-hidden transition-shadow hover:shadow-lg`}
    >
      {/* Large faded watermark icon */}
      {Icon && (
        <div className="absolute -bottom-4 right-0 opacity-15">
          <Icon size={95} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="text-2xl font-semibold leading-none mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{title}</div>
        {subtitle && <div className="text-xs opacity-70 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

export default StatCard;
