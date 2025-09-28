"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "./Input";

interface TagInputProps {
  label?: string;
  description?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({
  label,
  description,
  tags,
  onTagsChange,
  placeholder = "Enter tag",
  maxTags,
}: TagInputProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      if (!maxTags || tags.length < maxTags) {
        onTagsChange([...tags, newTag.trim()]);
        setNewTag("");
      }
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-white font-medium text-sm">{label}</label>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            onClick={addTag}
            size="sm"
            disabled={
              !newTag.trim() ||
              (maxTags !== undefined && tags.length >= maxTags)
            }
          >
            <i className="fas fa-plus"></i>
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-neutral-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {description && <p className="text-neutral-400 text-xs">{description}</p>}
    </div>
  );
}
