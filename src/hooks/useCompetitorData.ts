import { useMemo } from 'react'
import { useCsvData } from './useCsvData'
import { Competitor } from '@/types/competitor.types'
import { CSV_PATHS } from '@/constants/config'

export function useCompetitorData() {
  const { data: rawData, loading, error } = useCsvData<any>(CSV_PATHS.COMPETITORS)

  const competitors: Competitor[] = useMemo(() => {
    return rawData.map((row) => ({
      idlicence: row.idlicence || '',
      licence: row.licence || '',
      sexe: row.sexe || 'M',
      cat: row.cat || '',
      prenom: row.prenom || '',
      nom: row.nom || '',
      initm: parseFloat(row.initm) || 0,
      parties: parseInt(row.parties) || 0,
      point: parseFloat(row.point) || 0,
      prg_a: parseFloat(row.prg_a) || 0,
      prg_m: parseFloat(row.prg_m) || 0,
      prg_p: parseFloat(row.prg_p) || 0,
      ...row, // Include dynamic monthly columns (pts_2508, etc.)
    }))
  }, [rawData])

  return { competitors, loading, error }
}
