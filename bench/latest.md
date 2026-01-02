> mini-signals@2.1.0 bench:emit
> node ./bench/emit.ts

[ISOBENCH ENDED] IsoBench
node:events                   - 12,731,942 op/s. 50 samples in 5161 ms. 4.906x
primus/eventemitter3          - 19,639,550 op/s. 50 samples in 5104 ms. 7.568x
millermedeiros/js-signals     - 2,595,228 op/s. 50 samples in 5106 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 27,621,471 op/s. 50 samples in 5126 ms. 10.643x
Hypercubed/mini-signals@0.0.1 - 15,506,648 op/s. 50 samples in 5097 ms. 5.975x
Hypercubed/mini-signals@0.0.2 - 28,566,242 op/s. 50 samples in 5106 ms. 11.007x (BEST)
Hypercubed/mini-signals@1.0.1 - 24,713,081 op/s. 50 samples in 5114 ms. 9.523x
Hypercubed/mini-signals@1.2.0 - 24,555,791 op/s. 50 samples in 5117 ms. 9.462x

> mini-signals@2.1.0 bench:emit-bind
> node ./bench/emit-bind.ts

[ISOBENCH ENDED] IsoBench
node:events                   - 11,980,167 op/s. 50 samples in 5172 ms. 4.661x
primus/eventemitter3          - 19,404,499 op/s. 50 samples in 5105 ms. 7.549x
millermedeiros/js-signals     - 2,570,453 op/s. 50 samples in 5110 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 28,811,106 op/s. 50 samples in 5112 ms. 11.209x (BEST)
Hypercubed/mini-signals@0.0.1 - 14,748,489 op/s. 50 samples in 5121 ms. 5.738x
Hypercubed/mini-signals@0.0.2 - 27,228,636 op/s. 50 samples in 5118 ms. 10.593x
Hypercubed/mini-signals@1.0.1 - 23,282,511 op/s. 50 samples in 5097 ms. 9.058x
Hypercubed/mini-signals@1.2.0 - 23,079,796 op/s. 50 samples in 5200 ms. 8.979x

> mini-signals@2.1.0 bench:emit-context
> node ./bench/emit-context.ts

[ISOBENCH ENDED] IsoBench
node:events                   - 12,008,504 op/s. 50 samples in 5158 ms. 4.559x
primus/eventemitter3          - 21,411,378 op/s. 50 samples in 5098 ms. 8.128x
millermedeiros/js-signals     - 2,634,297 op/s. 50 samples in 5104 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 28,650,834 op/s. 50 samples in 5129 ms. 10.876x (BEST)
Hypercubed/mini-signals@0.0.1 - 14,571,092 op/s. 50 samples in 5112 ms. 5.531x
Hypercubed/mini-signals@0.0.2 - 27,505,224 op/s. 50 samples in 5107 ms. 10.441x
Hypercubed/mini-signals@1.0.1 - 23,372,749 op/s. 50 samples in 5100 ms. 8.872x
Hypercubed/mini-signals@1.2.0 - 26,521,993 op/s. 50 samples in 5104 ms. 10.068x

> mini-signals@2.1.0 bench:emit-deopt
> node ./bench/emit-deopt.ts

[ISOBENCH ENDED] IsoBench
node:events                   - 13,062,445 op/s. 50 samples in 5179 ms. 4.969x
primus/eventemitter3          - 21,628,236 op/s. 50 samples in 5113 ms. 8.228x
millermedeiros/js-signals     - 2,628,705 op/s. 50 samples in 5107 ms. 1.000x (WORST)
Hypercubed/mini-signals       - 32,058,217 op/s. 50 samples in 5121 ms. 12.195x (BEST)
Hypercubed/mini-signals@0.0.1 - 16,120,623 op/s. 50 samples in 5109 ms. 6.133x
Hypercubed/mini-signals@0.0.2 - 30,005,746 op/s. 50 samples in 5101 ms. 11.415x
Hypercubed/mini-signals@1.0.1 - 25,996,339 op/s. 50 samples in 5097 ms. 9.889x
Hypercubed/mini-signals@1.2.0 - 26,847,659 op/s. 50 samples in 5101 ms. 10.213x