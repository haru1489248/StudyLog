import 'next-auth'

import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user?: User
  }

  interface User {
    role?: UserRole
  }
}
