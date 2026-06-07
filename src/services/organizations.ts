import api from '@/lib/axios';

export async function getMembers(
  orgId: string,
) {
  const response = await api.get(
    `/organizations/${orgId}/members`,
  );

  return response.data;
}

export async function updateMemberRole(
  orgId: string,

  memberId: string,

  role: string,
) {
  const response = await api.patch(
    `/organizations/${orgId}/members/${memberId}`,
    {
      role,
    },
  );

  return response.data;
}

export function getOrgId(user: any) {
  return user?.memberships?.[0]
    ?.orgId;
}