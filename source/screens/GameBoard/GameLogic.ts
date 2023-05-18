import {action, makeObservable, observable} from 'mobx';

const random = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min)) + min;

type GameState = 'waitingForFirstMove' | 'ongoing' | 'win' | 'loss';
type MovementDirection = 'left' | 'down' | 'up' | 'right';
export type CurrentPosition = [x: number, y: number];

export interface Cell {
	isRevealed: boolean;
	hasMine: boolean;
	value: number; // -1 = Mine, 0 = Empty, 1-4 = Mines around cell
}

export default class GameLogic {
	width: number;
	height: number;
	board: Cell[][];
	numberOfMines: number;
	userPosition: CurrentPosition;
	gameStatus: GameState;

	constructor(width: number, height: number, numberOfMines: number) {
		this.width = width;
		this.height = height;
		this.gameStatus = 'waitingForFirstMove';

		// Creates a 2D array
		this.board = Array(width)
			.fill([])
			.map(() =>
				Array(height).fill({
					isRevealed: false,
					hasMine: false,
					value: 0,
				}),
			);

		this.numberOfMines = numberOfMines;
		this.userPosition = [0, 0];

		// Tracks state changes made to the object
		makeObservable(this, {
			width: observable,
			height: observable,
			board: observable,
			numberOfMines: observable,
			userPosition: observable,
			move: action,
			generateMinesAfterFirstMove: action,
			selectCell: action,
		});
	}

	move(direction: MovementDirection) {
		let tempX = this.userPosition[0];
		let tempY = this.userPosition[1];

		switch (direction) {
			case 'down':
				tempY += 1;
				break;
			case 'up':
				tempY -= 1;
				break;
			case 'left':
				tempX -= 1;
				break;
			case 'right':
				tempX += 1;
				break;
		}

		this.userPosition[0] = Math.max(0, Math.min(tempX, this.width - 1));
		this.userPosition[1] = Math.max(0, Math.min(tempY, this.height - 1));
	}

	generateMinesAfterFirstMove() {
		const [x, y] = this.userPosition;
		this.board[x][y].isRevealed = true;

		// Loop to immediately mark the cell around the user selected cell
		// with empty cells
		let i, j;
		for (i = x - 1, j = x + 2; i < j; i++) {
			if (i >= 0 && i < this.width) {
				// Reveal cells to the left and right of user selected cell
				this.board[i][y].isRevealed = true;

				// Checks if bottom is in bounds
				if (y - 1 >= 0) {
					this.board[i][y - 1].isRevealed = true;
				}

				// Checks if top is in bounds
				if (y + 1 < this.height) {
					this.board[i][y + 1].isRevealed = true;
				}
			}
		}

		let mines = 0;

		while (mines < this.numberOfMines) {
			const randomColumn = random(0, this.width);
			const randomRow = random(0, this.height);

			const cell = this.board[randomRow][randomColumn];

			if (!cell.hasMine && !cell.isRevealed) {
				mines += 1;
				cell.hasMine = true;
				cell.value = -1;
			} else {
				// If a cell was alread revealed or akready had a mine, we try again
				mines -= 1;
			}
		}

		this.gameStatus = 'ongoing';
	}

	selectCell() {
		const [x, y] = this.userPosition;
		const selectedCell = this.board[x][y];

		if (selectedCell.isRevealed) {
			return;
		}

		selectedCell.isRevealed = true;

		if (selectedCell.hasMine) {
			this.gameStatus = 'loss';
		}
	}
}
