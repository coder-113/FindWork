export const hasPermission = (
  roles,
  permissions,
  requiredRole,
  requiredPermission
) => {
  const isRole = roles.map((item) => item.authority).includes(requiredRole);
  const hasPermission = permissions
    .map((item) => item.name)
    .includes(requiredPermission);
  return isRole && !hasPermission;
};
