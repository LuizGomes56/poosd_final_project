import { FaMagnifyingGlass } from "react-icons/fa6";
import { type SetState } from "../consts";

const SearchInput = ({
    text = "Search...",
    search,
    setSearch
}: { text?: string, search: string, setSearch: SetState<string> }) => (
    <div className="relative flex items-center w-full sm:w-64 group">
        <div className="absolute left-3.5 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="w-3.5 h-3.5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>

        <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            placeholder={text}
            className={`
                w-full pl-10 pr-4 py-2 text-sm
                bg-zinc-900/50 border border-zinc-800 
                text-white rounded-lg outline-none
                placeholder:text-zinc-600
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                hover:bg-zinc-800 transition-all
            `}
        />

        {search !== "" && (
            <button 
                onClick={() => setSearch("")}
                className="absolute right-3 text-zinc-600 hover:text-zinc-400 text-xs"
            >
                ✕
            </button>
        )}
    </div>
);

export default SearchInput;