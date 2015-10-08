// exports default, used for rollup -> babel -> umd
import {MiniSignal, MiniSignalBinding} from './mini-signals';
MiniSignal.MiniSignalBinding = MiniSignalBinding;
export default MiniSignal;
