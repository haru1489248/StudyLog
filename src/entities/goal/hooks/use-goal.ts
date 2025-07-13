import { useQuery } from '@tanstack/react-query'

import { FetchGoalsParams } from '../actions/goal.actions'
import { fetchGoals } from '../actions/goal.actions'

export const useGoals = ({
  params,
  enabled,
}: {
  params: FetchGoalsParams
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => fetchGoals(params),
    enabled,
    staleTime: 1000 * 60,
  })
}
