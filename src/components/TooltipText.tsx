import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface TooltipTextProps {
  text?: string;
  maxLength?: number;
  className?: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const TooltipText: React.FC<TooltipTextProps> = ({
  text = "",
  maxLength = 20,
  className = "",
  placement = "top",
}) => {
  if (!text) return <span className={className}>-</span>;

  const shortText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <>
      <span
        className={className}
        data-tooltip-id={tooltipId}
        data-tooltip-content={text}
        style={{ cursor: text.length > maxLength ? "pointer" : "default" }}
      >
        {shortText}
      </span>
      {text.length > maxLength && <Tooltip id={tooltipId} place={placement} />}
    </>
  );
};

export default TooltipText;
