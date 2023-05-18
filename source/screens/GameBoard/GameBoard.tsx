import {Box, Text, useInput} from 'ink';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import GameLogic, {Cell, CurrentPosition} from './GameLogic.js';

export const GameBoard = observer(() => {
	const [minesweeper] = useState(() => new GameLogic(9, 9, 10));

	useInput((a, key) => {
		if (key.upArrow) {
			minesweeper.move('up');
		}

		if (key.downArrow) {
			minesweeper.move('down');
		}

		if (key.leftArrow) {
			minesweeper.move('left');
		}

		if (key.rightArrow) {
			minesweeper.move('right');
		}

		if (key.return) {
			if (minesweeper.gameStatus === 'waitingForFirstMove') {
				minesweeper.generateMinesAfterFirstMove();
			} else {
				minesweeper.selectCell();
			}
		}

		if (a === 'b') {
			const [x, y] = minesweeper.userPosition;
			console.log(JSON.stringify(minesweeper.board[x][y]));
		}
	});

	return (
		<Box
			height="80%"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Text>{`Position = [${minesweeper.userPosition[0].toString()}, ${minesweeper.userPosition[1].toString()}]`}</Text>
			<Text>{`Revealed? = ${
				minesweeper.board[minesweeper.userPosition[0]][
					minesweeper.userPosition[1]
				].isRevealed
			}`}</Text>
			<Text>{`Mine? = ${
				minesweeper.board[minesweeper.userPosition[0]][
					minesweeper.userPosition[1]
				].hasMine
			}`}</Text>
			<Text>{`Value? = ${minesweeper.board[minesweeper.userPosition[0]][
				minesweeper.userPosition[1]
			].value.toString()}`}</Text>
			<Box flexDirection="row">
				{minesweeper.board.map((row, i) => (
					<BoardRow
						key={i}
						track={i}
						row={row}
						userPosition={minesweeper.userPosition}
					/>
				))}
			</Box>
		</Box>
	);
});

interface BoardRowProps {
	track: number;
	row: Cell[];
	userPosition: CurrentPosition;
}

function BoardRow({track, row, userPosition}: BoardRowProps) {
	return (
		<Box flexDirection="column">
			{row.map((cell, i) => {
				return (
					<Text
						key={i}
						backgroundColor={
							userPosition[0] === track && userPosition[1] === i
								? 'gray'
								: 'white'
						}
						bold
					>
						{cell.hasMine && cell.isRevealed
							? 'M'
							: cell.value <= 0
							? ' '
							: cell.value}
					</Text>
				);
			})}
		</Box>
	);
}
