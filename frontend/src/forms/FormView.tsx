const FormView = ({ title, value }: { title: string, value: string | number }) => (
    <div className="flex flex-col gap-4 border-b-2 border-b-zinc-300 dark:border-b-zinc-600 pb-3">
        <h2 className="font-semibold dark:text-white">{title}</h2>
        <h4 className="font-medium text-zinc-500 dark:text-zinc-400 px-4">
            {value || "Undefined"}
        </h4>
    </div>
)

export default FormView;