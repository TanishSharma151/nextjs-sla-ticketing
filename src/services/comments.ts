import api from '@/lib/axios';

export async function createComment(
  ticketId: string,

  content: string,
) {
  const response =
    await api.post(
      `/comments/${ticketId}`,
      {
        content,
      },
    );

  return response.data;
}