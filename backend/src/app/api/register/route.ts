import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { username, password, nama_petugas, role } = await req.json()
        const { data: registerData, error: registerError } = await supabase.from('tbl_petugas').insert({
            nama_petugas,
            username,
            role,
            password,
        }).select("username").single()

        if (registerError?.code === '23505') throw new Error("Username sudah terdaftar!");
        if (registerError) throw new Error(registerError.message)

        if (registerData) {
            return NextResponse.json({
                code: 200,
                status: 'success',
                message: 'Register berhasil',
                data: registerData
            })
        }
        return NextResponse.json(
            {
                code: 401,
                status: 'fail',
                message: 'kesalahan client',
            },
            { status: 401 }
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
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                code: 500,
                status: 'fail',
                message: 'Unexpected error',
                error: 'Unknown',
            },
            { status: 500 }
        );
    }
}