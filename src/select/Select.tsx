import React, { useState, useRef, useEffect } from 'react';
import './select.scss';
import { FaDesktop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';

const devices = [
  { type: 'desktop', icon: <FaDesktop />, label: 'Desktop' },
  { type: 'tablet', icon: <FaTabletAlt />, label: 'Tablet' },
  { type: 'mobile', icon: <FaMobileAlt />, label: 'Mobile' }
];

export const ResponsiveSelect: React.FC = () => {
  const [selected, setSelected] = useState<string>('desktop');
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedDevice = devices.find((device) => device.type === selected);

  return (
    <div
      className={`responsive-select ${open ? 'open' : ''}`}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <div className="responsive-select__holder">
        <button
          className="responsive-select__button active"
          aria-label={selectedDevice?.label}
        >
          {selectedDevice?.icon}
        </button>
      </div>
      <div className="responsive-select__dropdown">
        {devices.map((device) => (
          <button
            key={device.type}
            className={`responsive-select__button ${selected === device.type ? 'active' : ''}`}
            aria-label={device.label}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(device.type);
              setOpen(false);
            }}
          >
            {device.icon} {device.label}
          </button>
        ))}
      </div>
    </div>
  );
};