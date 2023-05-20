import {Box} from 'ink';
import BigText from 'ink-big-text';
import React from 'react';

export function Scores() {
	return (
		<Box
			height="50%"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<BigText text="Under" font="simple" />
			<BigText text="Construction" font="simple" />
		</Box>
	);
}
