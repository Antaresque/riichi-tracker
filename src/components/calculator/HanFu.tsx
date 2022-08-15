export default function HanFu({
	han,
	fu,
	onHanChange,
	onFuChange,
}: {
	han: number;
	fu: number;
	onHanChange?: (n: number) => void;
	onFuChange?: (n: number) => void;
}) {
	return (
		<div className="flex flex-row gap-x-2">
			<div className="flex flex-row justify-center items-center gap-x-2">
				<p className="text-2xl">Han</p>
				<input
					type="tel"
					className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-36 lg:w-80"
					value={han}
					onChange={(e) => {
						const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
						if (!isNaN(n)) {
							onHanChange?.(n);
						}
					}}
				/>
			</div>
			<div className="flex flex-row justify-center items-center gap-x-2">
				<p className="text-2xl">Fu</p>
				<input
					type="tel"
					className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-36 lg:w-80"
					value={fu}
					onChange={(e) => {
						const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
						if (!isNaN(n)) {
							onFuChange?.(n);
						}
					}}
				/>
			</div>
		</div>
	);
}