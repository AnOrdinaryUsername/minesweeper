import {makeAutoObservable} from 'mobx';

type MovementDirection = 'left' | 'down' | 'up' | 'right';
type CurrentPosition = [x: number, y: number];

export default class GameLogic {
	width: number;
	height: number;
	board: string[][];
	numberOfMines: number;
	userPosition: CurrentPosition;

	constructor(width: number, height: number, numberOfMines: number) {
		this.width = width;
		this.height = height;

		// Creates a 2D array
		this.board = Array.from({length: height}, () =>
			Array.from({length: width}, () => ' '),
		);

		this.numberOfMines = numberOfMines;
		this.userPosition = [0, 0];

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
}
