import { Match } from '@/types/team.types'

interface MatchResultCellProps {
  match: Match | undefined
}

export function MatchResultCell({ match }: MatchResultCellProps) {
  // Handle empty/undefined match
  if (!match) {
    return <span className="text-gray-400">-</span>
  }

  // Extract match data
  const {
    is_home,
    equipe_domicile,
    equipe_exterieur,
    score_domicile,
    score_exterieur,
  } = match

  // Determine opponent name
  const opponent = is_home === 'True' ? equipe_exterieur : equipe_domicile

  // Handle future matches (no score yet)
  if (!score_domicile || !score_exterieur) {
    return (
      <div className="text-sm">
        <div className="text-gray-700">{opponent}</div>
        <div className="text-gray-400 text-xs">
          {is_home === 'True' ? 'Dom.' : 'Ext.'}
        </div>
      </div>
    )
  }

  // Parse scores
  const homeScore = parseInt(score_domicile)
  const awayScore = parseInt(score_exterieur)

  // Determine result from our team's perspective
  let result: 'victory' | 'defeat' | 'draw'
  let ourScore: number
  let theirScore: number

  if (is_home === 'True') {
    ourScore = homeScore
    theirScore = awayScore
  } else {
    ourScore = awayScore
    theirScore = homeScore
  }

  if (ourScore > theirScore) {
    result = 'victory'
  } else if (ourScore < theirScore) {
    result = 'defeat'
  } else {
    result = 'draw'
  }

  // Determine color class
  const colorClass =
    result === 'victory'
      ? 'text-victory'
      : result === 'defeat'
      ? 'text-defeat'
      : 'text-draw'

  // Determine background color for the cell
  const bgClass =
    result === 'victory'
      ? 'bg-green-50'
      : result === 'defeat'
      ? 'bg-red-50'
      : 'bg-gray-50'

  return (
    <div className={`text-sm p-2 rounded ${bgClass}`}>
      <div className="text-gray-700">{opponent}</div>
      <div className={`font-medium ${colorClass}`}>
        {ourScore} - {theirScore}
      </div>
      <div className="text-gray-500 text-xs">
        {is_home === 'True' ? 'Dom.' : 'Ext.'}
      </div>
    </div>
  )
}
