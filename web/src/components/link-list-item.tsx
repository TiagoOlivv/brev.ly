import { IconButton } from '@/components/icon-button'
import { CopyIcon, LinkIcon, TrashIcon } from '@/components/icons'
import type { Link } from '@/types/link'
import { formatAccessCount, formatShortUrl } from '@/utils/links'

type LinkListItemProps = {
  frontendUrl: string
  isDeleting: boolean
  isIncrementing: boolean
  link: Link
  onCopy: (link: Link, shortLink: string) => void
  onDelete: (link: Link) => void
  onOpen: (link: Link) => void
}

export function LinkListItem({
  frontendUrl,
  isDeleting,
  isIncrementing,
  link,
  onCopy,
  onDelete,
  onOpen,
}: LinkListItemProps) {
  const shortLink = formatShortUrl(frontendUrl, link.shortUrl)

  return (
    <li className="flex items-center gap-3 border-gray-200 border-t py-3">
      <LinkIcon className="hidden size-5 shrink-0 text-blue-base sm:block" />

      <div className="min-w-0 flex-1">
        <a
          className="block truncate text-md font-semibold text-blue-base"
          href={link.originalUrl}
          onClick={() => onOpen(link)}
          rel="noreferrer noopener"
          target="_blank"
        >
          {shortLink.replace(/^https?:\/\//, '')}
        </a>
        <p className="truncate text-sm text-gray-500">{link.originalUrl}</p>
      </div>

      <p className="hidden min-w-20 text-right text-sm text-gray-500 sm:block">
        {formatAccessCount(link.accessCount)}
      </p>

      <IconButton
        aria-label="Copiar link"
        disabled={isDeleting || isIncrementing}
        onClick={() => onCopy(link, shortLink)}
      >
        <CopyIcon />
      </IconButton>

      <IconButton
        aria-label="Remover link"
        disabled={isDeleting || isIncrementing}
        onClick={() => onDelete(link)}
      >
        <TrashIcon />
      </IconButton>
    </li>
  )
}
