import { FaMagnifyingGlass } from "react-icons/fa6";
import { STYLES, type SetState } from "../consts";

const SearchInput = ({
    text = "Search",
    search,
    setSearch
}: { text?: string, search: string, setSearch: SetState<string> }) => (
    <label className={`
            flex items-center text-nowrap gap-2 font-medium relative rounded-lg
            dark:border-transparent border ${STYLES.borderLight} w-full sm:w-auto
            dark:text-white dark:bg-std-gray-800 dark:hover:bg-zinc-600
        `}>
        <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            className={`appearance-none px-4 py-2.5 rounded-lg ${STYLES.focus} pl-10 bg-transparent`}
        />
        <div className="flex items-center gap-3 absolute left-3.5">
            <FaMagnifyingGlass className="w-3.5 h-3.5 dark:box-std-shadow" />
            {search === "" && <span className="text-sm text-nowrap leading-none dark:text-std-shadow-0.5">
                {text}
            </span>}
        </div>
    </label>
)

export default SearchInput;