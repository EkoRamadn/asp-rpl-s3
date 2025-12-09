import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { error } from 'console';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const {
      durasi_normal_min,
      durasi_normal_max,
      batas_suci_otomatis,
      nontifikasi_aktif,
      pesan_peringatan,
    } = await req.json();

    const updateResult = await supabase
      .from('tbl_pengaturan_haid')
      .update({
        durasi_normal_min,
        durasi_normal_max,
        batas_suci_otomatis,
        nontifikasi_aktif,
        pesan_peringatan,
      })
      .eq('id', 1)
      .select('*')
      .single();

    if (updateResult.error && updateResult.error.code === 'PGRST116') {
      const insertResult = await supabase
        .from('tbl_pengaturan_haid')
        .insert({
          durasi_normal_min,
          durasi_normal_max,
          batas_suci_otomatis,
          nontifikasi_aktif,
          pesan_peringatan,
        })
        .select('*')
        .single();

      if (insertResult.error) {
        throw new Error(insertResult.error.message);
      }

      return NextResponse.json(
        {
          code: 200,
          status: 'success',
          message: 'data setting dibuat',
          data: insertResult.data,
          error: null
        },
        { status: 200, headers: corsHeaders }
      );
    }

    if (updateResult.error) {
      throw new Error(updateResult.error.message);
    }

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'update setting berhasil',
        data: updateResult.data,
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get('id') || '1');

    const { data: settingData, error: settingError } = await supabase
      .from('tbl_pengaturan_haid')
      .select('*')
      .eq('id', id)
      .single();

    if (settingError) throw new Error(settingError.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'mendapatkan setting berhasil',
        data: settingData,
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
