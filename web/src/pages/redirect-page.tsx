import { useEffect, useRef, useState } from 'react'
import { LogoIcon } from '@/components/logo-icon'
import { getLinkByShortUrl, incrementLinkAccesses } from '@/services/links'
import { NotFoundPage } from './not-found-page'

type RedirectPageProps = {
  shortUrl: string
}

type RedirectStatus = 'loading' | 'not-found'
type RedirectResult = 'redirected' | 'not-found'

export function RedirectPage({ shortUrl }: RedirectPageProps) {
  const [status, setStatus] = useState<RedirectStatus>('loading')
  const redirectRequests = useRef(new Map<string, Promise<RedirectResult>>())

  useEffect(() => {
    let isMounted = true

    async function redirect() {
      let redirectRequest = redirectRequests.current.get(shortUrl)

      if (!redirectRequest) {
        redirectRequest = (async () => {
          try {
            const link = await getLinkByShortUrl(shortUrl)
            await incrementLinkAccesses(link.id)
            window.location.replace(link.originalUrl)

            return 'redirected'
          } catch {
            return 'not-found'
          }
        })()

        redirectRequests.current.set(shortUrl, redirectRequest)
      }

      const result = await redirectRequest

      if (result === 'not-found') {
        if (isMounted) {
          setStatus('not-found')
        }
      }
    }

    redirect()

    return () => {
      isMounted = false
    }
  }, [shortUrl])

  if (status === 'not-found') {
    return <NotFoundPage />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8 text-gray-600">
      <section className="flex min-h-[288px] w-full max-w-[580px] flex-col items-center justify-center gap-6 rounded-xl bg-white px-8 py-12 text-center sm:min-h-[284px]">
        <LogoIcon alt="" aria-hidden="true" className="size-14" />

        <div className="flex max-w-[484px] flex-col items-center gap-3 text-center">
          <h1 className="text-xl font-bold">Redirecionando...</h1>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-md text-gray-500">
              O link será aberto automaticamente em alguns instantes.
            </p>

            <p className="text-md text-gray-500">
              Não foi redirecionado?{' '}
              <a className="font-semibold text-blue-base underline" href="/">
                Acesse aqui
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
