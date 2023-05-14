import {useStdout} from 'ink';
import {useEffect, useState} from 'react';

interface Size {
	width: number;
	height: number;
}

export function useWindowSize(): Size {
	const {stdout} = useStdout();

	const [windowSize, setWindowSize] = useState<Size>(() => ({
		width: stdout.columns,
		height: stdout.rows,
	}));

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: stdout.columns,
				height: stdout.rows,
			});
		}

		stdout.on('resize', handleResize);
		return () => void stdout.off('resize', handleResize);
	}, [stdout]);

	return windowSize;
}
