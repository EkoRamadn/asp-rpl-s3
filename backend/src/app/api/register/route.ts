import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password, nama_petugas, role } = await req.json();
    const { data: nextNo } = await supabase.rpc('get_next_petugas_no');
    const { data: registerData, error: registerError } = await supabase
      .from('tbl_petugas')
      .insert({
        id: nextNo,
        nama_petugas,
        username,
        role,
        password,
      })
      .select('username')
      .single();

    if (registerError?.code === '23505')
      throw new Error('Username sudah terdaftar!');
    if (registerError) throw new Error(registerError.message);

    if (registerData) {
      return NextResponse.json(
        {
          code: 200,
          status: 'success',
          message: 'Register berhasil',
          data: registerData,
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
        message: 'kesalahan client',
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
