import 'next-auth'

import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}
