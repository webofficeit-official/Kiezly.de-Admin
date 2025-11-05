
export function InputField({ label, placeholder = "", error = false, errorMesage = "", value, onChange, type = 'text' }) {
    return (
        <div className="w-full max-w-sm min-w-[200px] mt-4">
            <label className={`block mb-1 text-sm ${error ? 'text-red-600' : 'text-slate-700'}`}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${error ? 'border-red-400' : 'border-slate-200'} rounded px-3 py-2 transition duration-300 ease shadow-sm focus:shadow-md`}
                placeholder={placeholder} />
            {
                error &&
                <p className="text-sm mt-2 font-sans text-red-600">{errorMesage}</p>
            }
        </div>
    )
}