import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createGoal, CreateGoalParams } from '../actions/goal.actions'
import { fetchGoals } from '../actions/goal.actions'
import { toast } from 'react-toastify'

export const useFetchGoals = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchGoals(),
    enabled,
    staleTime: 1000 * 60,
  })
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateGoalParams) => createGoal(params),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      if (res.status === 'success') {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    },
    onError: () => {
      toast.error('目標の作成に失敗しました')
    },
  })
}
