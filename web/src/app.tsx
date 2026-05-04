import { useEffect, useState } from 'react'
import { HomePage } from '@/pages/home-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { RedirectPage } from '@/pages/redirect-page'

function getCurrentPath() {
  return window.location.pathname
}

export function App() {
  const [path, setPath] = useState(getCurrentPath)

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) {
    return <HomePage />
  }

  if (segments.length === 1) {
    return <RedirectPage shortUrl={decodeURIComponent(segments[0])} />
  }

  return <NotFoundPage />
}
