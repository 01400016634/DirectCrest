import type { AuthRequest } from '../middleware/auth.js';

/**
 * Validates if the requesting user is the owner of the resource OR has a sufficient admin role.
 * Prevents Insecure Direct Object Reference (IDOR).
 * 
 * @param req AuthRequest (must contain req.user)
 * @param resourceUserId The user ID associated with the requested resource
 * @param allowedAdminRoles Array of admin roles that can bypass the ownership check
 * @returns boolean
 */
export const checkOwnershipOrRole = (
  req: AuthRequest, 
  resourceUserId: string, 
  allowedAdminRoles: string[] = ['SUPER_ADMIN', 'ADMIN']
): boolean => {
  if (!req.user) return false;

  const userRole = (req.user.roleId as any)?.name;
  
  // 1. Check if user is an admin with bypass privileges
  if (userRole && allowedAdminRoles.includes(userRole)) {
    return true;
  }

  // 2. Check if user owns the resource (IDOR protection)
  if (req.user._id.toString() === resourceUserId.toString()) {
    return true;
  }

  return false;
};
