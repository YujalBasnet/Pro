# Functions Catalog (417)

This calculator includes 417 functions grouped as follows:

- Core math: 20
- Extra math: 7
- Trig + inverse (with explicit DEG/RAD/GRAD variants): 60
- Hyperbolic + inverse: 12
- Constants (as zero-arg functions): 11
- Number theory and combinatorics: 20
- Statistics: 24
- Bitwise: 10
- Finance: 12
- Geometry: 19
- Random: 6
- Angle conversions: 6
- Length conversions: 210

## Length conversions

Length conversion functions are generated as:

```
<from>_to_<to>(value)
```

Units used:

- m, km, cm, mm, um, nm
- inch, foot, yard, mile, nmi, mil
- angstrom, au, ly

Example: `km_to_m(1.5)`.

## Statistics notes

- `cov` and `corr` accept an even number of arguments and split them in half
  (first half is X, second half is Y).
- `percentile(p, values...)` expects p in [0, 100].
- `quantile(q, values...)` expects q in [0, 1].
