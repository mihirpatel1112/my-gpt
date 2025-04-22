import React from "react";

export default function Loader() {
  return (
    <div>
      <div className="w-full gap-x-2 flex">
        <div className="w-2 bg-indigo-300 animate-pulse h-2 rounded-full animate-bounce"></div>
        <div className="w-2 animate-pulse h-2 bg-indigo-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 animate-pulse bg-indigo-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
