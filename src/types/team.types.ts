export interface Match {
  team_id: string
  team_name: string
  division: string
  tour: string
  date: string
  equipe_domicile: string
  equipe_exterieur: string
  score_domicile: string
  score_exterieur: string
  is_home: 'True' | 'False'
}

export interface Team {
  id: string
  name: string
  division: string
  gender: 'G' | 'F'
  matches: Record<string, Match>
}

export interface TeamFilters {
  gender: 'all' | 'G' | 'F'
}
