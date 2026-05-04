import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { EmptyState } from '@/components/empty-state'
import { DownloadSimpleIcon } from '@/components/icons'
import { Input } from '@/components/input'
import { LinkListItem } from '@/components/link-list-item'
import { LoadingIndicator } from '@/components/loading-indicator'
import { Logo } from '@/components/logo'
import { Toast, type ToastMessage } from '@/components/toast'
import { TopLoadingBar } from '@/components/top-loading-bar'
import { getFrontendUrl } from '@/services/env'
import {
  ApiError,
  createLink,
  deleteLink,
  exportLinksCsv,
  getLinks,
  incrementLinkAccesses,
} from '@/services/links'
import type { Link } from '@/types/link'
import {
  isValidShortUrl,
  isValidUrl,
  normalizeOriginalUrl,
  normalizeShortUrl,
} from '@/utils/links'

type FieldErrors = {
  originalUrl?: string
  shortUrl?: string
}

const TOAST_TIMEOUT_MS = 4000

function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function HomePage() {
  const [links, setLinks] = useState<Link[]>([])
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [isLoadingLinks, setIsLoadingLinks] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const [incrementingLinkId, setIncrementingLinkId] = useState<string | null>(
    null,
  )

  const frontendUrl = getFrontendUrl()

  const showToast = useCallback((toastInput: Omit<ToastMessage, 'id'>) => {
    setToast({ ...toastInput, id: Date.now() })
  }, [])

  function replaceLink(updatedLink: Link) {
    setLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === updatedLink.id ? updatedLink : link,
      ),
    )
  }

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, TOAST_TIMEOUT_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast])

  useEffect(() => {
    async function loadLinks() {
      try {
        const data = await getLinks()
        setLinks(data)
      } catch (error) {
        showToast({
          title: 'Não foi possível carregar seus links',
          description: getApiErrorMessage(
            error,
            'Tente novamente em instantes.',
          ),
          variant: 'error',
        })
      } finally {
        setIsLoadingLinks(false)
      }
    }

    loadLinks()
  }, [showToast])

  async function handleCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedOriginalUrl = normalizeOriginalUrl(originalUrl)
    const normalizedShortUrl = normalizeShortUrl(shortUrl)
    const nextErrors: FieldErrors = {}

    if (!isValidUrl(normalizedOriginalUrl)) {
      nextErrors.originalUrl = 'Informe uma URL válida.'
    }

    if (!isValidShortUrl(normalizedShortUrl)) {
      nextErrors.shortUrl = 'Informe uma URL encurtada válida.'
    }

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsCreating(true)

    try {
      const link = await createLink({
        originalUrl: normalizedOriginalUrl,
        shortUrl: normalizedShortUrl,
      })

      setLinks((currentLinks) => [link, ...currentLinks])
      setOriginalUrl('')
      setShortUrl('')
      setFieldErrors({})
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 409) {
          setFieldErrors({ shortUrl: error.message })
        }

        showToast({
          title: 'Não foi possível criar o link',
          description: error.message,
          variant: 'error',
        })
      } else {
        showToast({
          title: 'Não foi possível criar o link',
          description: 'Tente novamente em instantes.',
          variant: 'error',
        })
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteLink(link: Link) {
    const confirmed = window.confirm(
      `Você realmente quer apagar o link ${link.shortUrl}?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingLinkId(link.id)

    try {
      await deleteLink(link.id)
      setLinks((currentLinks) =>
        currentLinks.filter((currentLink) => currentLink.id !== link.id),
      )
    } catch (error) {
      showToast({
        title: 'Não foi possível remover o link',
        description: getApiErrorMessage(error, 'Tente novamente em instantes.'),
        variant: 'error',
      })
    } finally {
      setDeletingLinkId(null)
    }
  }

  async function handleDownloadCsv() {
    setIsDownloading(true)

    try {
      const reportUrl = await exportLinksCsv()
      const anchor = document.createElement('a')
      anchor.href = reportUrl
      anchor.target = '_blank'
      anchor.rel = 'noreferrer'
      anchor.download = 'links.csv'
      anchor.click()
    } catch (error) {
      showToast({
        title: 'Não foi possível baixar o CSV',
        description: getApiErrorMessage(error, 'Tente novamente em instantes.'),
        variant: 'error',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  async function handleOpenLink(link: Link) {
    setIncrementingLinkId(link.id)

    try {
      const updatedLink = await incrementLinkAccesses(link.id)
      replaceLink(updatedLink)
    } catch (error) {
      showToast({
        title: 'Não foi possível abrir o link',
        description: getApiErrorMessage(error, 'Tente novamente em instantes.'),
        variant: 'error',
      })
    } finally {
      setIncrementingLinkId(null)
    }
  }

  async function handleCopyLink(link: Link, shortLink: string) {
    setIncrementingLinkId(link.id)

    try {
      await navigator.clipboard.writeText(shortLink)
      const updatedLink = await incrementLinkAccesses(link.id)
      replaceLink(updatedLink)
      showToast({
        title: 'Link copiado',
        description: `O link ${link.shortUrl} foi copiado para a área de transferência.`,
        variant: 'success',
      })
    } catch (error) {
      showToast({
        title: 'Não foi possível copiar o link',
        description: getApiErrorMessage(error, 'Tente novamente em instantes.'),
        variant: 'error',
      })
    } finally {
      setIncrementingLinkId(null)
    }
  }

  const isBusy =
    isCreating ||
    isDownloading ||
    deletingLinkId !== null ||
    incrementingLinkId !== null
  const isLinksCardLoading = isLoadingLinks || isBusy

  return (
    <main className="min-h-screen bg-gray-200 px-3 py-8 text-gray-600 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6">
        <Logo className="mx-auto h-6 w-[96.67px] lg:mx-0" />

        <section className="grid items-start gap-3 lg:grid-cols-[380px_1fr] lg:gap-5">
          <form
            className="self-start rounded-xl bg-white p-6 sm:p-8"
            onSubmit={handleCreateLink}
          >
            <h1 className="text-xl font-bold">Novo link</h1>

            <div className="mt-6 flex flex-col gap-4">
              <Input
                disabled={isCreating}
                error={fieldErrors.originalUrl}
                label="LINK ORIGINAL"
                onChange={(event) => setOriginalUrl(event.target.value)}
                placeholder="www.exemplo.com.br"
                value={originalUrl}
              />
              <Input
                disabled={isCreating}
                error={fieldErrors.shortUrl}
                label="LINK ENCURTADO"
                onChange={(event) => setShortUrl(event.target.value)}
                prefix="brev.ly/"
                value={shortUrl}
              />
              <Button disabled={isCreating} type="submit">
                {isCreating ? 'Salvando...' : 'Salvar Link'}
              </Button>
            </div>
          </form>

          <section className="relative overflow-hidden rounded-xl bg-white p-6 sm:p-8">
            <TopLoadingBar active={isLinksCardLoading} />

            <div className="flex items-center justify-between gap-4 pb-4">
              <h2 className="text-lg font-bold">Meus links</h2>
              <Button
                className="w-auto"
                disabled={isDownloading || isLoadingLinks || links.length === 0}
                icon={<DownloadSimpleIcon />}
                onClick={handleDownloadCsv}
                variant="secondary"
              >
                {isDownloading ? 'Baixando...' : 'Baixar CSV'}
              </Button>
            </div>

            {isLoadingLinks ? (
              <div className="flex min-h-[118px] items-center justify-center border-gray-200 border-t">
                <LoadingIndicator />
              </div>
            ) : links.length === 0 ? (
              <EmptyState />
            ) : (
              <ul
                aria-busy={isLinksCardLoading}
                className="links-scroll-area flex max-h-[355px] flex-col overflow-y-auto pr-1 sm:max-h-[639px]"
              >
                {links.map((link) => (
                  <LinkListItem
                    frontendUrl={frontendUrl}
                    isDeleting={deletingLinkId === link.id}
                    isIncrementing={incrementingLinkId === link.id}
                    key={link.id}
                    link={link}
                    onCopy={handleCopyLink}
                    onDelete={handleDeleteLink}
                    onOpen={handleOpenLink}
                  />
                ))}
              </ul>
            )}
          </section>
        </section>
      </div>
      <Toast toast={toast} />
    </main>
  )
}
