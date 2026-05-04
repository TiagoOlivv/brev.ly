import { LinkIcon } from '@/components/icons'

export function EmptyState() {
  return (
    <div className="flex min-h-[118px] flex-col items-center justify-center gap-3 border-gray-200 border-t text-center">
      <LinkIcon className="size-8 text-gray-400" />
      <p className="text-xs uppercase text-gray-500">
        Ainda não existem links cadastrados
      </p>
    </div>
  )
}
