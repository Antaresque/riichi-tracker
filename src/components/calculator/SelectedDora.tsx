import TileButton from './TileButton';
import { TileCode } from '../../lib/hand';
import { Placeholder } from '../Tile';

export default function SelectedDora({
	dora,
	onTileClick,
}: {
	dora: TileCode[];
	onTileClick?: (tile: TileCode, i: number) => void;
}) {
	return (
		<div className="flex flex-row gap-x-2 justify-center items-center min-w-min">
			<div className="flex flex-row gap-x-0.5">
				{dora.map((t, i) => <TileButton key={i} tile={t} onClick={onTileClick && ((t) => onTileClick(t, i))} />)}
			</div>
		</div>
	);
}
