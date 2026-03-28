import { BiCheck, BiError, BiInfoCircle } from "react-icons/bi";
import { MdWarning } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import type { NotificationProps } from "../consts";

type ComponentProps = NotificationProps & {
    destroy: () => void;
}

const NotificationStandards = {
    error: {
        icon: <BiError className="shrink-0 h-6 w-6" />,
        classes: `bg-red-900 text-red-200 border-red-500`,
        defaultMsg: "Error",
    },
    success: {
        icon: <BiCheck className="shrink-0 h-6 w-6" />,
        classes: `bg-emerald-900 text-emerald-200 border-emerald-500`,
        defaultMsg: "Success!",
    },
    warning: {
        icon: <MdWarning className="shrink-0 h-6 w-6" />,
        classes: `bg-yellow-900 text-yellow-200 border-yellow-500`,
        defaultMsg: "Warning!",
    },
    info: {
        icon: <BiInfoCircle className="shrink-0 h-6 w-6" />,
        classes: `bg-blue-900 text-blue-200 border-blue-500`,
        defaultMsg: "No changes made",
    },
} as const;

export const NotificationTopCenter = ({ notifications }: { notifications: ComponentProps[] }) => {
    const iterator = notifications.filter((n, index, self) => {
        if (n.msg === undefined) return true;
        return self.findIndex(m => m.msg === n.msg) === index;
    });

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/4 z-50 flex flex-col gap-4">
            {iterator.map((obj, index) => {
                const { icon, classes, defaultMsg } = obj
                    ? NotificationStandards[obj.type]
                    : { icon: "", classes: "", defaultMsg: "" };
                return (
                    <div
                        key={index}
                        role="alert"
                        className={`flex gap-4
                    items-center px-5 py-3.5 max-w-full rounded-lg transition-all duration-300 ease-in-out transform
                    border-l-8 ${classes} 
                    ${obj.isVisible && !obj.isFading ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
                    >
                        {icon}
                        <span className="font-semibold">{obj?.msg || defaultMsg}</span>
                        <button
                            type="button"
                            onClick={() => obj.destroy()}
                            aria-label="Close notification"
                            className="ml-auto text-lg">
                            <IoClose className="h-5 w-5 text-inherit" />
                        </button>
                    </div>
                );
            })}
        </div>
    )
};