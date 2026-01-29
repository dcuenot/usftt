import { useMemo } from 'react'
import { useCsvData } from './useCsvData'
import { Player } from '@/types/player.types'
import { CSV_PATHS } from '@/constants/config'
import { round } from '@/utils/formatting'

export function usePlayerData() {
  const { data: rawData, loading, error } = useCsvData<any>(CSV_PATHS.LICENSES)

  const players: Player[] = useMemo(() => {
    return rawData.map((row) => ({
      licence: row.licence || '',
      prenom: row.prenom || '',
      nom: row.nom || '',
      categ: row.categ || '',
      point: round(row.point),
      aclglob: round(row.aclglob),
      apoint: round(row.apoint),
      valcla: round(row.valcla),
      valinit: round(row.valinit),
      progressionMensuelle: round(row.point - row.apoint),
      progressionPhase: round(row.point - row.valinit),
    }))
  }, [rawData])

  return { players, loading, error }
}
