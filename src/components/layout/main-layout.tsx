import { Header } from './header'
import { Footer } from './footer'
import { GPUStatsBanner } from './gpu-stats-banner'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GPUStatsBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}