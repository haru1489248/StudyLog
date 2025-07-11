'use client'

export const GlobalLoadingContainer = () => {
  return (
    <div
      className='fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-900 opacity-75 hidden'
      id='globalLoadingContainer'
      suppressHydrationWarning={true}
    >
      <div
        className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white'
        suppressHydrationWarning={true}
      ></div>
    </div>
  )
}

export const globalLoading = {
  show: () => toggleGlobalLoading(true),
  hide: () => toggleGlobalLoading(false),
}

function toggleGlobalLoading(show: boolean) {
  const loadingContainer = document.getElementById('globalLoadingContainer')
  if (loadingContainer) {
    if (show) {
      loadingContainer.classList.remove('hidden')
      loadingContainer.classList.add('visible')
    } else {
      setTimeout(() => {
        if (loadingContainer) {
          loadingContainer.classList.remove('visible')
          loadingContainer.classList.add('hidden')
        }
      }, 500)
    }
  }
}
