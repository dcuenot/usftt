import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the install prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000) // Show after 3 seconds
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)

    // Clear the prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already dismissed or if no prompt available
  if (!showPrompt || !deferredPrompt) return null

  // Check if already dismissed in this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) return null

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-md',
        'z-50 animate-slideInFromRight'
      )}
    >
      <div className="card-elevated p-4 bg-white">
        <button
          onClick={handleDismiss}
          className={cn(
            'absolute top-2 right-2',
            'text-gray-400 hover:text-gray-600',
            'transition-colors'
          )}
          aria-label="Fermer"
        >
          <X className="icon-sm" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
            <Download className="icon-base text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Installer USFTT
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Installez l'application sur votre écran d'accueil pour un accès rapide et une meilleure expérience.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg',
                  'bg-primary text-white text-sm font-medium',
                  'hover:bg-primary-600',
                  'transition-colors'
                )}
              >
                Installer
              </button>
              <button
                onClick={handleDismiss}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'border border-gray-300 text-gray-700 text-sm font-medium',
                  'hover:bg-gray-50',
                  'transition-colors'
                )}
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
