import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { IError } from './types/response.type';
import { isIError } from './lib/utils';
import { corsHeaders } from './lib/cors';

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia';
const secret = new TextEncoder().encode(SECRET_KEY);

export async function middleware(req: NextRequest) {
  let errorData: IError = {
    code: 0,
    status: '',
    message: '',
    error: '',
  };

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      {
        code: 401,
        status: 'fail',
        message: 'Unauthorized. Please log in first',
        error: 'Token not found',
      },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', String(payload.id || ''));
    requestHeaders.set('x-user-role', String(payload.role || ''));
    requestHeaders.set(
      'x-user-name',
      String(payload.username || payload.name || '')
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error: unknown) {
    if (isIError(error)) {
      errorData = error;
    } else if (error instanceof Error) {
      errorData = {
        code: 403,
        status: 'fail',
        message: error.message,
        error: error.name,
      };
    } else {
      errorData = {
        code: 500,
        status: 'fail',
        message: 'Unexpected error',
        error: 'Unknown',
      };
    }

    return NextResponse.json(errorData, { status: 403, headers: corsHeaders });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
