import { User, UserRound } from 'lucide-react'

interface GenderIconProps {
  gender: 'M' | 'F'
  className?: string
}

export function GenderIcon({ gender, className = 'w-5 h-5' }: GenderIconProps) {
  if (gender === 'F') {
    return <UserRound className={`${className} text-defeat inline`} />
  }
  return <User className={`${className} text-primary inline`} />
}
