
import React, { useEffect, useRef } from 'react';

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  positionClasses: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({ isOpen, onClose, children, positionClasses }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      className={`absolute z-20 w-80 max-w-sm bg-card-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out ${positionClasses} ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
        {children}
    </div>
  );
};

export default FloatingPanel;
