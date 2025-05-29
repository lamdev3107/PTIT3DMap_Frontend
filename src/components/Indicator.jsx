import React from "react";
import clsx from "clsx";

const Indicator = ({ total, activeIndex, progress = 0, onSectionClick }) => {
  return (
    <div className="flex gap-3 items-center">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          onClick={() => onSectionClick && onSectionClick(index)}
          className={clsx(
            "h-2 rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden",
            index === activeIndex
              ? "w-14 bg-muted "
              : "w-2 bg-muted hover:bg-red-primary/90"
          )}
        >
          {index === activeIndex && (
            <div
              className="absolute top-0 left-0 h-full bg-red-primary  transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Indicator;
