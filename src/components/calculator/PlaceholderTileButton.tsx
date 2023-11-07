import clsx from "clsx";
import { ReactNode } from "react";

export default function PlaceholderTileButton({
	active = false,
	disabled = false,
	onClick,
	children,
}: {
	active?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	children?: ReactNode;
}) {
	return (
		<div
        onClick={(e) => {
            e.preventDefault();
            onClick?.();
        }}
        hidden={disabled}
        className={clsx(
            'h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[3.75rem] lg:min-w-[3.75rem] p-2 rounded-xl border-2 border-black dark:border-white border-dashed \
            hover:bg-gray-400 hover:cursor-pointer text-2xl font-bold flex justify-center items-center select-none',
            active ? 'bg-gray-700' : '',
            disabled ? 'hidden' : '',
            )}>
            {children}
        </div>
	);
}