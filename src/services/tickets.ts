import api from '@/lib/axios';

export async function getTickets() {
  const response = await api.get(
    '/tickets',
  );

  return response.data;
}

export async function getMyTickets() {
  const response = await api.get(
    '/tickets/my-tickets',
  );

  return response.data;
}

export async function getTicketById(
  id: string,
) {
  const response = await api.get(
    `/tickets/${id}`,
  );

  return response.data;
}

export async function updateTicketStatus(
  ticketId: string,
  status: string,
) {
  const response = await api.patch(
    `/tickets/${ticketId}/status`,
    {
      status,
    },
  );

  return response.data;
}

export async function createTicket(
  data: {
    title: string;

    description: string;

    priority: string;

    orgId: string;

    attachmentUrl?: string;
  },
) {
  const response = await api.post(
    '/tickets',
    data,
  );

  return response.data;
}

export async function assignTicket(
  ticketId: string,
  assigneeUserId: string,
) {
  const response = await api.patch(
    `/tickets/${ticketId}/assign`,
    {
      assigneeUserId,
    },
  );

  return response.data;
}

export async function deleteTicket(
  ticketId: string,
) {
  const response =
    await api.delete(
      `/tickets/${ticketId}`,
    );

  return response.data;
}