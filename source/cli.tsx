#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import React from 'react';
import App from './app.js';
import {ScreenState} from './types/index.js';

const cli = meow(
	`
	minesweeper
	Play the classic game of minesweeper in your terminal

	USAGE:
		minesweeper

	FLAGS:
		--help			Prints help information
		--version		Prints version information
		-S, --start  		Quickly starts the game without the menu
		-C, --credits		Shows the list of contributors that made this game possible

	EXAMPLE:
		minesweeper --start
`,
	{
		importMeta: import.meta,
		flags: {
			start: {
				type: 'boolean',
				shortFlag: 'S',
			},
			credits: {
				type: 'boolean',
				shortFlag: 'C',
			},
		},
	},
);

let screen: ScreenState;

if (cli.flags.start) {
	screen = 'start';
} else if (cli.flags.credits) {
	screen = 'credits';
}

// Used to hide terminal prompt before rendering the App
console.clear();

render(<App initialScreen={screen} />);
