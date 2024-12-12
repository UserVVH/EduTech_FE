import React, { useState } from "react";

const Dropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    onSelect(value);
    toggleDropdown();
  };

  // Find the label for the selected value, or default to a placeholder
  const selectedOption = options.find((option) => option.value === selected[0]);
  const selectedLabel = selectedOption
    ? selectedOption.label
    : "Select categories";

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {selectedLabel}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdown-item"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
