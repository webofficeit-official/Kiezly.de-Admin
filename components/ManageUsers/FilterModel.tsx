import { Listbox, Popover, Transition } from "@headlessui/react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Fragment, useState } from "react";

const FilterModel = ({ isOpen, setIsOpen, t, filter, setFilter }) => {

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
                                <FilterInput
                                    label={t("filter.form.name.label")}
                                    placeholder={t("filter.form.name.placeholder")}
                                    value={filter.q}
                                    onChange={(e) => {
                                        setFilter({
                                            ...filter,
                                            q: e.target.value
                                        })
                                    }}
                                />

                                <FilterInput
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
                                <Select
                                    label={t("filter.form.role.label")}
                                    value={filter.role}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            role: v
                                        })
                                    }}
                                    options={[
                                        {
                                            value: "",
                                            name: t("filter.form.role.options.all")
                                        },
                                        {
                                            value: "client",
                                            name: t("filter.form.role.options.client")
                                        },
                                        {
                                            value: "helper",
                                            name: t("filter.form.role.options.helper")
                                        },
                                    ]}
                                    placeholder={t("filter.form.role.placeholder")}
                                />

                                <Select
                                    label={t("filter.form.sort.label")}
                                    value={filter.sort}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            sort: v
                                        })
                                    }}
                                    options={[
                                        {
                                            value: "new",
                                            name: t("filter.form.sort.options.new")
                                        },
                                        {
                                            value: "oldest",
                                            name: t("filter.form.sort.options.oldest")
                                        },
                                        {
                                            value: "name_asc",
                                            name: t("filter.form.sort.options.name_asc")
                                        },
                                        {
                                            value: "name_desc",
                                            name: t("filter.form.sort.options.name_desc")
                                        },
                                    ]}
                                    placeholder={t("filter.form.sort.placeholder")}
                                />

                                <Select
                                    label={t("filter.form.pageSize.label")}
                                    value={filter.pageSize}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            pageSize: v
                                        })
                                    }}
                                    options={[
                                        {
                                            value: "10",
                                            name: "10"
                                        },
                                        {
                                            value: "25",
                                            name: "25"
                                        },
                                        {
                                            value: "50",
                                            name: "50"
                                        },
                                        {
                                            value: "100",
                                            name: "100"
                                        },
                                    ]}
                                    placeholder={t("filter.form.pageSize.placeholder")}
                                />
                            </div>

                            <div className="flex col space-x-5">
                                <Switch label={t("filter.form.policeVerified.label")} checked={filter.policeVerified} onChange={(v) => {
                                    setFilter({
                                        ...filter,
                                        policeVerified: filter.policeVerified ? null : true
                                    })
                                }} />

                                <Switch label={t("filter.form.firstAid.label")} checked={filter.firstAid} onChange={(v) => {
                                    setFilter({
                                        ...filter,
                                        firstAid: filter.firstAid ? null : true
                                    })
                                }} />
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

function FilterInput({ label, placeholder = "", error = false, errorMesage = "", value, onChange, type = 'text' }) {
    return (
        <div className="w-full max-w-sm min-w-[200px] mt-4 ">
            <label className={`block mb-1 text-sm ${error ? 'text-red-600' : 'text-slate-700'}`}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`rounded-xl w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${error ? 'border-red-400' : 'border-gray-300'} rounded px-3 py-2 transition duration-300 ease shadow-sm focus:shadow-md`}
                placeholder={placeholder} />
            {
                error &&
                <p className="text-sm mt-2 font-sans text-red-600">{errorMesage}</p>
            }
        </div>
    )
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between border border-gray-300 px-3 py-2 mt-4 rounded-xl w-full">
            <span className="text-sm">{label}</span>
            <button type="button" onClick={() => onChange(!checked)} className={classNames("h-6 w-11 rounded-full border p-0.5 text-left", checked ? "bg-black" : "bg-gray-200")}
                aria-pressed={checked}
            >
                <span className={classNames("block h-5 w-5 rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-0")} />
            </button>
        </div>
    );
}

function classNames(...xs: Array<string | false | undefined | null>) {
    return xs.filter(Boolean).join(" ");
}

function Select({
    label,
    value,
    onChange,
    options,
    placeholder = "Select"
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: {
        value: string
        name: string
    }[];
    placeholder?: string
}) {
    return (
        <div className="text-sm mt-5 w-full">
            <span className="mb-1 block text-gray-700">{label}</span>

            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black">
                        {value || placeholder}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
                        {options.map((o) => (
                            <Listbox.Option
                                key={o.value}
                                value={o.value}
                                className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between">
                                        <span>{o.name}</span>
                                        {selected && <Check className="h-4 w-4 text-gray-600" />}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}