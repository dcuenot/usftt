export interface Competitor {
  idlicence: string
  licence: string
  sexe: 'M' | 'F'
  cat: string
  prenom: string
  nom: string
  initm: number
  parties: number
  point: number
  prg_a: number  // progression annuelle
  prg_m: number  // progression mensuelle
  prg_p: number  // progression phase
  [key: string]: string | number  // Dynamic monthly columns: pts_2508, pts_2509, etc.
}

export interface CompetitorFilters {
  gender: '' | 'M' | 'F'
  category: string
  showInactive: boolean
}
