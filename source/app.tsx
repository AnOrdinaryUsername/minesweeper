import {Box, Text, useApp} from 'ink';
import React, {useEffect, useState} from 'react';
import {useWindowSize} from './hooks/useWindowSize.js';
import {Credits} from './screens/Credits.js';
import {MainMenu} from './screens/MainMenu.js';
import {Scores} from './screens/Scores.js';
import {SelectDifficulty} from './screens/SelectDifficulty.js';
import {MenuItem, ScreenState} from './types/index.js';

type Props = {
	initialScreen: ScreenState;
};

export default function App({initialScreen = 'menu'}: Props) {
	const [currentScreen, setCurrentScreen] = useState(initialScreen);
	const {exit} = useApp();
	const {width, height} = useWindowSize();

	useEffect(() => {
		if (currentScreen === 'quit') {
			exit();
		}
	}, [currentScreen]);

	function handleSelect({value}: MenuItem<ScreenState>) {
		if (!value) {
			throw new Error(`Selected menu item is ${value}.`);
		}

		setCurrentScreen(value);
	}

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height={height}
			width={width}
		>
			<Box
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				borderStyle="round"
				borderColor="yellowBright"
				height="80%"
				width="80%"
			>
				{currentScreen === 'menu' && <MainMenu onSelect={handleSelect} />}
				{currentScreen === 'start' && (
					<SelectDifficulty handleInput={handleSelect} />
				)}
				{currentScreen === 'scores' && <Scores handleInput={handleSelect} />}
				{currentScreen === 'credits' && <Credits handleInput={handleSelect} />}
				{currentScreen === 'quit' && (
					<Text color="cyan">Thank you for playing our game!</Text>
				)}
			</Box>
		</Box>
	);
}
