/** True for the admin login page and everything under the admin dashboard. */
export function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin-dashboard") || pathname.startsWith("/aviat-admin");
}
