"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesTable from "./CategoriesTable";
import { useFilteredCategories } from "@/lib/react-query/queries/categories/categories";
import Pagination from "../ui/pagination/pagination";
import CategoriesControls from "./CategoriesControls";
import { JobCategories } from "@/lib/types/job-categories";
import CategoryUpsertModal from "./CategoryUpsertModal";
import { useLocalization } from "@/lib/react-query/queries/localization/localization";
import { Localization } from "@/lib/types/localization-type";
type Sort = "id_desc" | "name_asc" | "name_desc";

const FilterCategories = () => {
  const t = useT("categories");
  const [categories, setCategories] = useState([]);
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
  const [selectedCategory, setSelectedCategory] =
    useState<JobCategories | null>(null);

  const apiFilters = useMemo(
    () => ({
      page: filter.page,
      page_size: filter.pageSize,
      q: filter.q,
      sort: filter.sort,
    }),
    [filter.page, filter.pageSize, filter.q,filter.sort]
  );

  const { data, isLoading, isError, error } = useFilteredCategories(apiFilters);
  const { data: loc } = useLocalization({})
  const localization: Localization[] = loc?.data?.items ?? []

  useEffect(() => {
    if (!data) return;
    setCategories(data?.data?.items ?? []);
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
    if (v) setSelectedCategory(null);
    setModalOpen(v);
  };
    const onEdit = (cat: JobCategories) => {
    setSelectedCategory(cat);
    setModalOpen(true);
  };
  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        <CategoriesHeader
          totalItems={totalItems}
          setModelOpen={proxySetModalOpen}
          modelOpen={modalOpen}
          t={t}
        />

        <CategoriesControls
          q={filter.q}
          pageSize={filter.pageSize}
          onQueryChange={handleQueryChange}
          onPageSizeChange={handlePageSizeChange}
          t={t}
        />
        <CategoriesTable
          categories={categories}
          localization={localization}
          t={t}
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
      <CategoryUpsertModal
        localization={localization}
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        category={selectedCategory}
      />
    </>
  );
};

export default FilterCategories;
