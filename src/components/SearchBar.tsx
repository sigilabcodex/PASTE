import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar" aria-label="Search symbols">
      <span className="search-bar__icon" aria-hidden="true">
        🔎
      </span>
      <input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder="Search symbol, name, keyword, or codepoint..."
        autoComplete="off"
      />
    </label>
  );
}
