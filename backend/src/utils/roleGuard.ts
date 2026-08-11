import { PermissionType, Permissions } from "../enums/role.enum";
import { UnauthorizedException } from "./appErrors";
import { RolePermissions } from "./role-permission";

export const roleGuard = (
  role: keyof typeof RolePermissions | undefined,
  requiredPermissions: PermissionType[]
) => {
  const permissions = role ? RolePermissions[role] : undefined;
  // If the role doesn't exist or lacks required permissions, throw an exception

  const hasPermission =
    permissions?.length &&
    requiredPermissions.every((permission) => permissions.includes(permission));

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};
