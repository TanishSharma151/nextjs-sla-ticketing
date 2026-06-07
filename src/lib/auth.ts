import { cookies } from 'next/headers';

export async function isAuthenticated() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      'access_token',
    );

  return !!token;
}

/* ------------------- */
/* ROLE HELPERS */
/* ------------------- */

export const getUserRole = (
  user: any,
) => {
  return (
    user?.memberships?.[0]
      ?.role || 'CLIENT'
  );
};

export const isAdmin = (
  user: any,
) => {
  return (
    getUserRole(user) ===
    'ADMIN'
  );
};

export const isAgent = (
  user: any,
) => {
  return (
    getUserRole(user) ===
    'AGENT'
  );
};

export const isClient = (
  user: any,
) => {
  return (
    getUserRole(user) ===
    'CLIENT'
  );
};