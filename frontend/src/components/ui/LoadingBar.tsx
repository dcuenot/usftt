import { cn } from '@/utils/cn'

interface LoadingBarProps {
  loading?: boolean
}

export function LoadingBar({ loading = true }: LoadingBarProps) {
  if (!loading) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary-100"
      data-testid="loading-bar"
    >
      <div
        className={cn(
          'h-full bg-primary',
          'animate-[loading_1.5s_ease-in-out_infinite]'
        )}
        style={{
          width: '30%',
          animation: 'loading 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(250%);
          }
          100% {
            transform: translateX(600%);
          }
        }
      `}</style>
    </div>
  )
}
