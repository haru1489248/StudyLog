'use server'

import prisma, { requireAuth } from '@/framework/xprisma'
import { Goal } from '@prisma/client'

export type FetchGoalsParams = {
  userId: string
}

export type FetchGoalsResponse = {
  goals: Goal[]
}

export const fetchGoals = async ({ userId }: FetchGoalsParams) => {
  return await requireAuth({
    action: async () => {
      const goals = await prisma.goal.findMany({
        where: {
          userId,
        },
      })

      return goals
    },
  })
}

export type CreateGoalParams = {
  title: string
  description: string
  planStartDate: Date
  planEndDate: Date
  userId: string
}
