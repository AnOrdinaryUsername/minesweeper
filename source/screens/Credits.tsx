import {Box, Spacer, Text, useInput} from 'ink';
import BigText from 'ink-big-text';
import React from 'react';
import {MenuItem} from '../types/index.js';

interface TeamInfo {
	name: string;
	githubLink: string;
	color: string;
}

const members: Array<TeamInfo> = [
	{
		name: 'Ismael Lopez',
		githubLink: 'https://github.com/ilopez93',
		color: 'cyan',
	},
	{
		name: 'Jacob Carlson',
		githubLink: 'https://github.com/jiink',
		color: 'cyan',
	},
	{
		name: 'Kyle Masa',
		githubLink: 'https://github.com/AnOrdinaryUsername',
		color: 'cyan',
	},
	{
		name: 'Ricky Truckner',
		githubLink: 'https://github.com/Ricky-Truckner',
		color: 'cyan',
	},
];

function Member({name, githubLink, color}: TeamInfo) {
	return (
		<Box width="50%" marginTop={1} flexDirection="row" justifyContent="center">
			<Text color={color}>{name}</Text>
			<Spacer />
			<Text>{githubLink}</Text>
		</Box>
	);
}

interface ScreenProps {
	handleInput: (screen: MenuItem) => void;
}

export function Credits({handleInput}: ScreenProps) {
	useInput(input => {
		// The back button to go back to main menu
		if (input === 'b') {
			handleInput({label: 'Menu', value: 'menu'});
		}
	});

	return (
		<Box
			height="80%"
			width="100%"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<BigText text="Credits" />
			{members.map((person: TeamInfo, index: number) => (
				<Member {...person} key={index} />
			))}
			<Box marginTop={2}>
				<Text backgroundColor="gray">[ Press B to go back ]</Text>
			</Box>
		</Box>
	);
}
