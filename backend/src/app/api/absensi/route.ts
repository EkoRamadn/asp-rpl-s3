import { corsHeaders } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { NextResponse } from "next/server";

type WaktuSholat = "ashar" | "dzuhur"

interface Absensi {
    id: number,
    id_siswi: number,
    tanggal: Date,
    waktu: WaktuSholat,
    status: "haid",
    keterangan: string | null,
    waktu_input: Timestamp
}

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

        let absensiData = null;
        let absensiError = null;
        let count: number | null = null;

        if (id !== -1) {
            const res = await supabase
                .from('tbl_absensi')
                .select('*')
                .eq('id', id);

            absensiData = res.data;
            absensiError = res.error;
        } else {

            let query = supabase
                .from('tbl_absensi')
                .select(
                    `
                    id,
                    tanggal,
                    waktu,
                    status,
                    keterangan,
                    waktu_input,
                    tbl_siswi!inner (
                        nama_lengkap,
                        kelas,
                        nis
                    )
                    `,
                    { count: 'exact' }
                )
                .order('id', { ascending: true });

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
            absensiData = from >= count ? [] : (res.data || []);
        }

        if (absensiError) throw new Error(absensiError.message);

        return NextResponse.json(
            {
                code: 200,
                status: 'success',
                message: 'Data siswi berhasil diambil',
                data: absensiData,
                pagination: {
                    page,
                    limit,
                    total_items: count ?? 0,
                    total_pages: Math.ceil((count ?? 0) / limit),
                },
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: 'fail',
                message: err instanceof Error ? err.message : 'Unexpected error',
                error: err instanceof Error ? err.name : 'Unknown',
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { id, dtnew } = await req.json()
        if (id || dtnew) throw new Error("lengkapai parameter")
        const { data: absensiData, error: absensiError } = await supabase.from('tbl_absensi').update({ status: dtnew.status, keterangan: dtnew.keterangan, waktu_input: dtnew.waktu_input }).eq("id", id).select("tbl_siswi(nama_lengkap)").single()
        if (absensiError) throw new Error(absensiError.message)
        return NextResponse.json({
            code: 200,
            status: 'success',
            message: 'Data absensi berhasil diupdate',
            data: absensiData,
        },
            { status: 200, headers: corsHeaders }
        )
    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: 'fail',
                message: err instanceof Error ? err.message : 'Unexpected error',
                error: err instanceof Error ? err.name : 'Unknown',
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { dtnew } = await req.json()
        const { data: nextNo } = await supabase.rpc('get_next_absensi_no');
        const { data: absensiData, error: absensiError } = await supabase.from('tbl_absensi').insert({ id: nextNo, id_siswi: dtnew.id_siswi, tanggal: dtnew.tanggal, waktu: dtnew.waktu, status: dtnew.status, keterangan: dtnew.keterangan || "", waktu_input: dtnew.waktu_input }).select("tbl_siswi(nama_lengkap,kelas,nis)").single()
        if (absensiError) throw new Error(absensiError.message)
        return NextResponse.json({
            code: 200,
            status: 'success',
            message: 'Data absensi berhasil di input',
            data: absensiData,
        },
            { status: 200, headers: corsHeaders }
        )
    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: 'fail',
                message: err instanceof Error ? err.message : 'Unexpected error',
                error: err instanceof Error ? err.name : 'Unknown',
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json();
        const { data: absensiData, error: absensiError } = await supabase
            .from('tbl_absensi')
            .delete()
            .in('id', ids).select("id");
        if (absensiError) throw new Error(absensiError.message);
        return NextResponse.json(
            {
                code: 200,
                status: 'success',
                message: 'meghapus data absensi berhasil',
                data: absensiData.map((abs) => abs.id),
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
                error: err instanceof Error ? err.name : 'Unknown',
            },
            { status: 500, headers: corsHeaders }
        );
    }
}