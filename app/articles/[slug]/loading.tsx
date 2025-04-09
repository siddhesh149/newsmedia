export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button skeleton */}
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero image skeleton */}
          <div className="relative w-full h-[500px] bg-gray-200 animate-pulse"></div>

          {/* Content skeleton */}
          <div className="p-8">
            <div className="space-y-4">
              {/* Title skeleton */}
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              
              {/* Meta info skeleton */}
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Content paragraphs skeleton */}
              <div className="space-y-4 mt-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>

              {/* Tags skeleton */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 