'use server'

import prisma, { modelAction, requireAuth } from '@/framework/xprisma'
import { Goal } from '@prisma/client'

export type FetchGoalsResponse = {
  goals: Goal[]
}

export const fetchGoals = async () => {
  return await requireAuth({
    action: async (session) => {
      const goals = await prisma.goal.findMany({
        where: {
          userId: session.user.id,
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

export const createGoal = async (params: CreateGoalParams) => {
  return await modelAction({
    actionType: 'CREATE',
    entity: 'GOAL',
    successMessage: '目標を作成しました',
    action: async (session, tx) => {
      const goal = await tx.goal.create({
        data: {
          title: params.title,
          description: params.description,
          planStartDate: params.planStartDate,
          planEndDate: params.planEndDate,
          userId: session.user.id,
        },
      })

      return {
        entityId: goal.id,
        message: '目標を作成しました。',
      }
    },
  })
}
