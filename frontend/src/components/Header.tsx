import { Link, useLocation } from 'react-router-dom'

interface Props {
  lastUpdated: Date | null
}

export function Header({ lastUpdated }: Props) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/map', label: 'Map' },
    { path: '/backtests', label: 'Backtests' },
    { path: '/developers', label: 'Developers' },
    { path: '/portal', label: 'API Portal' },
  ]

  const secondsAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
    : null

  return (
    <header className="border-b border-white/[0.06] bg-[#0c0a14]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <svg width="18" height="26" viewBox="0 0 30 44" fill="none" className="overflow-visible">
              <line x1="3" y1="2" x2="9" y2="42" stroke="rgba(108,92,231,0.3)" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="13" y1="2" x2="19" y2="42" stroke="rgba(108,92,231,0.6)" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="23" y1="2" x2="29" y2="42" stroke="#6c5ce7" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-bold tracking-[-0.04em] text-white">katabatic</span>
          </Link>
          <nav className="flex gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#6c5ce7]/15 text-[#a29bfe]'
                    : 'text-[#888] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00b894] animate-pulse" />
          <span>
            {secondsAgo !== null ? `Updated ${secondsAgo}s ago` : 'Connecting...'}
          </span>
        </div>
      </div>
    </header>
  )
}
