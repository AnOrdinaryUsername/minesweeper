import {Box, Text} from 'ink';
import BigText from 'ink-big-text';
import SelectInput from 'ink-select-input';
import React from 'react';
import {MenuItem} from '../types/index.js';

const menuItems: Array<MenuItem> = [
	{
		label: 'Start',
		value: 'start',
	},
	{
		label: 'Scores',
		value: 'scores',
	},
	{
		label: 'Credits',
		value: 'credits',
	},
	{
		label: 'Quit',
		value: 'quit',
	},
];

interface Props {
	onSelect: (MenuItem: MenuItem) => void;
}

export function MainMenu({onSelect}: Props) {
	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			width="100%"
		>
			<BigText text="Minesweeper" font="slick" colors={['green']} />
			<SelectInput items={menuItems} onSelect={onSelect} />
			<Box marginTop={4}>
				<Text color="gray">A project by the Boolean Bozos</Text>
			</Box>
		</Box>
	);
}
