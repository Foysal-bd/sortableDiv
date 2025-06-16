import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  useMemo,
} from "react";
import { FaDesktop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import "./Select2.scss";

interface ViewOption {
  id: number;
  label: string;
  icon: JSX.Element;
}

const viewOptions: ViewOption[] = [
  { id: 1, label: "Desktop", icon: <FaDesktop /> },
  { id: 2, label: "Tablet view", icon: <FaTabletAlt /> },
  { id: 3, label: "Mobile view", icon: <FaMobileAlt /> },
];

const Select2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(
    viewOptions.findIndex((opt) => opt.id === activeId)
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard interaction
  const handleToggleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === viewOptions.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === 0 ? viewOptions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveId(viewOptions[focusedIndex].id);
        setIsOpen(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    },
    [isOpen, focusedIndex]
  );

  const handleOptionClick = useCallback((id: number) => {
    setActiveId(id);
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="alb-responsive-switcher" ref={wrapperRef}>
      <div
        className={`alb-responsive-switcher-holder ${isOpen ? "open" : ""}`}
        tabIndex={0}
        role="listbox"
        aria-activedescendant={`alb-option-${activeId}`}
        aria-expanded={isOpen}
        aria-label="Toggle responsive view options"
        onKeyDown={handleToggleKeyDown}
      >
        {viewOptions.map(({ id, label, icon }, index) => {
          const isActive = activeId === id;
          const isFocused = isOpen && focusedIndex === index;

          return (
            <div
              key={id}
              id={`alb-option-${id}`}
              role="option"
              aria-selected={isActive}
              aria-label={label}
              data-tooltip={label}
              className={`alb-switcher-btn ${isActive ? "alb-active" : ""} ${
                isFocused ? "alb-focused" : ""
              }`}
              onMouseDown={() => handleOptionClick(id)}
              onMouseOver={() => setFocusedIndex(index)}
              onMouseOut={() =>
                setFocusedIndex(
                  viewOptions.findIndex((opt) => opt.id === activeId)
                )
              }
            >
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select2;
