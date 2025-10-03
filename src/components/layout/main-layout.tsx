import { Header } from './header'
import { Footer } from './footer'
import { GPUStatsBanner } from './gpu-stats-banner'
import { CrispChat } from '../chat/crisp-chat'
import { SocialProofNotifications } from '../ui/social-proof'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <GPUStatsBanner />
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <Footer />
      <CrispChat />
      <SocialProofNotifications />
    </div>
  )
}