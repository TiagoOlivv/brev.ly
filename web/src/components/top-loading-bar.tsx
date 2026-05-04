type TopLoadingBarProps = {
  active: boolean
}

export function TopLoadingBar({ active }: TopLoadingBarProps) {
  if (!active) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 right-0 left-0 h-1 overflow-hidden rounded-t-xl bg-blue-base/15"
    >
      <div className="top-loading-bar h-full w-1/2 bg-blue-base" />
    </div>
  )
}
