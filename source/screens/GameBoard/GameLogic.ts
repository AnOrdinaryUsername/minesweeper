import {makeAutoObservable} from 'mobx';
import {nanoid} from 'nanoid';

const random = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min)) + min;

export type GameState = 'waitingForFirstMove' | 'ongoing' | 'win' | 'loss';
type MovementDirection = 'left' | 'down' | 'up' | 'right';
export type Coordinates = [x: number, y: number];

enum CellState {
	Mine = -1,
	Empty = 0,
}

export interface Cell {
	isRevealed: boolean;
	hasMine: boolean;
	hasFlag: boolean;
	value: CellState | number;
	id: string;
}

export interface GameSettings {
	width: number;
	height: number;
	numberOfMines: number;
}

export default class GameLogic {
	width: number;
	height: number;
	board: Cell[][];
	numberOfMines: number;
	userPosition: Coordinates;
	gameStatus: GameState;
	unrevealedCellsLeft: number;

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

	constructor({width, height, numberOfMines}: GameSettings) {
		this.width = width;
		this.height = height;
		this.gameStatus = 'waitingForFirstMove';
		this.numberOfMines = numberOfMines;
		this.unrevealedCellsLeft = height * width - numberOfMines;
		this.userPosition = [0, 0];

		// Creates a 2D array
		this.board = Array(width)
			.fill([])
			.map(() =>
				Array(height)
					.fill({
						isRevealed: false,
						hasMine: false,
						hasFlag: false,
						value: CellState.Empty,
					})
					.map(e => ({
						...e,
						id: nanoid(),
					})),
			);

		// Tracks state changes made to the object
		makeAutoObservable(this);
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
			const protectedCoords = this.neighbors.map(neighbor => {
				const neighborX = x + neighbor[0];
				const neighborY = y + neighbor[1];
				return [neighborX, neighborY];
			});
			// Add currect user coords to protect it
			protectedCoords.push([x, y]);
			// If the random selected cell coords are in the protected area,
			// then we won't add a mine to that cell
			const isInProtectedArea = protectedCoords.some(
				coords => coords[0] === cellCoords[0] && coords[1] === cellCoords[1],
			);

			if (!cell.hasMine && !isInProtectedArea) {
				mines += 1;
				cell.hasMine = true;
				cell.value = CellState.Mine;
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

		if (selectedCell.isRevealed || selectedCell.hasFlag) {
			return;
		}

		selectedCell.isRevealed = true;
		this.unrevealedCellsLeft -= 1;

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
					const neighbor = this.board[newRow][newCol];

					if (neighbor.value === CellState.Empty) {
						this.selectCell(newRow, newCol);
					} else {
						if (!neighbor.isRevealed) {
							neighbor.isRevealed = true;
							this.unrevealedCellsLeft -= 1;
						}
					}
				}
			}
		} else if (selectedCell.hasMine) {
			this.gameStatus = 'loss';
			this.revealBoard();
		}
	}

	toggleFlag(x: number, y: number) {
		const cell = this.board[x][y];

		if (this.gameStatus === 'waitingForFirstMove' || cell.isRevealed) {
			return;
		}

		this.board[x][y].hasFlag = !cell.hasFlag;
	}

	checkWinner() {
		if (this.unrevealedCellsLeft === 0) {
			this.gameStatus = 'win';
		}
	}

	revealBoard() {
		for (let row = 0; row < this.width; row++) {
			for (let column = 0; column < this.height; column++) {
				this.board[row][column].isRevealed = true;
			}
		}
	}
}
