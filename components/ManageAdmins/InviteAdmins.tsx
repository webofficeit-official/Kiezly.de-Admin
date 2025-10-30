const InviteAdmins = ({ isOpen, setIsOpen, t }) => {
    return (
        <div data-dialog-backdrop="dialog" data-dialog-backdrop-close="true" className={`absolute ${isOpen || 'hidden'} left-0 top-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300`}>
            <div data-dialog="dialog"
                className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
                <div className="flex flex-col p-6">
                    <h4
                        className="text-2xl mb-1 font-semibold text-slate-700">
                        Edit Member Details
                    </h4>
                    <p className="mb-3 mt-1 text-slate-400">
                        Enter or reset each information for the member access.
                    </p>

                    <div className="w-full max-w-sm min-w-[200px] mt-4">
                        <label className="block mb-1 text-sm text-slate-700">
                            Member Name
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            placeholder="Enter your text" />
                    </div>
                    <div className="w-full max-w-sm min-w-[200px] mt-4">
                        <label className="block mb-1 text-sm text-slate-700">
                            Member Email
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            placeholder="Enter the email" />
                    </div>
                    <div className="w-full max-w-sm min-w-[200px] mt-4">
                        <label className="block mb-1 text-sm text-slate-700">
                            Job
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            placeholder="Enter the job" />
                    </div>
                    <div className="w-full max-w-sm min-w-[200px] mt-4">
                        <label className="block mb-1 text-sm text-slate-700">
                            Active Status
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            placeholder="Offline/Online" />
                    </div>

                </div>
                <div className="p-6 pt-0">
                    <div className="flex space-x-2">
                        <button
                            className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-dialog-close="true"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Cancel
                        </button>

                        <button
                            className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-dialog-close="true">
                            Save
                        </button>
                    </div>
                    <p className="flex justify-center mt-4 font-sans text-sm text-slate-500">
                        Looking for more details? Contact
                        <a href="#admin"
                            className="ml-1 text-sm font-bold leading-normal text-slate-500">
                            Admin.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InviteAdmins