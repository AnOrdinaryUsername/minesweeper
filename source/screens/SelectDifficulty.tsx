import {Box} from 'ink';
import SelectInput from 'ink-select-input';
import React, {useState} from 'react';
import {Difficulty, GoBack, MenuItem} from '../types/index.js';
import {Game} from './GameBoard/Game.js';
import {Title} from './components/Title.js';

const choices: Array<MenuItem<Difficulty>> = [
	{
		label: 'Beginner',
		value: 'beginner',
	},
	{
		label: 'Intermediate',
		value: 'intermediate',
	},
	{
		label: 'Expert',
		value: 'expert',
	},
];

export function SelectDifficulty({handleInput}: GoBack) {
	const [choice, setChoice] = useState<Difficulty>();

	function makeChoice({value}: MenuItem<Difficulty>) {
		setChoice(value);
	}

	return !choice ? (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			width="100%"
		>
			<Title text="Difficulty" colors={['red']} />
			<SelectInput items={choices} onSelect={makeChoice} />
		</Box>
	) : (
		<Game difficulty={choice} handleInput={handleInput} />
	);
}
