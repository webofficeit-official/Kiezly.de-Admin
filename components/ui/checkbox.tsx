export function Checkbox({ label, checked, onChange, id }: { label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void, id: string }) {
  return (
    <div className="flex items-center ps-2 border border-gray-200 rounded-sm dark:border-gray-700">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} name="bordered-checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
      <label htmlFor={id} className="w-full py-2 px-2 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
    </div>
  );
}