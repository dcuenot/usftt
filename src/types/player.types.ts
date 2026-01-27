export interface Player {
  licence: string
  prenom: string
  nom: string
  categ: string
  point: number
  aclglob: number
  apoint: number
  valcla: number
  valinit: number
  progressionMensuelle: number  // calculated: point - apoint
  progressionPhase: number      // calculated: point - valinit
}

export interface PlayerFilters {
  category: string
  searchTerm: string
}
