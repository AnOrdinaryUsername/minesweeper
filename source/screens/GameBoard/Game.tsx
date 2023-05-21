import {Box, Text, useInput} from 'ink';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {useWindowSize} from '../../hooks/useWindowSize.js';
import {Difficulty, GoBack} from '../../types/index.js';
import {Board} from './Board.js';
import GameLogic, {GameSettings} from './GameLogic.js';
import {Panel} from './Panel.js';

interface Settings {
	[key: string]: GameSettings;
}

const gameDifficulty: Settings = {
	beginner: {
		width: 9,
		height: 9,
		numberOfMines: 10,
	},
	intermediate: {
		width: 15,
		height: 15,
		numberOfMines: 40,
	},
	expert: {
		width: 20,
		height: 20,
		numberOfMines: 85,
	},
};

interface Props extends GoBack {
	difficulty: Difficulty;
}

export const Game = observer(({difficulty, handleInput}: Props) => {
	const setting = gameDifficulty[difficulty];
	const [minesweeper] = useState(() => new GameLogic({...setting}));
	const {width} = useWindowSize();
	const isWindowLarge = width > 85;

	// This is pretty scuffed, but don't remove the unused variables
	// or it won't render flag placement or position. MobX says to
	// wrap child components in observer, but it turns really laggy
	// when I do :(
	// @ts-ignore
	const [x, y] = minesweeper.userPosition;
	// @ts-ignore
	const hasFlag = minesweeper.board[x][y].hasFlag;

	useInput((input, key) => {
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
			}

			const [x, y] = minesweeper.userPosition;
			minesweeper.selectCell(x, y);
			minesweeper.checkWinner();
		}

		if (input === 'f') {
			const [x, y] = minesweeper.userPosition;
			minesweeper.toggleFlag(x, y);
		}

		// Go back to Menu
		if (key.ctrl && input === 'b') {
			handleInput({label: 'Menu', value: 'menu'});
		}
	});

	return (
		<Box
			height="80%"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			flexWrap="wrap"
		>
			<Box
				width="100%"
				flexDirection="row"
				flexWrap="wrap"
				alignItems="center"
				justifyContent="center"
				gap={3}
			>
				{isWindowLarge && (
					<Box flexDirection="column">
						<Panel>
							<Box marginTop={-1} marginBottom={1}>
								<Text color="yellowBright">
									{minesweeper.gameStatus === 'waitingForFirstMove' ||
									minesweeper.gameStatus === 'ongoing'
										? '😊 INFO 😊'
										: '😭 INFO 😭'}
								</Text>
							</Box>
							<Box height={5} width={20} justifyContent="space-between">
								<Box gap={1} flexDirection="column">
									<Text color="cyan">Status:</Text>
									<Text color="cyan">Mines:</Text>
									<Text color="cyan">Cells:</Text>
								</Box>
								<Box gap={1} flexDirection="column" alignItems="flex-end">
									<Text
										color={
											minesweeper.gameStatus === 'win'
												? 'green'
												: minesweeper.gameStatus === 'loss'
												? 'red'
												: 'yellow'
										}
									>
										{minesweeper.gameStatus === 'waitingForFirstMove'
											? '...'
											: minesweeper.gameStatus.toUpperCase()}
									</Text>
									<Text>{minesweeper.numberOfMines}</Text>
									<Text>{minesweeper.unrevealedCellsLeft}</Text>
								</Box>
							</Box>
						</Panel>
						<Panel>
							<Box marginTop={-1} marginBottom={1}>
								<Text color="green">CONTROLS</Text>
							</Box>
							<Box height={5} width={20} justifyContent="space-between">
								<Box gap={1} flexDirection="column">
									<Text color="cyan">Move:</Text>
									<Text color="cyan">Flag:</Text>
									<Text color="cyan">Select:</Text>
								</Box>
								<Box gap={1} flexDirection="column" alignItems="flex-end">
									<Text>↑ ↓ → ←</Text>
									<Text>F</Text>
									<Text>Enter</Text>
								</Box>
							</Box>
						</Panel>
					</Box>
				)}
				<Box
					flexDirection="column"
					alignItems="center"
					justifyContent="flex-start"
					height="100%"
					gap={1}
				>
					<Box
						width="100%"
						alignItems="flex-start"
						justifyContent="center"
						borderStyle="double"
						borderColor="#808080"
					>
						<Text>Press Ctrl + B to go back</Text>
					</Box>
					<Board game={minesweeper} />
				</Box>
			</Box>
		</Box>
	);
});
