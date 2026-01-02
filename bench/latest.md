```
> mini-signals@2.1.0 bench:emit
> node ./bench/emit.ts

[ISOBENCH ENDED] emit
[GROUP ENDED] Burn-in
Theory                        - 147,496,068 op/s. 50 samples in 5100 ms. 1.000x (WORST)
[GROUP ENDED] 
node:events                   - 12,728,397 op/s. 50 samples in 5186 ms. 4.895x
primus/eventemitter3          - 20,356,592 op/s. 50 samples in 5097 ms. 7.828x
millermedeiros/js-signals     - 2,600,472 op/s. 50 samples in 5114 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 28,925,543 op/s. 50 samples in 5117 ms. 11.123x
Hypercubed/mini-signals@0.0.1 - 15,825,643 op/s. 50 samples in 5103 ms. 6.086x
Hypercubed/mini-signals@0.0.2 - 30,081,916 op/s. 50 samples in 5109 ms. 11.568x (BEST)
Hypercubed/mini-signals@1.0.1 - 26,054,874 op/s. 50 samples in 5133 ms. 10.019x
Hypercubed/mini-signals@1.2.0 - 25,628,196 op/s. 50 samples in 5105 ms. 9.855x
Hypercubed/mini-signals@2.0.0 - 28,707,491 op/s. 50 samples in 5114 ms. 11.039x
Morglod/tseep                 - 28,711,663 op/s. 50 samples in 5123 ms. 11.041x

> mini-signals@2.1.0 bench:emit-bind
> node ./bench/emit-bind.ts

[ISOBENCH ENDED] emit bound context
node:events                   - 11,719,198 op/s. 50 samples in 5166 ms. 4.741x
primus/eventemitter3          - 18,894,817 op/s. 50 samples in 5128 ms. 7.644x
millermedeiros/js-signals     - 2,471,848 op/s. 50 samples in 5187 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 25,398,260 op/s. 50 samples in 5148 ms. 10.275x
Hypercubed/mini-signals@0.0.1 - 13,859,581 op/s. 50 samples in 5116 ms. 5.607x
Hypercubed/mini-signals@0.0.2 - 27,927,049 op/s. 50 samples in 5106 ms. 11.298x (BEST)
Hypercubed/mini-signals@1.0.1 - 23,317,292 op/s. 50 samples in 5116 ms. 9.433x
Hypercubed/mini-signals@1.2.0 - 21,610,270 op/s. 50 samples in 5099 ms. 8.743x

> mini-signals@2.1.0 bench:emit-context
> node ./bench/emit-context.ts

[ISOBENCH ENDED] emit with context
node:events                   - 11,506,409 op/s. 50 samples in 5180 ms. 4.485x
primus/eventemitter3          - 19,436,442 op/s. 50 samples in 5103 ms. 7.576x
millermedeiros/js-signals     - 2,565,600 op/s. 50 samples in 5118 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 25,526,078 op/s. 50 samples in 5117 ms. 9.949x
Hypercubed/mini-signals@0.0.1 - 14,046,690 op/s. 50 samples in 5104 ms. 5.475x
Hypercubed/mini-signals@0.0.2 - 28,077,154 op/s. 50 samples in 5101 ms. 10.944x (BEST)
Hypercubed/mini-signals@1.0.1 - 23,631,291 op/s. 50 samples in 5107 ms. 9.211x
Hypercubed/mini-signals@1.2.0 - 24,359,810 op/s. 50 samples in 5095 ms. 9.495x

> mini-signals@2.1.0 bench:emit-deopt
> node ./bench/emit-deopt.ts

[ISOBENCH ENDED] emit deopt
node:events                   - 12,367,573 op/s. 50 samples in 5167 ms. 4.801x
primus/eventemitter3          - 20,170,767 op/s. 50 samples in 5099 ms. 7.830x
millermedeiros/js-signals     - 2,576,033 op/s. 50 samples in 5119 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 28,495,856 op/s. 50 samples in 5110 ms. 11.062x (BEST)
Hypercubed/mini-signals@0.0.1 - 15,298,449 op/s. 50 samples in 5108 ms. 5.939x
Hypercubed/mini-signals@0.0.2 - 28,185,111 op/s. 50 samples in 5108 ms. 10.941x
Hypercubed/mini-signals@1.0.1 - 24,675,261 op/s. 50 samples in 5108 ms. 9.579x
Hypercubed/mini-signals@1.2.0 - 24,762,618 op/s. 50 samples in 5112 ms. 9.613x

> mini-signals@2.1.0 bench:emit-single
> node ./bench/emit-single.ts

[ISOBENCH ENDED] emit single
node:events                   - 67,752,892 op/s. 50 samples in 5128 ms. 5.964x
primus/eventemitter3          - 90,505,558 op/s. 50 samples in 5100 ms. 7.966x
millermedeiros/js-signals     - 11,360,778 op/s. 50 samples in 5119 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 117,687,705 op/s. 50 samples in 5123 ms. 10.359x
Hypercubed/mini-signals@0.0.1 - 95,522,608 op/s. 50 samples in 5122 ms. 8.408x
Hypercubed/mini-signals@0.0.2 - 110,783,617 op/s. 50 samples in 5112 ms. 9.751x
Hypercubed/mini-signals@1.0.1 - 95,301,536 op/s. 50 samples in 5106 ms. 8.389x
Hypercubed/mini-signals@1.2.0 - 99,270,995 op/s. 50 samples in 5103 ms. 8.738x
Hypercubed/mini-signals@2.0.0 - 117,317,037 op/s. 50 samples in 5115 ms. 10.326x
JacobFischer/ts-typed-events  - 44,879,558 op/s. 50 samples in 5122 ms. 3.950x
tseep/eventemitter            - 133,336,526 op/s. 50 samples in 5119 ms. 11.737x (BEST)

> mini-signals@2.1.0 bench:emit-async
> node ./bench/emit-async.ts


# async emit benchmarks
Burn-in x 3,622,624 ops/sec ±1.95% (83 runs sampled)
Hypercubed/mini-signals dispatch x 15,043,604 ops/sec ±1.61% (90 runs sampled)
Hypercubed/mini-signals dispatchSerial x 1,801,783 ops/sec ±2.12% (79 runs sampled)
Hypercubed/mini-signals dispatchParallel x 1,281,908 ops/sec ±1.93% (78 runs sampled)
emittery emitSerial x 470,600 ops/sec ±0.57% (83 runs sampled)
emittery emit (parallel) x 256,013 ops/sec ±0.82% (88 runs sampled)
eventemitter2 emitAsync (parallel) x 1,215,348 ops/sec ±0.83% (83 runs sampled)
```