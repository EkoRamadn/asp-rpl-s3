import { corsHeaders } from '@/lib/cors';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { status: 'fail', message: 'Items harus array dan tidak boleh kosong' },
        { status: 400 }
      );
    }

    const size = 600;
    const results = [];
    const skipped = [];

    for (const item of items) {
      try {
        const { text, iconUrl, iconPercent = 0.2 } = item;
        const tmpdt = JSON.parse(text);

        const { data: existingQr, error: fetchError } = await supabase
          .from('tbl_qrcode')
          .select('id')
          .eq('id_siswi', tmpdt.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingQr) {
          skipped.push({
            id_siswi: tmpdt.id,
            message: 'User sudah memiliki QR code',
          });
          continue;
        }

        const svg = await QRCode.toString(text, {
          type: 'svg',
          errorCorrectionLevel: 'H',
          width: size,
        });

        let finalSvg = svg;

        if (iconUrl) {
          try {
            const iconResp = await fetch(iconUrl);

            if (iconResp.ok) {
              const contentType =
                iconResp.headers.get('content-type') || 'image/png';
              const arrayBuffer = await iconResp.arrayBuffer();
              const iconBase64 = Buffer.from(arrayBuffer).toString('base64');
              const iconDataUri = `data:${contentType};base64,${iconBase64}`;

              const pct = Math.min(Math.max(Number(iconPercent), 0.05), 0.4);
              const iconSize = size * pct;
              const iconPos = (size - iconSize) / 2;

              const imageTag = `<image href="${iconDataUri}" x="${iconPos}" y="${iconPos}" width="${iconSize}" height="${iconSize}" />`;
              const insertIndex = svg.lastIndexOf('</svg>');
              finalSvg =
                svg.slice(0, insertIndex) + imageTag + svg.slice(insertIndex);
            }
          } catch (err) {
            console.log('Icon load failed:', err);
          }
        }
        const svgBuffer = Buffer.from(finalSvg, 'utf-8');
        const fileName = `qr-${Date.now()}-${Math.random().toString(36).slice(2)}.svg`;

        const { error: uploadError } = await supabase.storage
          .from('qr')
          .upload(fileName, svgBuffer, {
            contentType: 'image/svg+xml',
          });

        if (uploadError) {
          skipped.push({ id_siswi: tmpdt.id, message: 'Upload QR gagal' });
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('qr').getPublicUrl(fileName);

        const { data: nextNo, error: rpcError } =
          await supabase.rpc('get_next_qrcode_no');

        if (rpcError || !nextNo) {
          skipped.push({ id_siswi: tmpdt.id, message: 'Gagal ambil nomor QR' });
          continue;
        }

        const { error: insertError } = await supabase
          .from('tbl_qrcode')
          .insert({
            id: nextNo,
            id_siswi: tmpdt.id,
            qrcode_url: publicUrl,
          });

        if (insertError) {
          skipped.push({
            id_siswi: tmpdt.id,
            message: 'FAILURE: ' + insertError.message,
          });
          continue;
        }

        console.log(JSON.stringify(insertError));

        results.push({
          text,
          fileName,
          url: publicUrl,
        });
      } catch (innerErr) {
        console.log(innerErr);
        skipped.push({
          message:
            innerErr instanceof Error
              ? innerErr.message
              : 'Error tidak diketahui',
        });
      }
    }

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'Proses selesai',
        data: {
          generatedCount: results.length,
          generated: results,
          skippedCount: skipped.length,
          skipped,
        },
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const kelas = url.searchParams.get('kelas');
    const search = url.searchParams.get('search') || '';

    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('tbl_qrcode')
      .select('tbl_siswi(nama_lengkap,nis,kelas), qrcode_url', {
        count: 'exact',
      });

    if (id) {
      query = query.eq('id_siswi', id);
    } else {
      if (kelas) {
        query = query.eq('tbl_siswi.kelas', kelas);
      }
      if (search) {
        query = query.ilike('tbl_siswi.nama_lengkap', `%${search}%`);
      }

      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'Mengambil data siswa berhasil',
        data,
        page,
        limit,
        total: count ?? 0, // gunakan count total dari Supabase
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
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { status: 'fail', message: 'Items harus array dan tidak boleh kosong' },
        { status: 400 }
      );
    }

    const size = 600;
    const results = [];

    for (const item of items) {
      const { text, iconUrl, iconPercent = 0.2 } = item;
      const tmpdt = JSON.parse(text);

      const { data: existingQrs, error: fetchError } = await supabase
        .from('tbl_qrcode')
        .select('qrcode_url')
        .eq('id_siswi', tmpdt.id);

      if (fetchError) throw fetchError;

      if (existingQrs && existingQrs.length > 0) {
        for (const qr of existingQrs) {
          if (qr.qrcode_url) {
            const path = qr.qrcode_url.split(
              '/storage/v1/object/public/qr/'
            )[1];
            if (path) {
              await supabase.storage.from('qr').remove([path]);
            }
          }
        }
      }

      const svg = await QRCode.toString(text, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        width: size,
      });

      let finalSvg = svg;

      if (iconUrl) {
        const iconResp = await fetch(iconUrl);
        const contentType = iconResp.headers.get('content-type') || 'image/png';
        const arrayBuffer = await iconResp.arrayBuffer();
        const iconBase64 = Buffer.from(arrayBuffer).toString('base64');
        const iconDataUri = `data:${contentType};base64,${iconBase64}`;

        const pct = Math.min(Math.max(Number(iconPercent), 0.05), 0.4);
        const iconSize = size * pct;
        const iconPos = (size - iconSize) / 2;

        const imageTag = `<image href="${iconDataUri}" x="${iconPos}" y="${iconPos}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet" />`;

        const insertIndex = svg.lastIndexOf('</svg>');
        finalSvg =
          svg.slice(0, insertIndex) + imageTag + svg.slice(insertIndex);
      }

      const svgBuffer = Buffer.from(finalSvg, 'utf-8');
      const fileName = `qr-${Date.now()}-${Math.random().toString(36).slice(2)}.svg`;

      const { error: uploadError } = await supabase.storage
        .from('qr')
        .upload(fileName, svgBuffer, {
          contentType: 'image/svg+xml',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('qr').getPublicUrl(fileName);

      const { error: upsertError } = await supabase
        .from('tbl_qrcode')
        .upsert(
          { id_siswi: tmpdt.id, qrcode_url: publicUrl },
          { onConflict: 'id_siswi' }
        );

      if (upsertError) throw upsertError;

      results.push({
        text,
        fileName,
        url: publicUrl,
      });
    }

    return NextResponse.json({
      message: 'Semua QR berhasil di-generate/di-update dan file lama dihapus',
      count: results.length,
      results,
    });
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

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { status: 'fail', message: 'Items harus array dan tidak boleh kosong' },
        { status: 400 }
      );
    }

    const deleted = [];
    const skipped = [];

    for (const item of ids) {
      const id_siswi = item;

      if (!id_siswi) {
        skipped.push({ id_siswi, message: 'id_siswi tidak valid' });
        continue;
      }

      const { data: qrData, error: fetchError } = await supabase
        .from('tbl_qrcode')
        .select('id, qrcode_url')
        .eq('id_siswi', id_siswi)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          skipped.push({ id_siswi, message: 'QR code tidak ditemukan' });
          continue;
        }
        throw fetchError;
      }

      let path: string | null = null;

      if (qrData.qrcode_url) {
        const split = qrData.qrcode_url.split('/qr/');
        if (split.length > 1) {
          path = split[1];
        }
      }

      if (path) {
        const { error } = await supabase.storage.from('qr').remove([path]);
        console.log(path);
        if (error) throw error;
      }

      const { error: deleteError } = await supabase
        .from('tbl_qrcode')
        .delete()
        .eq('id_siswi', id_siswi);

      if (deleteError) throw deleteError;

      deleted.push({ id_siswi, file_deleted: path });
    }

    return NextResponse.json(
      {
        code: 200,
        status: 'success',
        message: 'Proses DELETE selesai',
        data: {
          deletedCount: deleted.length,
          deleted,
          skippedCount: skipped.length,
          skipped,
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
