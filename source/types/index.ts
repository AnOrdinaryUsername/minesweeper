export type ScreenState =
	| 'menu'
	| 'start'
	| 'scores'
	| 'credits'
	| 'quit'
	| undefined;

export interface MenuItem<T> {
	label: string;
	value: T;
}

export interface GoBack {
	handleInput: (screen: MenuItem<ScreenState>) => void;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert';
