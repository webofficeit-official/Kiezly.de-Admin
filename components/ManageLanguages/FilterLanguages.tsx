"use client";
import { useEffect, useMemo, useState } from "react";
import { useT } from "@/app/[locale]/layout";

import Pagination from "../ui/pagination/pagination";
import LanguagesHeader from "./LanguagesHeader";
import LanguagesControls from "./LanguagesControls";
import LanguagesTable from "./LanguagesTable";
import LanguagesUpsertModal from "./LanguagesUpsertModal";
import { useFilteredLanguages } from "@/lib/react-query/queries/languages/languages";
import { Languages } from "@/lib/types/languages";
import { useLocalization } from "@/lib/react-query/queries/localization/localization";
import { Localization } from "@/lib/types/localization-type";
type Sort = "id_desc" | "name_asc" | "name_desc";

const FilterLanguages = () => {
  const t = useT("languages");
  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [filter, setFilter] = useState({
    q: "",
    page: 1,
    pageSize: 10,
    sort: "id_desc" as Sort,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] =
    useState<Languages | null>(null);

  const apiFilters = useMemo(
    () => ({
      page: filter.page,
      page_size: filter.pageSize,
      q: filter.q,
      sort: filter.sort,
    }),
    [filter.page, filter.pageSize, filter.q, filter.sort]
  );

  const { data, isLoading, isError, error } = useFilteredLanguages(apiFilters);
  const { data: loc } = useLocalization({})
  const localization: Localization[] = loc?.data?.items ?? []

  useEffect(() => {
    if (!data) return;
    setDataList(data?.data?.items ?? []);
    setPage(data?.data?.page ?? filter.page);
    setTotalItems(data?.data?.total_items ?? 0);
    setTotalPages(data?.data?.total_pages ?? 1);
    if (data?.data?.page_size && data?.data?.page_size !== filter.pageSize) {
      setFilter((f) => ({ ...f, pageSize: data?.data?.page_size }));
    }
  }, [data]);
  const handlePageChange = (newPage: number) =>
    setFilter((f) => ({ ...f, page: newPage }));
  const handleQueryChange = (q: string) =>
    setFilter((f) => ({ ...f, q, page: 1 })); // reset to page 1 on new search

  const handlePageSizeChange = (size: number) =>
    setFilter((f) => ({ ...f, pageSize: size, page: 1 }));

  const handleSortChange = (sort: Sort) =>
    setFilter((f) => ({ ...f, sort, page: 1 }));

  const proxySetModalOpen = (v: boolean) => {
    if (v) setSelectedData(null);
    setModalOpen(v);
  };
  const onEdit = (cat: Languages) => {
    setSelectedData(cat);
    setModalOpen(true);
  };
  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        <LanguagesHeader
          totalItems={totalItems}
          setModelOpen={proxySetModalOpen}
          modelOpen={modalOpen}
          t={t}
        />

        <LanguagesControls
          q={filter.q}
          pageSize={filter.pageSize}
          onQueryChange={handleQueryChange}
          onPageSizeChange={handlePageSizeChange}
          t={t}
        />
        <LanguagesTable
          dataList={dataList}
          localization={localization}
          page={page}
          pageSize={filter.pageSize}
          loading={isLoading}
          onEdit={onEdit}
          sort={filter.sort}
          onSortChange={handleSortChange}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={handlePageChange}
        />
      </div>
      <LanguagesUpsertModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        localization={localization}
        DataItem={selectedData}
      />
    </>
  );
};

export default FilterLanguages;
