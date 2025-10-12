"use client";

import Decimal from "decimal.js";

interface AsciiDiffProps {
  label: string;
  valueBefore: number;
  valueAfter: number;
  unit: string;
  variant: "yellow" | "orange";
}

export function AsciiDiff({
  label,
  valueBefore,
  valueAfter,
  unit,
  variant,
}: AsciiDiffProps) {
  const before = new Decimal(valueBefore);
  const after = new Decimal(valueAfter);
  const change = after.sub(before);

  const format = (num: Decimal) => num.toFixed(2);
  const changeStr = (num: Decimal) => {
    const formatted = num.abs().toFixed(2);
    return num.isPositive() ? `+${formatted}` : `-${formatted}`;
  };

  const textColor = variant === "orange" ? "text-white/90" : "text-black/85";
  const highlightColor = variant === "orange" ? "text-white" : "text-black";
  
  const ChangeSpan = () => {
    if (change.isZero()) return null;
    const isPositive = change.isPositive();
    return (
        <span className={`ml-2 inline-block ${isPositive ? 'text-green-500' : 'text-red-500'} bg-black px-1`}>
            ({changeStr(change)})
        </span>
    );
  };

  return (
    <div className={`font-mono text-sm md:text-base leading-relaxed ${textColor}`}>
      {/* Before Line */}
      <div className={`flex justify-between ${highlightColor}`}>
        <span>{label}</span>
        <span>{format(before)} {unit}</span>
      </div>

      {/* After Line (only if there's a change) */}
      {!change.isZero() && (
        <div className={`flex justify-between ${highlightColor}`}>
          <span className="opacity-0">{label}</span> 
          <div className="flex items-center">
            <span>
              &rarr; {format(after)} {unit}
            </span>
            <ChangeSpan />
          </div>
        </div>
      )}
    </div>
  );
}