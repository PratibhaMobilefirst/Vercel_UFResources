// export const hasPermission = (
//   permissions: any[],
//   featureName: string
// ): boolean => {
//   const feature = permissions.find((perm) => perm.featureName === featureName);
//   return feature && feature.permissions.some((perm) => perm.status === true); // Check if 'Allowed' permission exists
// };
export const hasPermission = (
  permissions: any[],
  featureName: string
): boolean => {
  const feature = permissions.find((perm) => perm.featureName === featureName);

  if (!feature) return false;

  const permissionsStatus = feature.permissions;

  // Check if 'Allowed' permission is true
  const isAllowed = permissionsStatus.some(
    (perm) => perm.name === "Allowed" && perm.status === true
  );

  // Check if any of Create, View, or Manage is true
  const isManageCreateView = permissionsStatus.some(
    (perm) =>
      ["Create", "View", "Manage"].includes(perm.name) && perm.status === true
  );

  // Check if 'Not Allowed' permission is true
  const isNotAllowed = permissionsStatus.some(
    (perm) => perm.name === "Not Allowed" && perm.status === true
  );

  // Return true if Allowed is true, or if Manage/Create/View is true and Not Allowed is false
  if (isAllowed || isManageCreateView) {
    return true;
  }

  return false;
};
