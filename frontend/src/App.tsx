import { Routes, Route } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      <header className="border-b border-black/6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-accent">katabatic</span>
            <span className="text-text-secondary font-normal ml-2 text-sm">dashboard</span>
          </h1>
          <span className="text-xs text-text-tertiary bg-accent/8 text-accent px-3 py-1 rounded-full font-medium">
            Demo Mode
          </span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-text-secondary">
          Stress score dashboard will be built during the hackathon.
        </p>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  )
}
