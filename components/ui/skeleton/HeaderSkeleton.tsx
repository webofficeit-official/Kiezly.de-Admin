import React from "react";

export default function HeaderSkeleton() {
  return (
    <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          {/* title skeleton */}
          <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
  

          {/* button placeholder */}
          <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
