import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { data: classData, error: classError } = await supabase
      .from('tbl_kelas')
      .select('nama_kelas');
    if (classError) throw new Error(classError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'mendapat nama kelas berhasil',
        data: classData.map((clas) => clas.nama_kelas),
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
    const { clasNow, clasNew } = await req.json();
    const { searchParams } = new URL(req.url);

    const wali = searchParams.get('wali');
    const hasWali = wali !== null;

    if (!clasNow) throw new Error('clasNow wajib diisi');

    let classData: { nama_kelas: string } | null = null;
    let classError: { message: string } | null = null;

    if (hasWali) {
      const res = await supabase
        .from('tbl_kelas')
        .update({
          nama_kelas: clasNew || clasNow,
          wali_kelas: wali,
        })
        .eq('nama_kelas', clasNow)
        .select('nama_kelas')
        .single();

      classData = res.data;
      classError = res.error;
    } else {
      if (!clasNew) throw new Error('clasNew wajib diisi');

      const res = await supabase
        .from('tbl_kelas')
        .update({ nama_kelas: clasNew })
        .eq('nama_kelas', clasNow)
        .select('nama_kelas')
        .single();

      classData = res.data;
      classError = res.error;
    }

    if (classError) throw new Error(classError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'update class berhasil',
        data: classData,
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
  interface Clas {
    nama_kelas: string;
    wali_kelas: string;
  }
  try {
    const { clasNew } = await req.json();
    const { data: nextNo } = await supabase.rpc('get_next_clas_no');
    console.log(nextNo);
    const dataPac = await clasNew.map((clas: Clas, id: number) => {
      return {
        id: nextNo + id,
        nama_kelas: clas.nama_kelas,
        wali_kelas: clas.wali_kelas,
      };
    });
    const { data: clasData, error: clasError } = await supabase
      .from('tbl_kelas')
      .insert(dataPac);

    if (clasError) throw new Error(clasError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'menginput data class berhasil',
        data: clasData,
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
    const { data: clasData, error: clasError } = await supabase
      .from('tbl_kelas')
      .delete()
      .in('nama_kelas', ids);
    if (clasError) throw new Error(clasError.message);
    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'meghapus data clas berhasil',
        data: clasData,
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
