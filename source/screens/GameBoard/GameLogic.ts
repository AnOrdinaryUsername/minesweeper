import {action, makeAutoObservable, observable} from 'mobx';

const random = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min)) + min;

type MovementDirection = 'left' | 'down' | 'up' | 'right';
type CurrentPosition = [x: number, y: number];

interface Cell {
	isEmpty: boolean;
	hasMine: boolean;
	minesAround: number;
}

export default class GameLogic {
	width: number;
	height: number;
	board: Cell[][];
	numberOfMines: number;
	userPosition: CurrentPosition;

	constructor(width: number, height: number, numberOfMines: number) {
		this.width = width;
		this.height = height;

		// Creates a 2D array
		this.board = Array(width)
			.fill([])
			.map(() =>
				Array(height).fill({
					isEmpty: true,
					hasMine: false,
					minesAround: 0,
				}),
			);

		this.numberOfMines = numberOfMines;
		this.userPosition = [0, 0];

		// Tracks state changes made to the object
		makeAutoObservable(this, {
			width: observable,
			height: observable,
			board: observable,
			numberOfMines: observable,
			userPosition: observable,
			move: action,
			createMines: action,
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

	createMines() {
		let count = 0;

		while (count < this.numberOfMines) {
			const randomColumn = random(0, this.width);
			const randomRow = random(0, this.height);

			if (this.board[randomRow][randomColumn]?.isEmpty) {
				count += 1;
				this.board[randomRow][randomColumn].hasMine = true;
				this.board[randomRow][randomColumn].isEmpty = false;
			}
		}
	}
}
