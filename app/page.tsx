"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tps } from "@/lib/entities";
import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tps, setTps] = useState<Tps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [kecamatanFilter, setKecamatanFilter] = useState("");
  const [kelurahanFilter, setKelurahanFilter] = useState("");
  const [notFound, setNotFound] = useState(false);
  const itemsPerPage = 1000;

  const getTps = async (
    currentPage = 1,
    kecamatanFilter = "",
    kelurahanFilter = ""
  ) => {
    try {
      setLoading(true);
      setNotFound(false);
      const res = await api.get(
        `?offset=${currentPage}&limit=${itemsPerPage}&kecamatan=${kecamatanFilter}&kelurahan=${kelurahanFilter}`
      );

      setTps(res.data.data);
      setTotalItems(res.data.paging.total_items);
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTps(currentPage, kecamatanFilter, kelurahanFilter);
  }, [currentPage, kecamatanFilter, kelurahanFilter]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <main className="flex justify-center">
      <section className="w-[300px] sm:w-[550px] md:w-[700px] lg:w-[900px] xl:w-[1200px] flex flex-col gap-5">
        <div className="mt-10 flex justify-center">
          <h1>Master TPS pileg prov</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="w-full sm:w-auto">
            <Button
              className="w-full"
              onClick={() => {
                getTps(currentPage, kecamatanFilter, kelurahanFilter);
              }}
              variant={"outline"}
            >
              Refresh
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              onChange={(e) => setKecamatanFilter(e.target.value)}
              type="text"
              placeholder="kecamatan"
            />
            <Input
              onChange={(e) => setKelurahanFilter(e.target.value)}
              type="text"
              placeholder="kelurahan"
            />
          </div>
        </div>

        <Table>
          <TableCaption>A list of your recent tps</TableCaption>
          <TableHeader>
            <TableRow className="bg-neutral-800 hover:bg-neutral-700">
              <TableHead className="text-white">id</TableHead>
              <TableHead className="text-white">provinsi</TableHead>
              <TableHead className="text-white">kabkota</TableHead>
              <TableHead className="text-white">kode kecamatan</TableHead>
              <TableHead className="text-white">kecamatan</TableHead>
              <TableHead className="text-white">kode kelurahan</TableHead>
              <TableHead className="text-white">kelurahan</TableHead>
              <TableHead className="text-white">kode tps</TableHead>
              <TableHead className="text-white">tps no</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  <p className="animate-pulse">Loading...</p>
                </TableCell>
              </TableRow>
            ) : notFound ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Data not found
                </TableCell>
              </TableRow>
            ) : (
              tps.map((tps, index) => (
                <TableRow
                  key={tps.id}
                  className={`${
                    index % 2 === 0 ? "" : "bg-neutral-300 hover:bg-neutral-300"
                  }`}
                >
                  <TableCell>{tps.id}</TableCell>
                  <TableCell>{tps.provinsi}</TableCell>
                  <TableCell>{tps.kabkota}</TableCell>
                  <TableCell>{tps.kode_kec}</TableCell>
                  <TableCell>{tps.kecamatan}</TableCell>
                  <TableCell>{tps.kode_kel}</TableCell>
                  <TableCell>{tps.kelurahan}</TableCell>
                  <TableCell>{tps.tps_id}</TableCell>
                  <TableCell>{tps.tps_no}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination className="mb-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </main>
  );
}
