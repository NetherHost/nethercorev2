"use client";

import React from "react";

interface SliderProps {
  label?: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export default function Slider({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  disabled = false,
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-white font-medium text-sm">{label}</label>
          {formatValue && (
            <span className="text-white font-mono text-sm min-w-[100px] text-right">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${
              ((value - min) / (max - min)) * 100
            }%, #404040 ${((value - min) / (max - min)) * 100}%, #404040 100%)`,
          }}
        />
      </div>
      {description && <p className="text-neutral-400 text-xs">{description}</p>}
    </div>
  );
}
