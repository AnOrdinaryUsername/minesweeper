import {action, makeObservable, observable} from 'mobx';

const random = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min)) + min;

type GameState = 'waitingForFirstMove' | 'ongoing' | 'win' | 'loss';
type MovementDirection = 'left' | 'down' | 'up' | 'right';
export type Coordinates = [x: number, y: number];

enum CellState {
	Mine = -1,
	Empty = 0,
}

export interface Cell {
	isRevealed: boolean;
	hasMine: boolean;
	value: CellState | number;
}

export default class GameLogic {
	width: number;
	height: number;
	board: Cell[][];
	numberOfMines: number;
	userPosition: Coordinates;
	gameStatus: GameState;

	// Cells in an immediate area
	//  XXX
	//  XCX
	//  XXX
	private neighbors = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

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

		let mines = 0;
		// Randomly places mine on the board.
		// TODO: Make mines clump together
		while (mines < this.numberOfMines) {
			const randomColumn = random(0, this.width);
			const randomRow = random(0, this.height);

			const cellCoords: Coordinates = [randomRow, randomColumn];
			const cell = this.board[randomRow][randomColumn];

			// Cells immediately around the user coords are guranteed to not
			//  have a mine
			const neighborCoords = this.neighbors.map(neighbor => {
				const neighborX = x + neighbor[0];
				const neighborY = y + neighbor[1];
				return [neighborX, neighborY];
			});
			// Add currect user coords to protect it
			neighborCoords.push([x, y]);
			// If the random selected cell coords are in the protected area,
			// then we won't add a mine to that cell
			const isInProtectedArea = neighborCoords.some(
				neighbor =>
					neighbor[0] === cellCoords[0] && neighbor[1] === cellCoords[1],
			);

			if (!cell.hasMine && !cell.isRevealed && !isInProtectedArea) {
				mines += 1;
				cell.hasMine = true;
				cell.value = -1;
			}
		}

		this.createNumberCells();
		this.gameStatus = 'ongoing';
	}

	createNumberCells() {
		for (let row = 0; row < this.width; row++) {
			for (let column = 0; column < this.height; column++) {
				if (this.board[row][column].value === CellState.Empty) {
					this.board[row][column].value = this.getNumberofNeighboringMines(
						row,
						column,
					);
				}
			}
		}
	}

	getNumberofNeighboringMines(x: number, y: number): number {
		let minesCount = 0;

		for (const [dr, dc] of this.neighbors) {
			const newRow = x + dr;
			const newCol = y + dc;

			if (
				0 <= newRow &&
				newRow < this.board.length &&
				0 <= newCol &&
				newCol < this.board[0].length
			) {
				if (this.board[newRow][newCol].value === CellState.Mine) {
					minesCount += 1;
				}
			}
		}

		return minesCount;
	}

	selectCell(x: number, y: number) {
		const selectedCell = this.board[x][y];

		if (selectedCell.isRevealed) {
			return;
		}

		selectedCell.isRevealed = true;

		if (selectedCell.value === CellState.Empty) {
			for (const [dr, dc] of this.neighbors) {
				const newRow = x + dr;
				const newCol = y + dc;

				if (
					0 <= newRow &&
					newRow < this.board.length &&
					0 <= newCol &&
					newCol < this.board[0].length
				) {
					if (this.board[newRow][newCol].value === CellState.Empty) {
						this.selectCell(newRow, newCol);
					} else {
						this.board[newRow][newCol].isRevealed = true;
					}
				}
			}
		} else if (selectedCell.hasMine) {
			this.gameStatus = 'loss';
		}
	}
}
