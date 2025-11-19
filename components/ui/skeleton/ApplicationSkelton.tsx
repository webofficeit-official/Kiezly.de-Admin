export default function ApplicantsSkeleton() {
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="shadow-lg border-gray-100 bg-white rounded-xl overflow-hidden animate-pulse">
        
        {/* Header */}
        <div className="border-b border-gray-100 p-4 sm:p-5">
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-gray-200 p-4 bg-white min-h-[160px]"
              >
                {/* Title + Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full ml-2" />
                </div>

                {/* Rate */}
                <div className="h-4 w-28 bg-gray-200 rounded mb-3" />

                {/* Cover Note */}
                <div className="space-y-2 mb-3">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>

                {/* Footer */}
                <div className="h-3 w-20 bg-gray-200 rounded mt-auto" />
              </div>
            ))}

          </div>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <div className="h-8 w-40 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </aside>
  );
}
