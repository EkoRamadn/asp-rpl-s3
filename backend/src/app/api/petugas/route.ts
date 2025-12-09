import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { error } from 'console';
import { NextResponse } from 'next/server';
type Role = 'admin' | 'pengawas' | 'petugas';
interface Petugas {
  username: string;
  nama_petugas: string;
  password: string;
  role: Role;
  last_login: Date;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const id = parseInt(searchParams.get('id') || '-1');

    const prm = searchParams.get('prm');
    const nis = searchParams.get('nis');
    const nama_lengkap = searchParams.get('nama_lengkap');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let petugasData: Petugas | Petugas[] | null = null;
    let count: number = 0;

    if (id !== -1) {
      const res = await supabase
        .from('tbl_petugas')
        .select('*')
        .eq('id', id)
        .single();

      if (res.error) throw new Error(res.error.message);

      petugasData = res.data;

      return NextResponse.json(
        { code: 200, status: 'success', data: petugasData },
        { status: 200, headers: corsHeaders }
      );
    }

    let query = supabase
      .from('tbl_petugas')
      .select('id, username, nama_petugas, password, role, last_login', {
        count: 'exact',
      })
      .order('id', { ascending: true });

    if (prm && prm.trim() !== '') {
      const encoded = prm.replace(/,/g, '');

      query = query.or(
        `username.ilike.%${encoded}%,nama_petugas.ilike.%${encoded}%`
      );
    }

    if (nis) query = query.ilike('username', `%${nis}%`);
    if (nama_lengkap) query = query.ilike('nama_petugas', `%${nama_lengkap}%`);

    const res = await query.range(from, to);

    if (res.error) throw new Error(res.error.message);

    petugasData = res.data ?? [];
    count = res.count ?? 0;

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        data: {
          petugas: petugasData,
          pagination: {
            page,
            limit,
            total_items: count,
            total_pages: Math.ceil(count / limit),
          },
        },
        error: null
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      {
        code: 500,
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null,
        error: err instanceof Error ? err.name : 'Unknown',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, pdatanew } = await req.json();

    if (!id) throw new Error('clasNow wajib diisi');

    let petugasData: { username: string } | null = null;
    let petugasError: { message: string } | null = null;

    const res = await supabase
      .from('tbl_petugas')
      .update({
        username: pdatanew.username,
        nama_petugas: pdatanew.nama_petugas,
        password: pdatanew.password,
        role: pdatanew.role,
        last_login: pdatanew.last_login,
      })
      .eq('id', id)
      .select('username')
      .single();

    petugasData = res.data;
    petugasError = res.error;

    if (petugasError) throw new Error(petugasError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'update petugas berhasil',
        data: petugasData,
        error: null
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        code: 500,
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null,
        error: err instanceof Error ? err.name : 'Unknown',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

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
          message: 'Register petugas berhasil',
          data: registerData,
          error: null
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
        data: null,
        error: "client"
      },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        code: 500,
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null,
        error: err instanceof Error ? err.name : 'Unknown',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json();
    const { data: petugasData, error: petugasError } = await supabase
      .from('tbl_petugas')
      .delete()
      .in('id', ids)
      .select('username');
    if (petugasError) throw new Error(petugasError.message);
    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'meghapus data petugas berhasil',
        data: petugasData.map((petugas) => petugas.username),
        error: null
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        code: 500,
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null,
        error: err instanceof Error ? err.name : 'Unknown',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
