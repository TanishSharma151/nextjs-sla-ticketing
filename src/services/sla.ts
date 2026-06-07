import api from '@/lib/axios';

export async function getPolicies(
  organizationId: string,
) {
  const response =
    await api.get(
      `/sla/${organizationId}`,
    );

  return response.data;
}

export async function createPolicy(
  data: any,
) {
  const response =
    await api.post(
      '/sla',
      data,
    );

  return response.data;
}