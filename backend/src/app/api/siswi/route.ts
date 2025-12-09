import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { error } from 'console';
import { NextResponse } from 'next/server';

type Siswi = {
  id: number;
  nis: string;
  nama_lengkap: string;
  gender: string;
  kelas: string;
  status_aktif: boolean;
  catatan: string | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const id = parseInt(searchParams.get('id') || '-1');

    const prm = searchParams.get('prm') || null;
    const nis = searchParams.get('nis') || null;
    const nama_lengkap = searchParams.get('nama_lengkap') || null;
    const kelas = searchParams.get('kelas') || null;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let siswiData: Siswi | Siswi[] | null = null;
    let siswiError: { message: string } | null = null;
    let count: number | null = null;

    if (id !== -1) {
      const res = await supabase
        .from('tbl_siswi')
        .select('*')
        .eq('id', id)
        .single();

      siswiData = res.data;
      siswiError = res.error;
    } else {
      let query = supabase
        .from('tbl_siswi')
        .select(
          'id,nis,nama_lengkap,gender,kelas,gender,status_aktif,catatan',
          { count: 'exact' }
        )
        .order('id', { ascending: true });

      if (prm && prm.trim() !== '') {
        const encoded = prm.replace(/,/g, '');

        query = query.or(
          [
            `nis.ilike.%${encoded}%`,
            `nama_lengkap.ilike.%${encoded}%`,
            `kelas.ilike.%${encoded}%`,
          ].join(',')
        );
      }

      if (nis) query = query.ilike('nis', `%${nis}%`);
      if (nama_lengkap)
        query = query.ilike('nama_lengkap', `%${nama_lengkap}%`);
      if (kelas) query = query.ilike('kelas', `%${kelas}%`);

      const res = await query.range(from, to);

      siswiError = res.error;
      count = res.count ?? 0;

      if (from >= count) {
        siswiData = [];
      } else {
        siswiData = res.data || [];
      }
    }

    if (siswiError) {
      throw new Error(siswiError?.message ?? 'Unknown Supabase Error');
    }

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'Data siswi berhasil diambil',
        data: {
          siswi: siswiData,
          pagination: {
            page,
            limit,
            total_items: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
          },
        },
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

export async function PUT(req: Request) {
  try {
    const {
      id,
      nis,
      nama_lengkap,
      gender,
      kelas,
      tanggal_lahir,
      status_aktif,
      catatan,
    } = await req.json();
    const { data: siswiData, error: siswiError } = await supabase
      .from('tbl_siswi')
      .update({
        nis: nis,
        nama_lengkap: nama_lengkap,
        gender: gender,
        kelas: kelas,
        tanggal_lahir: tanggal_lahir,
        status_aktif: status_aktif,
        catatan: catatan,
      })
      .eq('id', id);

    if (siswiError) throw new Error(siswiError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'Data siswa berhasil diupdate',
        data: siswiData,
        erro: null
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          code: 500,
          status: 'fail',
          message: error.message,
          data: null,
          error: error.name,
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
        data: null,
        error: 'Unknown',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function POST(req: Request) {
  interface Siswi {
    nis: number;
    nama_lengkap: string;
    gender: string;
    kelas: string;
    tanggal_lahir: Date;
    status_aktif: string;
    catatan: string;
  }
  try {
    const { siswinew } = await req.json();
    const { data: nextNo } = await supabase.rpc('get_next_siswi_no');
    console.log(nextNo);
    const dataPac = await siswinew.map((siswi: Siswi, id: number) => {
      return {
        id: nextNo + id,
        nis: siswi.nis,
        nama_lengkap: siswi.nama_lengkap,
        gender: siswi.gender,
        kelas: siswi.kelas,
        tanggal_lahir: siswi.tanggal_lahir,
        status_aktif: siswi.status_aktif,
        catatan: siswi.catatan,
      };
    });
    const { data: siswiData, error: siswiError } = await supabase
      .from('tbl_siswi')
      .insert(dataPac);

    if (siswiError) throw new Error(siswiError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'menginput data siswa berhasil',
        data: siswiData,
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

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json();
    const { data: siswiData, error: siswiError } = await supabase
      .from('tbl_siswi')
      .delete()
      .in('id', ids);
    if (siswiError) throw new Error(siswiError.message);
    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'meghapus data siswa berhasil',
        data: siswiData,
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
