"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import LocalizationHeader from "./LocalizationHeader";
import { useLocalization } from "@/lib/react-query/queries/localization/localization";
import Pagination from "../ui/pagination/pagination";
import LocalizationTable from "./LocalizationTable";
import { Localization } from "@/lib/types/localization-type";
import LocalizationCreateModal from "./LocalaizationUpsertModal";

const LocalizationList = () => {
  const t = useT("localization");
  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
    const [filter, setFilter] = useState({
      q: "",
      page: 1,
      pageSize: 10,
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
    const apiFilters = useMemo(
      () => ({
        page: filter.page,
        page_size: filter.pageSize,
        q: filter.q,
      }),
      [filter.page, filter.pageSize, filter.q]
    );
  

  const { data, isLoading, isError, error } = useLocalization(apiFilters);
  useEffect(() => {
    if (!data) return;
    setDataList(data?.data?.items ?? []);
    setPage(data?.data?.page);
    setTotalItems(data?.data?.total_items ?? 0);
    setTotalPages(data?.data?.total_pages ?? 1);
       if (data?.data?.page_size && data?.data?.page_size !== filter.pageSize) {
      setFilter((f) => ({ ...f, pageSize: data?.data?.page_size }));
    }
  }, [data]);

  const proxySetModalOpen = (v: boolean) => {
    if (v) setSelectedData(null);
    setModalOpen(v);
  };

    const handlePageChange = (newPage: number) =>
    setFilter((f) => ({ ...f, page: newPage }));

     const onEdit = (cat: Localization) => {
        setSelectedData(cat);
        setModalOpen(true);
      };
  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        <LocalizationHeader
          totalItems={totalItems}
          setModelOpen={proxySetModalOpen}
          modelOpen={modalOpen}
          t={t}
        />
          <LocalizationTable
          dataList={dataList}
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
       <LocalizationCreateModal
              isOpen={modalOpen}
              setIsOpen={setModalOpen}
              t={t}
              // DataItem={selectedData}
            />
    </>
  );
};

export default LocalizationList;
