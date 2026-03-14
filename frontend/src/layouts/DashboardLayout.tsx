import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

interface Props {
  lastUpdated: Date | null
}

export function DashboardLayout({ lastUpdated }: Props) {
  return (
    <div className="min-h-screen bg-[#0c0a14] text-[#e2e8f0] font-sans relative">
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(108,92,231,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,231,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <Header lastUpdated={lastUpdated} />
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
