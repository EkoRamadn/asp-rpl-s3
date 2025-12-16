import { corsHeaders } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


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

        const tanggal = searchParams.get('tanggal') || null;
        const tanggal_mulai = searchParams.get('tanggal_mulai') || null;
        const tanggal_selesai = searchParams.get('tanggal_selesai') || null;

        const bulan = searchParams.get('bulan')
            ? parseInt(searchParams.get('bulan')!)
            : null;
        const tahun = searchParams.get('tahun')
            ? parseInt(searchParams.get('tahun')!)
            : null;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let absensiData = null;
        let absensiError = null;
        let count: number | null = null;

        if (id !== -1) {
            const res = await supabase.from('tbl_absensbulani').select('*').eq('id', id);

            absensiData = res.data;
            absensiError = res.error;
        } else {
            let query = supabase
                .from('tbl_absensibulan')
                .select(
                    `
          id,
          tanggal,
          status,
          catatan,
          tbl_siswi!inner (
              nama_lengkap,
              kelas,
              nis
          )
          `,
                    { count: 'exact' }
                )
                .order('id', { ascending: true });

            if (tanggal) query = query.eq('tanggal', tanggal);
            if (tanggal_mulai) query = query.gte('tanggal', tanggal_mulai);
            if (tanggal_selesai) query = query.lte('tanggal', tanggal_selesai);

            if (bulan && tahun) {
                const bulanStr = bulan.toString().padStart(2, '0');
                query = query.gte('tanggal', `${tahun}-${bulanStr}-01`);

                const lastDay = new Date(tahun, bulan, 0).getDate();
                query = query.lte('tanggal', `${tahun}-${bulanStr}-${lastDay}`);
            } else if (bulan && !tahun) {
                const now = new Date();
                const t = now.getFullYear();
                const bulanStr = bulan.toString().padStart(2, '0');
                const lastDay = new Date(t, bulan, 0).getDate();

                query = query.gte('tanggal', `${t}-${bulanStr}-01`);
                query = query.lte('tanggal', `${t}-${bulanStr}-${lastDay}`);
            } else if (!bulan && tahun) {
                query = query.gte('tanggal', `${tahun}-01-01`);
                query = query.lte('tanggal', `${tahun}-12-31`);
            }

            if (prm && prm.trim() !== '') {
                const encoded = prm.replace(/,/g, '');
                query = query.or(
                    `nis.ilike.%${encoded}%,nama_lengkap.ilike.%${encoded}%,kelas.ilike.%${encoded}%`,
                    { foreignTable: 'tbl_siswi' }
                );
            }

            if (nis) query = query.ilike('tbl_siswi.nis', `%${nis}%`);
            if (nama_lengkap)
                query = query.ilike('tbl_siswi.nama_lengkap', `%${nama_lengkap}%`);
            if (kelas) query = query.ilike('tbl_siswi.kelas', `%${kelas}%`);

            const res = await query.range(from, to);

            absensiError = res.error;
            count = res.count ?? 0;
            absensiData = from >= count ? [] : res.data || [];
        }

        if (absensiError) throw new Error(absensiError.message);

        return NextResponse.json(
            {
                code: 200,
                status: 'success',
                message: 'Data absensibulan berhasil diambil',
                data: {
                    absensi: absensiData,
                    pagination: {
                        page,
                        limit,
                        total_items: count ?? 0,
                        total_pages: Math.ceil((count ?? 0) / limit),
                    },
                },
                error: null,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: 'fail',
                message: err instanceof Error ? err.name : 'Unexpected error',
                data: null,
                error: err instanceof Error ? err.message : 'Unknown',
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const {
            id,
            status,
            catatan,
            tanggal,
            absenwaktu
        } = body;

        if (!id) {
            return NextResponse.json(
                {
                    code: 400,
                    status: "fail",
                    message: "ID absensi wajib diisi ",
                    data: null,
                    error: "Missing id",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        const payload: any = {};
        if (status !== undefined) payload.status = status;
        if (catatan !== undefined) payload.catatan = catatan;
        if (tanggal !== undefined) payload.tanggal = tanggal;
        if (absenwaktu !== undefined) payload.absenwaktu = absenwaktu;

        if (Object.keys(payload).length === 0) {
            return NextResponse.json(
                {
                    code: 400,
                    status: "fail",
                    message: "Tidak ada data yang diupdate 🫠",
                    data: null,
                    error: "Empty payload",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data, error } = await supabase
            .from("tbl_absensibulan")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return NextResponse.json(
            {
                code: 200,
                status: "success",
                message: "Data absensi berhasil diperbarui",
                data,
                error: null,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: "fail",
                message: "Gagal memperbarui data ",
                data: null,
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500, headers: corsHeaders }
        );
    }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          code: 400,
          status: "fail",
          message: "Array ID wajib dikirim ",
          data: null,
          error: "Invalid ids",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase
      .from("tbl_absensibulan")
      .delete()
      .in("id", ids)
      .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          code: 404,
          status: "fail",
          message: "Tidak ada data yang terhapus 🫠",
          data: null,
          error: "Not found",
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        code: 200,
        status: "success",
        message: `Berhasil menghapus ${data.length} data absensi`,
        data,
        error: null,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      {
        code: 500,
        status: "fail",
        message: "Gagal menghapus data ",
        data: null,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
