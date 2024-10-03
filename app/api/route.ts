import { Tps } from "@/lib/entities";
import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = Number(searchParams.get("offset") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const kecamatanSearch = searchParams.get("kecamatan") || "";
  const kelurahanSearch = searchParams.get("kelurahan") || "";

  const tps = await prisma.master_tps.findMany({
    where: {
      kecamatan: {
        contains: kecamatanSearch,
      },
      kelurahan: {
        contains: kelurahanSearch,
      },
    },
    take: limit,
    skip: (offset - 1) * limit,
  });

  const tpsSerialized = tps.map((t) => ({
    ...t,
    id: t.id.toString(),
    wil_id_prov: t.wil_id_prov?.toString(),
    wil_id_kabkota: t.wil_id_kabkota?.toString(),
    wil_id_kec: t.wil_id_kec?.toString(),
    wil_id_kel: t.wil_id_kel?.toString(),
    kode_pro: t.kode_pro?.toString(),
    kode_kab: t.kode_kab?.toString(),
    kode_kec: t.kode_kec?.toString(),
    kode_kel: t.kode_kel?.toString(),
    tps_id: t.tps_id?.toString(),
  })) as Tps[];

  if (tpsSerialized.length === 0) {
    return NextResponse.json(
      {
        status_code: 404,
        message: "No tps found",
      },
      {
        status: 404,
      }
    );
  }

  const tpsCount = await prisma.master_tps.count({
    where: {
      kecamatan: {
        contains: kecamatanSearch,
      },
      kelurahan: {
        contains: kelurahanSearch,
      },
    },
  });

  return NextResponse.json({
    status_code: 200,
    message: "Notes retrieved successfully",
    data: tpsSerialized,
    paging: {
      page: offset,
      total_items: tpsCount,
      tota_pages: Math.ceil(tpsCount / limit),
    },
  });
}
