export type ScreenState =
	| 'menu'
	| 'start'
	| 'scores'
	| 'credits'
	| 'quit'
	| undefined;

export interface MenuItem {
	label: string;
	value: ScreenState;
}
