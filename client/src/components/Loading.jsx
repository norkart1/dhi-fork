import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500 text-lg font-semibold">Loading...</p>
    </div>
  );
}

export default Loading;
