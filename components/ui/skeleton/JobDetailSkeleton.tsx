import React from "react";


export default function JobDetailSkeleton() {
  return (
    <div className="animate-pulse px-6">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left main content (spans 7/12 on large screens) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {/* Title */}
            <div className="mb-4">
              <div className="h-[40px] w-3/4 bg-gray-200 rounded-md mb-3" />
              <div className="h-4 w-1/3 bg-gray-200 rounded-sm" />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500 mb-4">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-36 bg-gray-200 rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <div className="h-7 w-24 bg-gray-200 rounded-full" />
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-7 w-20 bg-gray-200 rounded-full" />
            </div>

            <div className="border-t border-gray-100 mt-4 pt-6 space-y-6">
              {/* Section: About the Role */}
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>

              {/* Section: Requirements */}
              <div>
                <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/5 bg-gray-200 rounded" />
              </div>

              {/* Section: Tasks */}
              <div>
                <div className="h-5 w-28 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-2/5 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle column (company/contact) - spans 3/12 */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
                <div className="h-36 w-full bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 w-36 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Right column (job counts) - spans 2/12 */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* section title */}
            <div className="h-6 w-28 bg-gray-200 rounded mb-2" />

            {/* grid of 4 metric cards */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 mb-3" />
                  <div className="text-2xl font-bold">
                    <div className="h-6 w-8 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
