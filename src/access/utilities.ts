import type { User } from '@/payload-types'

/** Other authenticated collections (including MCP credentials) are not store users. */
export const checkRole = (allRoles: User['roles'] = [], user?: unknown): user is User => {
  if (!user || typeof user !== 'object' || !('roles' in user) || !Array.isArray(user.roles))
    return false
  if ('collection' in user && user.collection !== 'users') return false
  const roles = user.roles
  return Boolean(allRoles?.some((role) => roles.includes(role)))
}
