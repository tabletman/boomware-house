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
    <div className="relative flex min-h-screen flex-col bg-[#EAEDED] dark:bg-[#131A22]">
      <GPUStatsBanner />
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[1500px] mx-auto px-5 py-5">
          {children}
        </div>
      </main>
      <Footer />
      <CrispChat />
      <SocialProofNotifications />
    </div>
  )
}