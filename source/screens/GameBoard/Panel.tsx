import {Box} from 'ink';
import React from 'react';

interface Props {
	children: React.ReactNode;
}

export const Panel = ({children}: Props) => {
	return (
		<Box
			width={30}
			height={10}
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			borderStyle="double"
			borderColor="#808080"
		>
			{children}
		</Box>
	);
};
