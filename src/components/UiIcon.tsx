interface IconProps {
  className?: string
}

export function MapIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function ListIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
}

export function RouteIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 5h10a4 4 0 0 1 0 8H7a3 3 0 0 0 0 6h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="5" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="19" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
}

export function RefreshIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M20 7v5h-5M4 17v-5h5M5.5 7a7.5 7.5 0 0 1 12-1L20 9M4 15l2.5 3a7.5 7.5 0 0 0 12-1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function GiftIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

interface HeartIconProps extends IconProps {
  filled?: boolean
}

const HEART_PATH = 'M12 21C10.67 19.78 4.15 15.2 2.5 11.25C.63 6.77 3.05 3 7.1 3c2.17 0 3.84 1.19 4.9 2.65C13.06 4.19 14.73 3 16.9 3c4.05 0 6.47 3.77 4.6 8.25C19.85 15.2 13.33 19.78 12 21Z'

export function PlusIcon({ className = '' }: IconProps) {
  return (
    <svg className={`ui-icon plus-icon ${className}`.trim()} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" data-icon="plus">
      <path d="M12 5V19M5 12H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function HeartIcon({ filled = false, className = '' }: HeartIconProps) {
  return (
    <svg className={`ui-icon favorite-icon ${className}`.trim()} viewBox="0 0 24 24" width="22" height="20" aria-hidden="true" focusable="false" data-icon="heart">
      <path
        d={HEART_PATH}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
