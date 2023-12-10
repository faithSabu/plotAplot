import React, { useState } from "react";

const Tooltip = ({ text, children, customStyle = "-left-1/2" }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {children}
      </div>
      {isTooltipVisible && (
        <div
          className={
            "truncate absolute bg-gray-800 text-white px-2 py-1 rounded-md text-xs bottom-full transform translate-y-14 " +
            customStyle
          }
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
