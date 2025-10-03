// src/components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  let base =
    "font-extrabold uppercase px-6 py-3 md:py-4 text-lg md:text-xl transition-all w-full md:w-auto cursor-pointer";
  let style = "";

  switch (variant) {
    case "primary":
      style =
        "bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0_#000] " +
        "active:shadow-none active:translate-x-1 active:translate-y-1 active:bg-black active:text-yellow-400";
      break;
    case "secondary":
      style =
        "bg-orange-600 text-white border-4 border-black shadow-[4px_4px_0_#000] " +
        "active:shadow-none active:translate-x-1 active:translate-y-1 active:bg-black active:text-orange-600";
      break;
    case "outline":
      style =
        "bg-transparent text-black border-4 border-black shadow-[4px_4px_0_#000] " +
        "active:shadow-none active:translate-x-1 active:translate-y-1 active:bg-black active:text-yellow-400";
      break;
    case "white":
      style =
        "bg-white text-black border-4 border-black shadow-[4px_4px_0_#000] " +
        "active:shadow-none active:translate-x-1 active:translate-y-1 active:bg-black active:text-white";
      break;
  }

  return (
    <button className={`${base} ${style} ${className}`} {...props} />
  );
}
