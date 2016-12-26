export interface MiniSignalBinding {
	detach (): boolean;
}

export interface MiniSignal {
	MiniSignalBinding: { new (): MiniSignalBinding };
	new (): MiniSignal;
	handlers (exists?: boolean): MiniSignalBinding[];
	has (node: MiniSignalBinding): boolean;
	dispatch (...args: any[]): boolean;
	add (fn: Function, thisArg?: any): MiniSignalBinding;
	once (fn: Function, thisArg?: any): MiniSignalBinding;
	detach (node: MiniSignalBinding): this | null;
	detachAll (): this | null;
}

export default MiniSignal;