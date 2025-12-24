import { corsHeaders } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const { data, error } = await supabase
                .from("tbl_notifikasi")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw new Error(error.message);

            return NextResponse.json(
                {
                    code: 200,
                    status: "success",
                    message: "nontif berhasil ditemukan",
                    data,
                    error: null,
                },
                { status: 200, headers: corsHeaders }
            );
        }

        const { data, error } = await supabase
            .from("tbl_notifikasi")
            .select("*");

        if (error) throw new Error(error.message);

        return NextResponse.json(
            {
                code: 200,
                status: "success",
                message: "berhasil mengambil semua nontif",
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
                message: err instanceof Error ? err.message : "Unexpected error",
                data: null,
                error: err instanceof Error ? err.name : "Unknown",
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            id_siswi,
            pesan,
            status_baca = false,
            tanggal_kirim = new Date().toISOString(),
        } = body;

        if (!id_siswi || !pesan) {
            return NextResponse.json(
                {
                    code: 400,
                    status: "fail",
                    message: "id_siswi dan pesan wajib diisi",
                    data: null,
                    error: "ValidationError",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data, error } = await supabase
            .from("tbl_notifikasi")
            .insert([
                {
                    id_siswi,
                    pesan,
                    status_baca,
                    tanggal_kirim,
                },
            ])
            .select()
            .single();

        if (error) throw new Error(error.message);

        return NextResponse.json(
            {
                code: 201,
                status: "success",
                message: "notifikasi berhasil dikirim 💌",
                data,
                error: null,
            },
            { status: 201, headers: corsHeaders }
        );
    } catch (err) {
        return NextResponse.json(
            {
                code: 500,
                status: "fail",
                message: err instanceof Error ? err.message : "Unexpected error",
                data: null,
                error: err instanceof Error ? err.name : "Unknown",
            },
            { status: 500, headers: corsHeaders }
        );
    }
}
