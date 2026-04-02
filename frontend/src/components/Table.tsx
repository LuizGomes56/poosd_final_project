import { Fragment, type ReactNode, useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import { BsEye } from "react-icons/bs";
import { BiCheck, BiPencil, BiTrash } from "react-icons/bi";
import { STYLES, type SetState, type ActionFn } from "../consts";
import { useSkip } from "../hooks";
import Button from "./Button";
import SearchInput from "./SearchInput";

const GridCheckbox = () => (
    <label className="flex items-center has-checked::border-violet-600
        justify-center w-5 h-5 border-2 border-zinc-500 rounded cursor-pointer select-none">
        <input
            type="checkbox"
            className="hidden peer"
            aria-label="select"
        />
        <div className="aspect-square opacity-0 peer-checked:opacity-100
            peer-checked:bg-violet-600 flex rounded
            items-center justify-center">
            <BiCheck className="text-white h-5 w-5" />
        </div>
    </label>
)

const Actions = ({ id, actions }: { id: string, actions: SetState<ActionFn> }) => {
    const ActionWrapper = ({ children, mode, className = "" }: { mode: "VIEW" | "UPDATE" | "DELETE", children: ReactNode, className?: string }) => (
        <div onClick={() => actions({ id, mode })} className={`p-2 cursor-pointer flex items-center justify-center rounded-full dark:bg-zinc-800 ${className}`}>
            {children ?? null}
        </div>
    )
    return (
        <div className="flex items-center gap-1">
            {<ActionWrapper mode="VIEW" className="dark:hover:text-indigo-400 hover:text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950">
                <BsEye />
            </ActionWrapper>}
            {<ActionWrapper mode="UPDATE" className="dark:hover:text-emerald-400 hover:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-950">
                <BiPencil />
            </ActionWrapper>}
            {<ActionWrapper mode="DELETE" className="dark:hover:text-red-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950">
                <BiTrash />
            </ActionWrapper>}
        </div>
    )
}

const TableCell = ({ header = true, index, className = "", children }: { header?: boolean, className?: string, index: number, children?: ReactNode }) => (
    <div className={`dark:text-zinc-300 not-dark:text-zinc-700 flex items-center
        ${header ? "border-t" : index > 0 ? "border-t" : ""}
        ${index % 2 > 0 ? "not-dark:bg-zinc-50 dark:bg-std-gray-850" : "not-dark:bg-white dark:bg-std-gray-875"} 
        ${STYLES.border} 
        ${className}
    `}>
        {children ?? null}
    </div>
)

type TablePattern = {
    header?: {
        name: string;
        style?: string;
        unsortable?: boolean;
    }[]
    body: Array<[
        string,
        Array<{
            value: React.ReactNode;
            style?: string;
            target?: string | number | Date | null;
        }>
    ]>;
}

type TableSizes = "fit-content(100%)" | "1fr" | "2fr" | "3fr" | "4fr" | "auto" | "4rem" | "5rem" | "6rem";

type TableProps = {
    pattern: TablePattern,
} & Partial<{
    hideShadow: boolean,
    searchConfig: {
        deepSearch: boolean,
    } & Partial<{
        search: string,
        setSearch: SetState<string>
    }>,
    btnText: string,
    foreignHeader: boolean,
    sort: {
        ascending: boolean,
        index?: number
    },
    className: string,
    setItemForm: SetState<boolean>,
    cols: number | { size: TableSizes }[],
    title: string,
    actions?: SetState<ActionFn>,
    checkboxes: boolean,
}>;

const TableCells = (columns: number | { size: TableSizes }[], actions: boolean, checkboxes: boolean) => {
    if (typeof columns === "number") {
        return `${checkboxes ? "4rem" : ""} repeat(${columns}, auto) ${actions ? "fit-content(100%)" : ""}`;
    } else {
        return `${checkboxes ? "4rem" : ""} ${columns.map(col => col.size).join(" ")} ${actions ? "fit-content(100%)" : ""}`;
    }
};

const sortHelper = (x: TablePattern["body"][number]["1"][number]) => {
    if (x.target) {
        return x.target instanceof Date
            ? x.target.getTime().toString()
            : x.target.toString().toLowerCase()
    }
    else if (typeof x.value === "string" || typeof x.value === "number") {
        return x.value?.toString().toLowerCase();
    }
    else {
        return x.target?.toString().toLowerCase();
    }
}

const headStyle = "flex z-20 items-center gap-1.5 font-medium sticky top-0 not-dark:bg-zinc-50! dark:bg-std-gray-850!";

const Table = ({
    cols,
    title = "",
    btnText = "",
    className = "",
    hideShadow = false,
    pattern,
    foreignHeader,
    searchConfig = {
        deepSearch: false
    },
    setItemForm,
    sort = {
        ascending: true,
        index: 0
    },
    actions,
    checkboxes = false
}: TableProps) => {
    const [sortedBody, setSortedBody] = useState(() => [...pattern.body].sort((a, b) => {
        let sortA = sortHelper(a[1][sort.index || 0]);
        let sortB = sortHelper(b[1][sort.index || 0]);
        if (!sortA || !sortB) {
            return 0;
        }
        return sort.ascending
            ? String(sortA).localeCompare(String(sortB), void 0, { numeric: true })
            : String(sortB).localeCompare(String(sortA), void 0, { numeric: true });
    }));
    const [sortedObj, setSortedObj] = useState(sort);
    const searchState = useState<string>("");
    const [search, setSearch] = searchConfig.search && searchConfig.setSearch
        ? [searchConfig.search, searchConfig.setSearch]
        : searchState;

    const searchMode = pattern.body.filter(row =>
        row[1].some(cell => {
            let content: string | undefined;
            if (cell.target) {
                content = cell.target instanceof Date
                    ? cell.target.toISOString()
                    : cell.target.toString().toLowerCase()
            } else if (typeof cell.value === "string" || typeof cell.value === "number") {
                content = cell.value.toString().toLowerCase();
            }
            if (!content) return false;
            return searchConfig.deepSearch
                ? [...search.toLowerCase()].every(char => content.includes(char))
                : content.includes(search.toLowerCase());
        })
    )

    useSkip(() => {
        const sorted = [...pattern.body].sort((a, b) => {
            let sortA = sortHelper(a[1][sortedObj.index || 0]);
            let sortB = sortHelper(b[1][sortedObj.index || 0]);
            if (!sortA || !sortB) return 0;
            return sortedObj.ascending
                ? String(sortA).localeCompare(String(sortB), undefined, { numeric: true })
                : String(sortB).localeCompare(String(sortA), undefined, { numeric: true });
        });
        setSortedBody(sorted);
    }, [pattern.body, sortedObj]);

    useSkip(() => setSortedBody(() => searchMode), [search]);

    const handleSort = (index: number) => {
        setSortedObj(prev => ({
            ascending: prev.index === index ? !prev.ascending : true,
            index
        }));
    };

    return (
        <div className={`rounded-xl ${hideShadow ? "" : "dark:shadow-std-neutral-700 not-dark:shadow-std-neutral-200-px"}`}>
            {!foreignHeader && setItemForm && <>
                <div className={`flex flex-wrap flex-col sm:flex-row 
                        gap-4 justify-center p-6 sm:p-4 items-center
                        rounded-t-xl border ${STYLES.border} dark:bg-std-gray-875
                    `}>
                    <h2 className="mx-4 text-xl text-nowrap font-medium dark:text-zinc-300 dark:border-b-zinc-400 not-dark:text-zinc-600">
                        {title}
                    </h2>
                    <div className="flex w-full flex-wrap flex-1 justify-end flex-col sm:flex-row items-center gap-4">
                        <SearchInput
                            search={search}
                            setSearch={setSearch}
                            text={searchConfig.deepSearch ? "Deep search" : "Normal Search"}
                        />
                        {setItemForm && <Button
                            className="w-full sm:w-auto"
                            text={btnText || "Add Item"}
                            onClick={() => setItemForm(true)}
                        />}
                    </div>
                </div>
            </>}
            <div className={`overflow-x-auto ${setItemForm || foreignHeader ? "border-x border-b rounded-b-xl" : "border rounded-xl"} ${STYLES.border}`}>
                <div
                    className={`min-w-max grid overflow-y-auto max-h-[calc(100vh-2*80px-6*2*4px)] ${className}`}
                    style={{
                        gridAutoRows: "64px",
                        gridTemplateColumns: TableCells(cols || (pattern.body?.[0]?.[1]?.length || pattern.header?.length || 0), Boolean(actions), checkboxes)
                    }}
                >
                    {checkboxes && <div className="sticky top-0 z-10 flex items-center justify-center not-dark:bg-zinc-50 dark:bg-std-gray-850">
                        <GridCheckbox />
                    </div>}
                    {pattern.header && pattern.header.map((item, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => {
                                if (!item.unsortable) {
                                    handleSort(index)
                                }
                            }}
                            className={`
                                transition-colors duration-200 select-none
                                ${item.unsortable
                                    ? "cursor-default"
                                    : "dark:hover:text-violet-400 not-dark:hover:text-violet-500 cursor-pointer"
                                }
                                focus:outline-none
                                ${headStyle} 
                                ${sortedObj.index === index
                                    ? "dark:text-violet-400 not-dark:text-violet-500"
                                    : "dark:text-white"
                                }
                                ${checkboxes && index === 0
                                    ? "pr-4"
                                    : item.style || "px-4"
                                }
                            `}>
                            <span>{item.name}</span>
                            {!item.unsortable && <TbChevronDown
                                className={`w-5 h-5 ${sortedObj.index === index ? "" : "opacity-0"} mt-0.5 ${sortedObj.ascending ? "" : "rotate-180"}`}
                            />}
                        </button>
                    ))}
                    {actions && <div className={`${headStyle} dark:text-white px-4 justify-center ${sortedBody.length === 0 ? "pr-8" : ""}`}>
                        <span>Actions</span>
                    </div>}
                    {sortedBody.map((item, index) => (
                        <Fragment key={index}>
                            {checkboxes && <TableCell index={index} className={`justify-center`}>
                                <GridCheckbox />
                            </TableCell>}
                            {item[1].map((c, i) => (
                                <TableCell
                                    header={Boolean(pattern.header)}
                                    className={checkboxes && i === 0 ? "pr-4" : c.style || "px-4"}
                                    index={index}
                                    key={i}
                                >
                                    {c.value}
                                </TableCell>
                            ))}
                            {actions && <TableCell index={index} className={`px-4 justify-center`}>
                                <Actions actions={actions} id={item[0]} />
                            </TableCell>}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Table;