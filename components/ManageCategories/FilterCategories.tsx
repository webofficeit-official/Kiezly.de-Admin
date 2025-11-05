"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesTable from "./CategoriesTable";

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

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        <CategoriesHeader totalItems={totalItems} t={t} />
         <CategoriesTable categories={categories} t={t}  page={page} pageSize={filter.pageSize} />
      </div>
    </>
  );
};

export default FilterCategories;
