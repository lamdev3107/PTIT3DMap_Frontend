import React from "react";
import clsx from "clsx";

const Indicator = ({ total, activeIndex }) => {
  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "h-2 rounded-full transition-all duration-300",
            index === activeIndex ? "w-10 bg-muted-foreground" : "w-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
};

export default Indicator;

export const Demo = () => {
  const [current, setCurrent] = useState(1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center space-y-4">
      <SliderIndicator total={5} activeIndex={current} />
      <button
        className="border px-4 py-2 rounded"
        onClick={() => setCurrent((prev) => (prev + 1) % 5)}
      >
        Next
      </button>
    </div>
  );
};
