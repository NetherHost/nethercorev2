"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";

interface DatePickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  label,
  description,
  value,
  onChange,
  placeholder = "Select date and time",
  icon,
  error,
  disabled = false,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState({
    hours: value ? new Date(value).getHours() : 0,
    minutes: value ? new Date(value).getMinutes() : 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setSelectedTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
      });
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (selectedTime !== null) {
      const newDateTime = new Date(date);
      newDateTime.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);
      onChange?.(newDateTime.toISOString());
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", value: number) => {
    const newTime = { ...selectedTime, [type]: value };
    setSelectedTime(newTime);

    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(newTime.hours, newTime.minutes, 0, 0);
      onChange?.(newDateTime.toISOString());
    }
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return "";
    const dateStr = selectedDate.toLocaleDateString();
    const timeStr = `${selectedTime.hours
      .toString()
      .padStart(2, "0")}:${selectedTime.minutes.toString().padStart(2, "0")}`;
    return `${dateStr} ${timeStr}`;
  };

  const generateCalendarDays = () => {
    if (!selectedDate) return [];

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return selectedDate && date.getMonth() === selectedDate.getMonth();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (!selectedDate) return;

    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const baseClasses = `w-full bg-black/50 border rounded-lg px-3 py-2.5 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
    error ? "border-red-500" : "border-neutral-800 hover:border-neutral-700"
  } ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  return (
    <div className="relative">
      {label && (
        <label className="block text-white font-medium mb-2">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
      )}
      {description && (
        <p className="text-neutral-400 text-sm mb-3">{description}</p>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={baseClasses}
          disabled={disabled}
        >
          <div className="flex items-center justify-between">
            <span className={selectedDate ? "text-white" : "text-neutral-400"}>
              {selectedDate ? formatDisplayValue() : placeholder}
            </span>
            <i
              className={`fas fa-chevron-down text-neutral-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-neutral-800 rounded-lg shadow-lg z-50 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h3 className="text-white font-medium">
                  {selectedDate &&
                    selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                </h3>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-neutral-400 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {generateCalendarDays().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 text-sm rounded transition-colors ${
                      isSelected(date)
                        ? "bg-red-500 text-white"
                        : isToday(date)
                        ? "bg-neutral-700 text-white"
                        : isCurrentMonth(date)
                        ? "text-white hover:bg-neutral-700"
                        : "text-neutral-500 hover:bg-neutral-800"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4">
                <h4 className="text-white font-medium mb-3">Time</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-neutral-400 text-sm">Hours:</label>
                    <select
                      value={selectedTime.hours}
                      onChange={(e) =>
                        handleTimeChange("hours", parseInt(e.target.value))
                      }
                      className="bg-black/50 border border-neutral-800 rounded px-2 py-1 text-white text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-neutral-400 text-sm">Minutes:</label>
                    <select
                      value={selectedTime.minutes}
                      onChange={(e) =>
                        handleTimeChange("minutes", parseInt(e.target.value))
                      }
                      className="bg-black/50 border border-neutral-800 rounded px-2 py-1 text-white text-sm"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-neutral-800">
                <Button
                  onClick={() => {
                    const now = new Date();
                    setSelectedDate(now);
                    setSelectedTime({
                      hours: now.getHours(),
                      minutes: now.getMinutes(),
                    });
                    onChange?.(now.toISOString());
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <i className="fas fa-clock"></i>
                  Now
                </Button>
                <Button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime({ hours: 0, minutes: 0 });
                    onChange?.("");
                    setIsOpen(false);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <i className="fas fa-times"></i>
                  Clear
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="primary"
                >
                  <i className="fas fa-check"></i>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
