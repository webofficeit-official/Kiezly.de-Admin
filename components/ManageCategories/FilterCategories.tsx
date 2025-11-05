"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesTable from "./CategoriesTable";
import { useFilteredCategories } from "@/lib/react-query/queries/categories/categories";
import Pagination from "../ui/pagination/pagination";
import CategoryModal from "./CategoriesModel";

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
  });

  const [modelOpen, setModelOpen] = useState(false);
  
  const apiFilters = useMemo(
    () => ({
      page: filter.page,
      page_size: filter.pageSize,
      q: filter.q,
    }),
    [filter.page, filter.pageSize, filter.q]
  );

  const { data, isLoading, isError, error } = useFilteredCategories(apiFilters);

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
  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        <CategoriesHeader totalItems={totalItems}    setModelOpen={setModelOpen} 
                    modelOpen={modelOpen}  t={t} />
        <CategoriesTable
          categories={categories}
          t={t}
          page={page}
          pageSize={filter.pageSize}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={handlePageChange}
        />
      </div>
           <CategoryModal isOpen={modelOpen} setIsOpen={setModelOpen} t={t} />
    </>
  );
};

export default FilterCategories;
