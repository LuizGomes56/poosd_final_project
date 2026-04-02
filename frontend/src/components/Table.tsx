import { Fragment, type ReactNode, useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import { BsEye } from "react-icons/bs";
import { BiCheck, BiPencil, BiTrash } from "react-icons/bi";
import { type SetState, type ActionFn } from "../consts";
import { useSkip } from "../hooks";
import Button from "./Button";
import SearchInput from "./SearchInput";

type TablePattern = {
    header?: {
        name: string;
        style?: string;
        unsortable?: boolean;
    }[];
    body: Array<[
        string,
        Array<{
            value: React.ReactNode;
            style?: string;
            target?: string | number | Date | null;
        }>
    ]>;
};

type TableSizes = "fit-content(100%)" | "1fr" | "2fr" | "3fr" | "4fr" | "auto" | "4rem" | "5rem" | "6rem";

interface TableProps {
    pattern: TablePattern;
    cols?: number | { size: TableSizes }[];
    title?: string;
    btnText?: string;
    className?: string;
    hideShadow?: boolean;
    foreignHeader?: boolean;
    searchConfig?: {
        deepSearch: boolean;
        search?: string;
        setSearch?: SetState<string>;
    };
    setItemForm?: SetState<boolean>;
    sort?: {
        ascending: boolean;
        index?: number;
    };
    actions?: SetState<ActionFn>;
    checkboxes?: boolean;
}

const TableCells = (columns: number | { size: TableSizes }[], actions: boolean, checkboxes: boolean) => {
    if (typeof columns === "number") {
        return `${checkboxes ? "4rem" : ""} repeat(${columns}, auto) ${actions ? "fit-content(100%)" : ""}`;
    } else {
        return `${checkboxes ? "4rem" : ""} ${columns.map(col => col.size).join(" ")} ${actions ? "fit-content(100%)" : ""}`;
    }
};

const sortHelper = (x: any) => {
    if (x.target) {
        return x.target instanceof Date
            ? x.target.getTime().toString()
            : x.target.toString().toLowerCase();
    }
    else if (typeof x.value === "string" || typeof x.value === "number") {
        return x.value?.toString().toLowerCase();
    }
    return "";
};

const GridCheckbox = () => (
    <label className="flex items-center justify-center w-5 h-5 border-2 border-zinc-600 rounded cursor-pointer select-none transition-colors has-[:checked]:border-emerald-500">
        <input type="checkbox" className="hidden peer" aria-label="select" />
        <div className="aspect-square opacity-0 peer-checked:opacity-100 peer-checked:bg-emerald-500 flex rounded items-center justify-center transition-opacity">
            <BiCheck className="text-black h-5 w-5" />
        </div>
    </label>
);

const Actions = ({ id, actions }: { id: string, actions: SetState<ActionFn> }) => {
    const ActionWrapper = ({ children, mode, className = "" }: { mode: "VIEW" | "UPDATE" | "DELETE", children: ReactNode, className?: string }) => (
        <div onClick={() => actions({ id, mode })} className={`p-2 cursor-pointer flex items-center justify-center rounded-lg bg-zinc-800/50 transition-colors ${className}`}>
            {children}
        </div>
    );
    return (
        <div className="flex items-center gap-2">
            <ActionWrapper mode="VIEW" className="hover:text-sky-400 hover:bg-sky-400/10"><BsEye size={16} /></ActionWrapper>
            <ActionWrapper mode="UPDATE" className="hover:text-emerald-400 hover:bg-emerald-400/10"><BiPencil size={16} /></ActionWrapper>
            <ActionWrapper mode="DELETE" className="hover:text-red-400 hover:bg-red-400/10"><BiTrash size={16} /></ActionWrapper>
        </div>
    );
};

const TableCell = ({ header = true, index, className = "", children }: { header?: boolean, className?: string, index: number, children?: ReactNode }) => (
    <div className={`text-zinc-300 flex items-center ${header ? "border-t" : index > 0 ? "border-t" : ""} ${index % 2 > 0 ? "bg-zinc-900/30" : "bg-transparent"} border-zinc-800/50 ${className}`}>
        {children}
    </div>
);

const headStyle = "flex z-20 items-center gap-1.5 font-bold sticky top-0 bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-wider";

const Table = ({
    cols,
    title = "",
    btnText = "",
    className = "",
    hideShadow = false,
    pattern,
    foreignHeader,
    searchConfig = { deepSearch: false },
    setItemForm,
    sort = { ascending: true, index: 0 },
    actions,
    checkboxes = false
}: TableProps) => {
    const [sortedBody, setSortedBody] = useState(() => [...pattern.body].sort((a, b) => {
        const sortA = sortHelper(a[1][sort.index || 0]);
        const sortB = sortHelper(b[1][sort.index || 0]);
        return sort.ascending
            ? String(sortA).localeCompare(String(sortB), undefined, { numeric: true })
            : String(sortB).localeCompare(String(sortA), undefined, { numeric: true });
    }));

    const [sortedObj, setSortedObj] = useState(sort);
    const searchState = useState<string>("");
    const [search, setSearch] = (searchConfig.search !== undefined && searchConfig.setSearch)
        ? [searchConfig.search, searchConfig.setSearch]
        : searchState;

    const searchMode = pattern.body.filter(row =>
        row[1].some(cell => {
            let content = "";
            if (cell.target) {
                content = cell.target instanceof Date ? cell.target.toISOString() : cell.target.toString().toLowerCase();
            } else if (typeof cell.value === "string" || typeof cell.value === "number") {
                content = cell.value.toString().toLowerCase();
            }
            return searchConfig.deepSearch
                ? [...search.toLowerCase()].every(char => content.includes(char))
                : content.includes(search.toLowerCase());
        })
    );

    useSkip(() => {
        const sorted = [...pattern.body].sort((a, b) => {
            const sortA = sortHelper(a[1][sortedObj.index || 0]);
            const sortB = sortHelper(b[1][sortedObj.index || 0]);
            return sortedObj.ascending
                ? String(sortA).localeCompare(String(sortB), undefined, { numeric: true })
                : String(sortB).localeCompare(String(sortA), undefined, { numeric: true });
        });
        setSortedBody(sorted);
    }, [pattern.body, sortedObj]);

    useSkip(() => setSortedBody(searchMode), [search]);

    const handleSort = (index: number) => {
        setSortedObj(prev => ({
            ascending: prev.index === index ? !prev.ascending : true,
            index
        }));
    };

    return (
        <div className={`rounded-xl overflow-hidden ${hideShadow ? "" : "shadow-2xl shadow-black/50"}`}>
            {!foreignHeader && setItemForm && (
                <div className="flex flex-wrap gap-4 justify-between p-4 items-center border border-zinc-800 bg-zinc-900/50 rounded-t-xl">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <SearchInput search={search} setSearch={setSearch} text={searchConfig.deepSearch ? "Deep search..." : "Search..."} />
                        <Button color="emerald" text={btnText || "Add Item"} onClick={() => setItemForm(true)} />
                    </div>
                </div>
            )}
            
            <div className={`overflow-x-auto border-x border-b border-zinc-800 ${!setItemForm && !foreignHeader ? "rounded-xl border-t" : "rounded-b-xl"}`}>
                <div
                    className={`min-w-max grid ${className}`}
                    style={{
                        gridAutoRows: "56px",
                        gridTemplateColumns: TableCells(cols || (pattern.body?.[0]?.[1]?.length || pattern.header?.length || 0), Boolean(actions), checkboxes)
                    }}
                >
                    {checkboxes && (
                        <div className={`${headStyle} justify-center px-4`}><GridCheckbox /></div>
                    )}
                    
                    {pattern.header && pattern.header.map((item, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => !item.unsortable && handleSort(index)}
                            className={`transition-all duration-200 select-none ${item.unsortable ? "cursor-default" : "hover:text-emerald-400 cursor-pointer"} focus:outline-none ${headStyle} ${sortedObj.index === index ? "text-emerald-400" : "text-zinc-500"} ${item.style || "px-4"}`}
                        >
                            <span>{item.name}</span>
                            {!item.unsortable && (
                                <TbChevronDown className={`w-4 h-4 transition-transform ${sortedObj.index === index ? "opacity-100" : "opacity-0"} ${sortedObj.ascending ? "" : "rotate-180"}`} />
                            )}
                        </button>
                    ))}

                    {actions && <div className={`${headStyle} text-zinc-500 px-4 justify-center`}><span>Actions</span></div>}

                    {sortedBody.map((item, index) => (
                        <Fragment key={item[0]}>
                            {checkboxes && (
                                <TableCell index={index} className="justify-center px-4"><GridCheckbox /></TableCell>
                            )}
                            {item[1].map((c, i) => (
                                <TableCell header={Boolean(pattern.header)} className={c.style || "px-4"} index={index} key={i}>
                                    <span className="text-sm">{c.value}</span>
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell index={index} className="px-4 justify-center">
                                    <Actions actions={actions} id={item[0]} />
                                </TableCell>
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Table;