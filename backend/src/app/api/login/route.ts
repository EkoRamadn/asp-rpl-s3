import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { supabase } from '@/lib/supabase';
import { corsHeaders } from '@/lib/cors';

const SECRET_KEY = process.env.JWT_SECRET || 'annon';
const secret = new TextEncoder().encode(SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { username, password }: { username: string; password: string } =
      await req.json();

    const { data: adminData, error: adminError } = await supabase
      .from('tbl_petugas')
      .select('id, nama_petugas, role, username, password')
      .eq('username', username)
      .eq('password', password)
      .limit(1)
      .maybeSingle();

    if (adminError) throw new Error(adminError.message);

    if (adminData) {
      const token = await new SignJWT({
        id: adminData.id,
        username: adminData.username,
        role: adminData.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
      const { data: updateSign, error: signError } = await supabase
        .from('tbl_petugas')
        .update({ last_login: new Date() })
        .eq('id', adminData.id)
        .select('last_login')
        .single();

      if (signError) throw new Error(signError.message);

      return NextResponse.json(
        {
          code: 200,
          status: 'success',
          message: 'Login admin berhasil',
          data: {
            token,
            role: adminData.role,
            name: adminData.username,
            update: updateSign,
          },
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        code: 401,
        status: 'fail',
        message: 'Username atau password salah',
      },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          code: 500,
          status: 'fail',
          message: err.message,
          error: err.name,
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        code: 500,
        status: 'fail',
        message: 'Unexpected error',
        error: 'Unknown',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
