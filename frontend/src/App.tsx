import { useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { usePolling } from './hooks/usePolling'
import { fetchStressScores } from './lib/api'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { MapPage } from './pages/MapPage'
import { DeveloperPortalPage } from './pages/DeveloperPortalPage'
import { ApiOnboardingPage } from './pages/ApiOnboardingPage'
import { BacktestListPage } from './pages/BacktestListPage'
import { BacktestDetailPage } from './pages/BacktestDetailPage'
import { StressScoreDetail } from './components/StressScoreDetail'
import { LandingPage } from './pages/LandingPage'
import { ScrollToTop } from './components/ScrollToTop'
import type { StressScore } from './lib/types'

export default function App() {
  const fetcher = useCallback(() => fetchStressScores(), [])
  const { data: scores, loading, lastUpdated } = usePolling<StressScore[]>(fetcher, 60000)

  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public landing page — outside dashboard layout */}
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard app */}
      <Route element={<DashboardLayout lastUpdated={lastUpdated} />}>
        <Route path="/dashboard" element={<DashboardPage scores={scores} loading={loading} />} />
        <Route path="/stablecoin/:symbol" element={<StressScoreDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/backtests" element={<BacktestListPage />} />
        <Route path="/backtests/:name" element={<BacktestDetailPage />} />
        <Route path="/developers" element={<DeveloperPortalPage />} />
        <Route path="/portal" element={<ApiOnboardingPage />} />
      </Route>
      </Routes>
    </>
  )
}

