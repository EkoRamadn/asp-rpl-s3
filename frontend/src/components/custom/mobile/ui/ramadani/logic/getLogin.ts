import { ApiFail, ApiResponse } from '@/lib/response';
import { LoginData } from '../types/global';

interface GetLoginProps {
  username: string;
  password: string;
}

export const getLogin = async ({
  username,
  password,
}: GetLoginProps): Promise<ApiResponse<LoginData>> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const dt: ApiResponse<LoginData> = await res.json();
    console.log(dt);

    if (dt.status === 'fail') {
      throw new ApiFail(dt.message, dt.error ?? dt.message, dt.code);
    }

    if (!dt.data) {
      return new ApiFail('Format response tidak sesuai', 'Missing field:');
    }

    return dt;
  } catch (err) {
    if (err instanceof ApiFail) {
      return err;
    }

    if (err instanceof Error) {
      return new ApiFail(err.message, 'client-error', 400);
    }

    return new ApiFail('Unexpected error', 'unknown-error', 500);
  }
};
