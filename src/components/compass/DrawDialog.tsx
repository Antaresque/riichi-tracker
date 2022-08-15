import { useState } from 'react';
import { useImmer } from 'use-immer';
import { Game } from '../../data/interfaces';
import { nextWind, TileCode } from '../../lib/hand';
import { useDb } from '../../providers/DbProvider';
import Button from '../Button';
import Toggle from '../Toggle';
import ToggleOnOff from '../ToggleOnOff';
import TileButton from '../calculator/TileButton';
import CustomDialog from '../layout/CustomDialog';
import HorizontalRow from '../layout/HorizontalRow';

export function DrawDialog({ gameId, game, onClose }: { gameId: string; game: Game; onClose: () => void }) {
	const db = useDb();

	const { bottomWind, roundWind, round, repeats } = game;

	const [drawType, setDrawType] = useState<'exhaustive' | 'abortive'>('exhaustive');
	const [drawRepeat, setDrawRepeat] = useState(false);
	const [tenpaiPlayers, updateTenpaiPlayers] = useImmer(new Set<number>());

	const submitDraw = async () => {
		if (drawType === 'abortive') {
			await db.setGame(gameId, {
				...game,
				repeats: game.repeats + 1,
				riichi: [false, false, false, false],
			});
		} else {
			const scores_ = game.scores.slice();
			const win = [0, 3000, 1500, 1000, 0][tenpaiPlayers.size];
			const lose = [0, 1000, 1500, 3000, 0][tenpaiPlayers.size];
			for (const i of [0, 1, 2, 3]) {
				if (tenpaiPlayers.has(i)) {
					scores_[i] += win;
				} else {
					scores_[i] -= lose;
				}
			}
			const repeat = drawRepeat && [0, 1, 2, 3].some((i) => tenpaiPlayers.has(i) && nextWind(bottomWind, i) === '1');
			await db.setGame(gameId, {
				...game,
				bottomWind: repeat ? bottomWind : nextWind(bottomWind, -1),
				roundWind: repeat ? roundWind : round === 4 ? nextWind(roundWind) : roundWind,
				round: repeat ? round : round === 4 ? 1 : round + 1,
				repeats: repeats + 1,
				scores: scores_,
				riichi: [false, false, false, false],
			});
		}
		onClose();
	};

	return (
		<CustomDialog onClose={onClose}>
			<div className="flex flex-col justify-center items-center gap-y-2 w-[232px] lg:w-80">
				<form
					className="flex flex-col justify-center items-center gap-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						void submitDraw();
					}}
				>
					<p className="text-xl lg:text-2xl">Draw</p>
					<Toggle
						left="Exhaustive"
						right="Abortive"
						toggled={drawType === 'abortive'}
						onToggle={(b) => setDrawType(b ? 'abortive' : 'exhaustive')}
					/>
					{drawType === 'exhaustive' && (
						<>
							<p className="text-xl lg:text-2xl">Players in Tenpai</p>
							<HorizontalRow>
								{[0, 1, 2, 3].map((i) => (
									<TileButton
										key={i}
										tile={`${nextWind(bottomWind, i)}z` as TileCode}
										dora={tenpaiPlayers.has(i)}
										onClick={() => {
											if (nextWind(bottomWind, i) === '1') {
												setDrawRepeat(!tenpaiPlayers.has(i));
											}
											updateTenpaiPlayers((s) => {
												if (s.has(i)) {
													s.delete(i);
												} else {
													s.add(i);
												}
											});
										}}
									/>
								))}
							</HorizontalRow>
							<ToggleOnOff toggled={drawRepeat} onToggle={(b) => setDrawRepeat(b)}>
								Repeat Round
							</ToggleOnOff>
						</>
					)}
				</form>
				<Button
					onClick={() => {
						void submitDraw();
					}}
				>
					Submit
				</Button>
			</div>
		</CustomDialog>
	);
}
