import {Box, Text, useInput} from 'ink';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import GameLogic from './GameLogic.js';

export const GameBoard = observer(() => {
	const [minesweeper] = useState(() => new GameLogic(9, 9, 10));

	useInput((_, key) => {
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
			minesweeper.createMines();
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
			<Box flexDirection="column">
				{minesweeper.board.map((row, j) => {
					return (
						<Box key={`box-${j}`}>
							{row.map((cell, i) => {
								return minesweeper.userPosition[0] === i &&
									minesweeper.userPosition[1] === j ? (
									<Text backgroundColor="gray" key={`cell-${j}-${i}`} bold>
										{cell.hasMine ? 'B' : ' '}
									</Text>
								) : (
									<Text backgroundColor="white" key={`cell-${j}-${i}`} bold>
										{cell.hasMine ? 'B' : ' '}
									</Text>
								);
							})}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
});
