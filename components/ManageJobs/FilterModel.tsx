import { useJobFilterCollection } from "@/lib/react-query/queries/job/jobs";
import { Listbox, Popover, Transition } from "@headlessui/react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { FilterJobInput } from "./Form/FilterJobInput";
import { FilterJobMultiSelect } from "./Form/FilterJobMultiSelect";
import { FilterJobSelect } from "./Form/FilterJobSelect";
import { FilterJobMultiSelectArray } from "./Form/FilterJobMultiSelectArray";
import { FilterJobSelectClient } from "./Form/FilterJobSelectClient";

const FilterModel = ({ isOpen, setIsOpen, t, filter, setFilter }) => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [clients, setClients] = useState([]);
    const [experience, setExperience] = useState([]);
    const [type, setType] = useState([]);

    const collection = useJobFilterCollection()
    useEffect(() => {
        collection.mutate({}, {
            onSuccess: (d) => {
                setCategories(d?.data?.jobCategories)
                setTags(d?.data?.jobTags)
                setClients(d?.data?.clients)
                setExperience(d?.data?.jobExperience)
                setType(d?.data?.jobType)
            },
            onError: (e) => {
                console.log(e);
            }
        })
    }, [isOpen])

    const POSTED = [
        { value: "1", label: t("filter.form.posted.options.1") },
        { value: "7", label: t("filter.form.posted.options.7") },
        { value: "30", label: t("filter.form.posted.options.30") },
        { value: "365", label: t("filter.form.posted.options.365") }
    ]

    const STATUS = [
        { value: "open", label: t("filter.form.status.options.open") },
        { value: "in_progress", label: t("filter.form.status.options.in_progress") },
        { value: "completed", label: t("filter.form.status.options.completed") },
        { value: "cancelled", label: t("filter.form.status.options.cancelled") },
        { value: "draft", label: t("filter.form.status.options.draft") },
        { value: "pending_review", label: t("filter.form.status.options.pending_review") },
        { value: "published", label: t("filter.form.status.options.published") },
        { value: "closed", label: t("filter.form.status.options.closed") },
        { value: "rejected", label: t("filter.form.status.options.rejected") },
        { value: "expired", label: t("filter.form.status.options.expired") },
    ]

    const SORT = [
        { value: "new", label: t("filter.form.sort.options.new") },
        { value: "price_asc", label: t("filter.form.sort.options.price_asc") },
        { value: "price_desc", label: t("filter.form.sort.options.price_desc") },
    ]

    const PAGE = [
        { value: "10", label: "10" },
        { value: "25", label: "25" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
    ]

    return (
        isOpen &&
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 max-w-[50rem] mx-auto">
                {/* Backdrop overlay */}
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={() => setIsOpen(!isOpen)}
                ></div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* 2. Modal Panel (The actual content box) */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl sm:w-full">
                    <div className="space-y-2">
                        <div className="flex flex-col p-6">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t("filter.title")}
                                </h2>
                                <X className="h-6 w-6 text-black-300 border border-gray-200 cursor-pointer rounded-lg" onClick={() => setIsOpen(!isOpen)} />
                            </div>
                            <p className="mb-3 mt-1 text-slate-400 text-sm">
                                {t("filter.description")}
                            </p>

                            <div className="flex col space-x-5">
                                <FilterJobInput
                                    label={t("filter.form.title.label")}
                                    placeholder={t("filter.form.title.placeholder")}
                                    value={filter.q}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            q: e.target.value
                                        })
                                    }}
                                />

                                <FilterJobInput
                                    label={t("filter.form.location.label")}
                                    placeholder={t("filter.form.location.placeholder")}
                                    value={filter.location}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            location: e.target.value
                                        })
                                    }}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <FilterJobMultiSelect
                                    label={t("filter.form.category.label")}
                                    values={filter.categories}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            categories: v
                                        })
                                    }}
                                    options={categories}
                                    placeholder={t("filter.form.category.placeholder")}
                                    t={t}
                                />

                                <FilterJobSelectClient
                                    label={t("filter.form.client.label")}
                                    value={filter.client}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            client: v
                                        })
                                    }}
                                    options={clients}
                                    placeholder={t("filter.form.client.placeholder")}
                                />

                                <FilterJobMultiSelect
                                    label={t("filter.form.job-tags.label")}
                                    values={filter.tags}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            tags: v
                                        })
                                    }}
                                    options={tags}
                                    placeholder={t("filter.form.job-tags.placeholder")}
                                    t={t}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <FilterJobMultiSelectArray
                                    label={t("filter.form.experience.label")}
                                    values={filter.experience}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            experience: v
                                        })
                                    }}
                                    options={experience}
                                    placeholder={t("filter.form.experience.placeholder")}
                                    t={t}
                                />

                                <FilterJobMultiSelectArray
                                    label={t("filter.form.type.label")}
                                    values={filter.type}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            type: v
                                        })
                                    }}
                                    options={type}
                                    placeholder={t("filter.form.type.placeholder")}
                                    t={t}
                                />

                                <FilterJobSelect
                                    label={t("filter.form.posted.label")}
                                    value={filter.posted}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            posted: v
                                        })
                                    }}
                                    options={POSTED}
                                    placeholder={t("filter.form.posted.placeholder")}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <FilterJobSelect
                                    label={t("filter.form.status.label")}
                                    value={filter.status}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            status: v
                                        })
                                    }}
                                    options={STATUS}
                                    placeholder={t("filter.form.status.placeholder")}
                                />

                                <FilterJobSelect
                                    label={t("filter.form.sort.label")}
                                    value={filter.sort}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            sort: v
                                        })
                                    }}
                                    options={SORT}
                                    placeholder={t("filter.form.sort.placeholder")}
                                />

                                <FilterJobSelect
                                    label={t("filter.form.pageSize.label")}
                                    value={filter.pageSize}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            pageSize: v
                                        })
                                    }}
                                    options={PAGE}
                                    placeholder={t("filter.form.pageSize.placeholder")}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <FilterJobInput
                                    label={t("filter.form.min_price.label")}
                                    placeholder={t("filter.form.min_price.placeholder")}
                                    value={filter.minPrice}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            minPrice: e.target.value
                                        })
                                    }}
                                />

                                <FilterJobInput
                                    label={t("filter.form.max_price.label")}
                                    placeholder={t("filter.form.max_price.placeholder")}
                                    value={filter.maxPrice}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            maxPrice: e.target.value
                                        })
                                    }}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <FilterJobInput
                                    label={t("filter.form.starts_at.label")}
                                    type="date"
                                    placeholder={t("filter.form.starts_at.placeholder")}
                                    value={filter.start}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            start: e.target.value
                                        })
                                    }}
                                />

                                <FilterJobInput
                                    label={t("filter.form.ends_at.label")}
                                    type="date"
                                    placeholder={t("filter.form.ends_at.placeholder")}
                                    value={filter.end}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            end: e.target.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-end space-x-2">
                                <button
                                    className="w-32 mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-dialog-close="true"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {t("filter.form.button.cancel")}
                                </button>

                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-32 mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-dialog-close="true">
                                    {t("filter.form.button.filter")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FilterModel

function classNames(...xs: Array<string | false | undefined | null>) {
    return xs.filter(Boolean).join(" ");
}