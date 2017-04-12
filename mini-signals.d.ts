declare module "mini-signals" {
    class MiniSignal {
        constructor();
        handlers(exists?: boolean): MiniSignalBinding[] | boolean;
        has(node: MiniSignalBinding): boolean;
        dispatch(...args: any[]): boolean;
        add(fn: Function, thisArg?: any): MiniSignalBinding;
        once(fn: Function, thisArg?: any): MiniSignalBinding;
        detach(node: MiniSignalBinding): MiniSignal;
        detachAll(): MiniSignal;
    }
    
    interface MiniSignalBinding {
        detach(): void;
    }
    
    export = MiniSignal;
}
