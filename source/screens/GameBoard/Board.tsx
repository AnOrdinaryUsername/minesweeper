import { Box, Text } from 'ink';
import React from 'react';
import GameLogic, { Cell, Coordinates } from './GameLogic.js';

interface BoardProps {
	game: GameLogic;
}

export const Board = ({game}: BoardProps) => {
	return (
		<Box flexDirection="row">
			{game.board.map((row: Cell[], j: number) => (
				<Box key={j} flexDirection="column">
					{row.map((cell, col) => (
						<BoardCell
							track={j}
							column={col}
							coords={game.userPosition}
							key={cell.id}
							cell={cell}
						/>
					))}
				</Box>
			))}
		</Box>
	);
};

interface BoardCellProps {
	track?: number;
	cell: Cell;
	coords?: Coordinates;
	column?: number;
}

const BoardCell = ({track, column, cell, coords}: BoardCellProps) => {
	const isHovered = coords[0] === track && coords[1] === column;

	const determineText = (cell: Cell): string => {
		return cell.hasMine && cell.isRevealed
			? '💣'
			: cell.hasFlag
			? '🚩'
			: cell.value <= 0
			? '\u2009 '
			: cell.isRevealed
			? `\u2009${cell.value}`
			: '\u2009 ';
	};

	const determineBackgroundColor = (cell: Cell): string => {
		return isHovered ? 'gray' : cell.isRevealed ? '#c0c0c0' : 'white';
	};

	const determineColor = (cell: Cell): string => {
		return isHovered
			? 'white'
			: cell.value === 1
			? '#061ef1'
			: cell.value === 2
			? '#3e792a'
			: cell.value === 3
			? '#df3524'
			: '#000080';
	};
	return (
		<Text
			backgroundColor={determineBackgroundColor(cell)}
			color={determineColor(cell)}
			bold
		>
			{determineText(cell)}
		</Text>
	);
};
