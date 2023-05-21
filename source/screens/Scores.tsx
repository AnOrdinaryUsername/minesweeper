import {Box, Text, useInput} from 'ink';
import React from 'react';
import {GoBack} from '../types/index.js';
import {Title} from './components/Title.js';

export function Scores({handleInput}: GoBack) {
	useInput(input => {
		// The back button to go back to main menu
		if (input === 'b') {
			handleInput({label: 'Menu', value: 'menu'});
		}
	});

	return (
		<Box
			height="50%"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			gap={2}
		>
			<Box flexDirection="column" alignItems="center" justifyContent="center">
				<Title text="Under" font="simple" />
				<Title text="Construction" font="simple" />
			</Box>
			<Text backgroundColor="gray">[ Press B to go back ]</Text>
		</Box>
	);
}
