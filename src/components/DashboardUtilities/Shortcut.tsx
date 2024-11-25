import React from "react";

interface ShortcutProps {
  name: string;
  icon: string;
}

export default function Shortcut({ name, icon }: ShortcutProps) {
  return (
    <div
      className={`w-20 h-20 flex flex-col items-center justify-center rounded-xl  shadow-lg bg-slate-100 hover:scale-105`}
    >
      {/* Ícono */}
      <div className="w-16 h-16 flex items-center justify-center mb-2">
        <img
          className="max-w-full max-h-full object-contain"
          src={icon}
          alt={name}
        />
      </div>

      {/* Nombre */}
    </div>
  );
}