export interface MiniSignalBinding {
	detach (): boolean;
}

export interface MiniSignal {
	new (): MiniSignal;
	handlers (exists: boolean = false): MiniSignalBinding[];
	has (node: MiniSignalBinding): boolean;
	dispatch (...args: any[]): boolean;
	add (fn: Function, thisArg: any = null): MiniSignalBinding;
	once (fn: Function, thisArg: any = null): MiniSignalBinding;
	detach (node: MiniSignalBinding): this | null;
	detachAll (): this | null;
}

export default MiniSignal;