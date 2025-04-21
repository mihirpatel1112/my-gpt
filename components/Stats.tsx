import React from "react";

export default function Stats(props: any) {
    const {label ,value} = props;
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-indigo-200 px-2 py-0.5 font-medium text-slate-600">
          {label}
        </span>
        <span className="tabular-nums">{value}</span>
      </div>
    </div>
  );
}
