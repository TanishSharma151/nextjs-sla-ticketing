import api from '@/lib/axios';

export async function login(
  email: string,
  password: string,
) {
  const response = await api.post(
    '/auth/login',
    {
      email,
      password,
    },
  );

  return response.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await api.post(
    '/auth/signup',
    data,
  );

  return response.data;
}

export async function logout() {
  const response = await api.post(
    '/auth/logout',
  );

  return response.data;
}

export async function getMe() {
  console.log(
    'Calling /auth/me',
  );

  const response = await api.get(
    '/auth/me',
  );

  console.log(
    'GET ME RESPONSE',
    response.data,
  );

  return response.data;
}