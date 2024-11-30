import React from "react";

type LoadingProps = {
  loading: boolean;
  message?: string;
};

export default function Loading({ loading, message = "Loading..." }: LoadingProps) {
  if (!loading) return null; // No renderizar si no está cargando

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-white border-opacity-50 rounded-full animate-spin mx-auto"></div>
        <p className="text-white mt-4 text-lg">{message}</p>
      </div>
    </div>
  );
}
