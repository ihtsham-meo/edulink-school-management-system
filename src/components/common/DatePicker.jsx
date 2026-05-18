import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const padDatePart = (value) => String(value).padStart(2, "0");

const toDateValue = (value) =>
  `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;

const fromDateValue = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getCalendarDays = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    return day;
  });
};

function DatePicker({ value, onChange, className = "", align = "right" }) {
  const selectedDate = fromDateValue(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const rootRef = useRef(null);

  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);
  const displayDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [value]);

  const moveMonth = (direction) => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1),
    );
  };

  const selectDate = (date) => {
    onChange(toDateValue(date));
    setOpen(false);
  };

  const dropdownAlign = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none hover:border-accent focus:border-accent transition-colors"
      >
        <span className="flex items-center gap-2">
          <Calendar size={15} className="text-accent" />
          {displayDate}
        </span>
        <ChevronRight
          size={15}
          className={`text-light-text-tertiary dark:text-dark-text-tertiary transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${dropdownAlign} top-12 z-40 w-[300px] rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-xl p-4`}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ChevronLeft size={17} />
            </button>
            <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-7 flex items-center justify-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dateValue = toDateValue(day);
              const isSelected = dateValue === value;
              const isToday = dateValue === toDateValue(new Date());
              const isCurrentMonth = day.getMonth() === viewDate.getMonth();

              return (
                <button
                  key={dateValue}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`h-9 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-accent text-white font-semibold"
                      : isToday
                        ? "bg-accent/10 text-accent font-semibold"
                        : isCurrentMonth
                          ? "text-light-text-primary dark:text-dark-text-primary hover:bg-light-hover dark:hover:bg-dark-hover"
                          : "text-light-text-tertiary/60 dark:text-dark-text-tertiary/60 hover:bg-light-hover dark:hover:bg-dark-hover"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={() => selectDate(new Date())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/15 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
