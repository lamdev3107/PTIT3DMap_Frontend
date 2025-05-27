import { Billboard, Html } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { ArrowRightIcon } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { FaInfo } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";

const Hotspot = memo(({ id, position, data, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // Sử dụng useCallback để cache hàm handleClick
  const handleClick = useCallback(
    (position, buildingId) => {
      onClick(position, buildingId);
    },
    [onClick]
  );

  return (
    <e.group theatreKey={`hotspot-${id}`} position={position}>
      <Billboard follow={true}>
        <Html
          className="relative w-fit h-fit"
          transform
          distanceFactor={1.5}
          occlude={""}
          center
        >
          <div
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
            style={{
              transformOrigin: "center",
            }}
            className={`
                  bg-red-primary  shadow-lg
                  flex justify-center items-center 
                  cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden h-16
                  ${
                    !hovered
                      ? "w-16 animate-resize-rotate rounded-lg"
                      : "animate-rotate-resize px-4 rounded-xl"
                  }
              
              `}
          >
            {hovered ? (
              <div className={`flex gap-4 items-center`}>
                <h3 className="text-lg text-white margin-0 font-semibold animate-fadeIn">
                  {data.name}
                </h3>
                {data?.buildingId && (
                  <button
                    onClick={() => {
                      handleClick(position, data.buildingId);
                    }}
                    className="bg-white cursor-pointer hover:scale-110 text-red-primary animate-fadeIn   rounded-full border-none flex justify-center items-center w-9 h-9 p-2"
                  >
                    <ArrowRightIcon />
                  </button>
                )}
              </div>
            ) : data?.buildingId ? (
              <div className="-rotate-45 animate-fadeIn1S text-white text-4xl font-medium flex justify-center items-center w-full h-full">
                +
              </div>
            ) : (
              <div className="-rotate-45 animate-fadeIn1S text-white text-4xl font-medium flex justify-center items-center w-full h-full">
                <FaInfo size={24} />
              </div>
            )}
          </div>

          <TbTriangleInvertedFilled
            size={12}
            className={`absolute animate-fadeIn1S -bottom-6 text-white shadow-lg  left-1/2 -translate-x-1/2`}
          />
        </Html>
      </Billboard>
    </e.group>
  );
});

Hotspot.displayName = "Hotspot";

export default Hotspot;
