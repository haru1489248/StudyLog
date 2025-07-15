import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { AUDIT } from '@/constants/audit'
import { Prisma, PrismaClient, User } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'warn', 'error'],
  })
}

declare const globalThis: {
  xprisma?: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.xprisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.xprisma = prisma
}

export default prisma

type Session = {
  user: User
}

export const requireAuth = async <T>({
  action,
}: {
  action: (session: Session) => Promise<T>
}): Promise<T> => {
  const authSession = await auth()

  if (!authSession) {
    throw new Error('User not found')
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: authSession!.user!.id,
    },
  })

  return await action({ user })
}

type CreateModelActionParams = {
  actionType: keyof typeof AUDIT.ACTION
  entity: keyof typeof AUDIT.ENTITY
  action: (
    session: Session,
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) => Promise<{
    entityId: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oldValue?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue?: any
    message?: string
  }>
  successMessage?: string
  revalidatePaths?: string[]
}

export type ModelFunctionReturn = {
  status: 'success' | 'error'
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export const modelAction = async ({
  actionType,
  entity,
  action,
  successMessage,
  revalidatePaths = [],
}: CreateModelActionParams): Promise<ModelFunctionReturn> => {
  try {
    const authSession = await auth()

    if (!authSession) {
      throw new Error('User not found')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {}

    await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findFirstOrThrow({
          where: {
            id: authSession!.user!.id,
          },
        })

        if (!user) {
          throw new Error('User not found')
        }

        const result = await action(
          {
            user,
          },
          tx,
        )
        const { entityId, oldValue, newValue, message } = result
        data['entityId'] = entityId
        data['oldValue'] = oldValue
        data['newValue'] = newValue
        data['message'] = message

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safeStringify = (obj: any) =>
          JSON.stringify(obj, (_, value) =>
            typeof value === 'bigint' ? Number(value) : value,
          )

        const oldValueStr = oldValue ? safeStringify({ ...oldValue }) : ''
        const newValueStr = newValue ? safeStringify({ ...newValue }) : ''
        if (oldValueStr === newValueStr) {
          return
        }

        await tx.auditLog.create({
          data: {
            action: AUDIT.ACTION[actionType],
            actorId: user.id,
            entity: AUDIT.ENTITY[entity],
            entityId: entityId,
            oldValue: oldValueStr,
            newValue: newValueStr,
          },
        })
      },
      {
        timeout: 20000,
        maxWait: 15000,
      },
    )

    revalidatePaths.forEach((path) => {
      revalidatePath(path)
    })

    return {
      status: 'success',
      message: successMessage || data.message || 'Action completed successfully',
      data: data,
    }
  } catch (error) {
    console.error('Action failed:', error)

    return {
      status: 'error',
      message: String(error),
      data: {},
    }
  }
}
