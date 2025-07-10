import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  xprisma?: PrismaClient
}

// 本番環境以外では、Hot Reloadに備えてグローバルに一度だけ生成
export const xprisma =
  globalForPrisma.xprisma ??
  new PrismaClient({
    log: ['query', 'warn', 'error'], // 必要に応じて変更
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.xprisma = xprisma
}
