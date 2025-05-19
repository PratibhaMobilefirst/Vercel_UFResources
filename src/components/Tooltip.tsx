import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  isVisible?: boolean;
  onNext?: () => void;
  onSkip?: () => void;
  showActions?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
  isVisible = false,
  onNext,
  onSkip,
  showActions = false,
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div className="inline-block">{children}</div>
      {isVisible && (
        <div
          className={`absolute z-50 px-4 py-3 text-sm text-white bg-gray-600 rounded-md shadow-md whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="mb-2">{text}</div>

          {showActions && (
            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-700">
              <button
                onClick={onSkip}
                className="px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                onClick={onNext}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          <div
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              position === "top"
                ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                : position === "bottom"
                ? "top-[-4px] left-1/2 -translate-x-1/2"
                : position === "left"
                ? "right-[-4px] top-1/2 -translate-y-1/2"
                : "left-[-4px] top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
