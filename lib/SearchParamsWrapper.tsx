// lib/SearchParamsWrapper.tsx - Global wrapper for useSearchParams
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, ReactNode } from 'react'

interface SearchParamsWrapperProps {
  children: (searchParams: URLSearchParams) => ReactNode
  fallback?: ReactNode
}

function SearchParamsContent({ children }: { children: (searchParams: URLSearchParams) => ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

export default function SearchParamsWrapper({ children, fallback }: SearchParamsWrapperProps) {
  const defaultFallback = (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  )
}

// Usage example:
// export default function MyPage() {
//   return (
//     <SearchParamsWrapper>
//       {(searchParams) => (
//         <div>
//           <h1>Error: {searchParams.get('error')}</h1>
//         </div>
//       )}
//     </SearchParamsWrapper>
//   )
// }
