import {Text} from 'ink';
import BigText, {BigTextProps} from 'ink-big-text';
import React from 'react';
import {useWindowSize} from '../../hooks/useWindowSize.js';

export function Title(props: BigTextProps) {
	const {text, colors} = props;
	const {width} = useWindowSize();
	const isLargeWindow: boolean = width > 90;

	return isLargeWindow ? (
		<BigText {...props} />
	) : (
		<Text color={colors && colors[0]}>{text}</Text>
	);
}
