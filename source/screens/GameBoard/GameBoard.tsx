import {Box, Spacer, Text, useInput} from 'ink';
import BigText from 'ink-big-text';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import GameLogic, {Cell, GameState} from './GameLogic.js';

export const GameBoard = observer(() => {
	const [minesweeper] = useState(() => new GameLogic(9, 9, 10));
	const [x, y] = minesweeper.userPosition;

	const showTitleText = (gameStatus: GameState): string => {
		return gameStatus === 'loss' ? 'You Lose!' : 'You Won!';
	};

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
	});

	return (
		<Box
			height="80%"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			{minesweeper.gameStatus === 'win' ||
				(minesweeper.gameStatus === 'loss' && (
					<BigText text={showTitleText(minesweeper.gameStatus)} />
				))}
			<Box
				flexDirection="row"
				flexWrap="wrap"
				alignItems="flex-start"
				justifyContent="center"
			>
				<Box
					width={30}
					height={10}
					marginRight={5}
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					borderStyle="double"
					borderColor="#808080"
				>
					<Box marginTop={-1} marginBottom={1}>
						<Text color="yellowBright">
							{minesweeper.gameStatus === 'waitingForFirstMove' ||
							minesweeper.gameStatus === 'ongoing'
								? '😊 INFO 😊'
								: '😭 INFO 😭'}
						</Text>
					</Box>
					<Box height={5}>
						<Box flexDirection="column">
							<Text color="cyan">Position:</Text>
							<Spacer />
							<Text color="cyan">Mines:</Text>
							<Spacer />
							<Text color="cyan">Cells left:</Text>
						</Box>
						<Box flexDirection="column" alignItems="flex-end">
							<Text>{`[${x}, ${y}]`}</Text>
							<Spacer />
							<Text>{minesweeper.numberOfMines}</Text>
							<Spacer />
							<Text>{minesweeper.unrevealedCellsLeft}</Text>
						</Box>
					</Box>
				</Box>
				<Board game={minesweeper} />
			</Box>
		</Box>
	);
});

interface BoardProps {
	game: GameLogic;
}

const Board = ({game}: BoardProps) => {
	return (
		<Box flexDirection="row">
			{game.board.map((row: Cell[], i: number) => (
				<BoardRow key={i} track={i} row={row} game={game} />
			))}
		</Box>
	);
};

interface BoardRowProps extends BoardProps {
	track: number;
	row: Cell[];
}

const BoardRow = ({track, row, game}: BoardRowProps) => {
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
		return cell.isRevealed ? '#c0c0c0' : 'white';
	};

	const determineColor = (cell: Cell): string => {
		return cell.value === 1
			? '#061ef1'
			: cell.value === 2
			? '#3e792a'
			: cell.value === 3
			? '#df3524'
			: '#000080';
	};

	return (
		<Box flexDirection="column">
			{row.map((cell, i) => {
				return (
					<Text
						key={cell.id}
						backgroundColor={
							game.userPosition[0] === track && game.userPosition[1] === i
								? 'gray'
								: determineBackgroundColor(cell)
						}
						color={
							game.userPosition[0] === track && game.userPosition[1] === i
								? 'white'
								: determineColor(cell)
						}
						bold
					>
						{determineText(cell)}
					</Text>
				);
			})}
		</Box>
	);
};
