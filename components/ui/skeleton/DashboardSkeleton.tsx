import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative mx-4 mt-12">
        {/* Title skeleton */}
        <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-6 items-center justify-center"
            >
              {/* Icon circle */}
              <div className="p-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              </div>

              {/* Big number */}
              <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>

              {/* Label */}
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
