"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import Pagination from "../ui/pagination/pagination";
import { Zipcode } from "@/lib/types/postal-codes-type";
import { useFilteredZipcodes } from "@/lib/react-query/queries/postal-codes/postal-codes";
import PostalCodeHeader from "./PostalCodeHeader";
import PostalCodeControls from "./PostalCodeControls";
import PostalCodeTable from "./PostalCodeTable";
import PostalCodeUpsertModal from "./PostalCodeUpsertModal";

const FilterPostalCode = () => {
  const t = useT("postal-codes");

  const [dataList, setDataList] = useState<Zipcode[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filter, setFilter] = useState<{
    q: string;
    page: number;
    pageSize: number;
    countryId: number | "";
  }>({
    q: "",
    page: 1,
    pageSize: 10,
    countryId: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Zipcode | null>(null);


  const apiFilters = useMemo(
    () => ({
      page: filter.page,
      page_size: filter.pageSize,
      q: filter.q || undefined,
      country_id: typeof filter.countryId === "number" ? filter.countryId : undefined,
    }),
    [filter.page, filter.pageSize, filter.q, filter.countryId]
  );

  const { data, isLoading } = useFilteredZipcodes(apiFilters);

  useEffect(() => {
    if (!data) return;
    const d = data.data;
    setDataList(d?.items ?? []);
    setPage(d?.page ?? filter.page);
    setTotalItems(d?.total_items ?? 0);
    setTotalPages(d?.total_pages ?? 1);

    if (d?.page_size && d.page_size !== filter.pageSize) {
      setFilter((f) => ({ ...f, pageSize: d.page_size }));
    }
  }, [data]);

  const handlePageChange = (newPage: number) =>
    setFilter((f) => ({ ...f, page: newPage }));

  const handleQueryChange = (q: string) =>
    setFilter((f) => ({ ...f, q, page: 1 }));

  const handlePageSizeChange = (size: number) =>
    setFilter((f) => ({ ...f, pageSize: size, page: 1 }));

  const handleCountryChange = (val: number | "") =>
    setFilter((f) => ({ ...f, countryId: val, page: 1 }));

  const proxySetModalOpen = (v: boolean) => {
    if (v) setSelectedData(null);
    setModalOpen(v);
  };

  const onEdit = (cat: Zipcode) => {
    setSelectedData(cat);
    setModalOpen(true);
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10">
        <PostalCodeHeader
          totalItems={totalItems}
          setModelOpen={proxySetModalOpen}
          modelOpen={modalOpen}
          t={t}
        />

     
        <PostalCodeControls
          q={filter.q}
          pageSize={filter.pageSize}
          countryId={filter.countryId}
          onQueryChange={handleQueryChange}
          onPageSizeChange={handlePageSizeChange}
          onCountryChange={handleCountryChange}
          t={t}
        />

        <PostalCodeTable
          dataList={dataList}
          t={t}
          page={page}
          pageSize={filter.pageSize}
          loading={isLoading}
          onEdit={onEdit}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={handlePageChange}
        />
      </div>

      <PostalCodeUpsertModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        t={t}
        DataItem={selectedData}
      />
    </>
  );
};

export default FilterPostalCode;
