import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

interface Props {
  lastUpdated: Date | null
}

export function DashboardLayout({ lastUpdated }: Props) {
  return (
    <div className="min-h-screen bg-[#0c0a14] text-[#e2e8f0] font-sans">
      <Header lastUpdated={lastUpdated} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
