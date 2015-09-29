// exports default, used for rollup -> babel -> umd
import {MiniSignal, MiniSignalBinding} from './src/mini-signals';
MiniSignal.MiniSignalBinding = MiniSignalBinding;
export default MiniSignal;
