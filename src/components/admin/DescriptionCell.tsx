import { useState } from "react";
interface DescriptionCellProps {
  description: string;
}

export default function DescriptionCell({ description }: DescriptionCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const truncateDescription = (
    text: string,
    maxLength: number = 25
  ): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  const displayShortText = truncateDescription(description);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm text-gray-500">{displayShortText}</span>

      {/* 👈 Tooltip يظهر عند التحويم */}
      {isHovered && description.length > 25 && (
        <span className="absolute z-50 top-full right-0 mt-2 p-3 w-64 bg-gray-800 text-white text-sm rounded-lg shadow-xl whitespace-normal text-right">
          {description}
        </span>
      )}
    </div>
  );
}
