package calc.engine;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public final class FunctionRegistry {
    private static final int EXPECTED_FUNCTION_COUNT = 417;
    private final Map<String, FunctionDef> functions = new LinkedHashMap<>();

    public static FunctionRegistry createDefault() {
        FunctionRegistry registry = new FunctionRegistry();
        registry.registerCoreMath();
        registry.registerExtraMath();
        registry.registerTrig();
        registry.registerHyperbolic();
        registry.registerConstants();
        registry.registerNumberTheory();
        registry.registerStatistics();
        registry.registerBitwise();
        registry.registerFinance();
        registry.registerGeometry();
        registry.registerRandom();
        registry.registerAngleConversions();
        registry.registerLengthConversions();
        registry.verifyCount();
        return registry;
    }

    public FunctionDef get(String name) {
        return functions.get(normalize(name));
    }

    public boolean contains(String name) {
        return functions.containsKey(normalize(name));
    }

    public int getFunctionCount() {
        return functions.size();
    }

    public List<String> getFunctionNames() {
        List<String> names = new ArrayList<>(functions.keySet());
        names.sort(Comparator.naturalOrder());
        return names;
    }

    private void verifyCount() {
        if (functions.size() != EXPECTED_FUNCTION_COUNT) {
            throw new IllegalStateException("Expected " + EXPECTED_FUNCTION_COUNT + " functions, found " + functions.size());
        }
    }

    private void register(String name, int minArgs, int maxArgs, FunctionDef.CalcFunction fn, String description) {
        String key = normalize(name);
        if (functions.containsKey(key)) {
            throw new IllegalStateException("Duplicate function: " + key);
        }
        functions.put(key, new FunctionDef(key, minArgs, maxArgs, fn, description));
    }

    private void alias(String alias, String target) {
        String aliasKey = normalize(alias);
        String targetKey = normalize(target);
        FunctionDef def = functions.get(targetKey);
        if (def == null) {
            throw new IllegalStateException("Unknown target for alias: " + target);
        }
        if (functions.containsKey(aliasKey)) {
            throw new IllegalStateException("Duplicate alias: " + aliasKey);
        }
        functions.put(aliasKey, def.withName(aliasKey));
    }

    private String normalize(String name) {
        return name == null ? "" : name.toLowerCase(Locale.ROOT);
    }

    private void registerCoreMath() {
        register("abs", 1, 1, (a, c) -> a.get(0).abs(c.getMathContext()), "Absolute value");
        register("sign", 1, 1, (a, c) -> BigDecimal.valueOf(a.get(0).signum()), "Sign");
        register("inv", 1, 1, (a, c) -> BigDecimal.ONE.divide(a.get(0), c.getMathContext()), "Reciprocal");
        register("sqrt", 1, 1, (a, c) -> MathUtil.bd(Math.sqrt(a.get(0).doubleValue())), "Square root");
        register("cbrt", 1, 1, (a, c) -> MathUtil.bd(Math.cbrt(a.get(0).doubleValue())), "Cube root");
        register("root", 2, 2, (a, c) -> MathUtil.root(a.get(0), a.get(1), c.getMathContext()), "Nth root");
        register("pow", 2, 2, (a, c) -> MathUtil.pow(a.get(0), a.get(1), c.getMathContext()), "Power");
        register("exp", 1, 1, (a, c) -> MathUtil.bd(Math.exp(a.get(0).doubleValue())), "Exponential");
        register("exp2", 1, 1, (a, c) -> MathUtil.bd(Math.pow(2.0, a.get(0).doubleValue())), "Power of two");
        register("exp10", 1, 1, (a, c) -> MathUtil.bd(Math.pow(10.0, a.get(0).doubleValue())), "Power of ten");
        register("ln", 1, 1, (a, c) -> MathUtil.bd(Math.log(a.get(0).doubleValue())), "Natural log");
        register("log", 1, 1, (a, c) -> MathUtil.bd(Math.log10(a.get(0).doubleValue())), "Base-10 log");
        register("log2", 1, 1, (a, c) -> MathUtil.bd(Math.log(a.get(0).doubleValue()) / Math.log(2.0)), "Base-2 log");
        register("log10", 1, 1, (a, c) -> MathUtil.bd(Math.log10(a.get(0).doubleValue())), "Base-10 log");
        register("logb", 2, 2, (a, c) -> MathUtil.bd(Math.log(a.get(0).doubleValue()) / Math.log(a.get(1).doubleValue())), "Log with base");
        register("ceil", 1, 1, (a, c) -> a.get(0).setScale(0, RoundingMode.CEILING), "Ceiling");
        register("floor", 1, 1, (a, c) -> a.get(0).setScale(0, RoundingMode.FLOOR), "Floor");
        register("round", 1, 1, (a, c) -> a.get(0).setScale(0, RoundingMode.HALF_UP), "Round to integer");
        register("trunc", 1, 1, (a, c) -> a.get(0).setScale(0, RoundingMode.DOWN), "Truncate to integer");
        register("frac", 1, 1, (a, c) -> a.get(0).subtract(a.get(0).setScale(0, RoundingMode.FLOOR), c.getMathContext()), "Fractional part");
    }

    private void registerExtraMath() {
        register("erf", 1, 1, (a, c) -> MathUtil.erf(a.get(0)), "Error function");
        register("erfc", 1, 1, (a, c) -> MathUtil.erfc(a.get(0)), "Complementary error function");
        register("erfi", 1, 1, (a, c) -> MathUtil.erfi(a.get(0)), "Imaginary error function");
        register("sigmoid", 1, 1, (a, c) -> MathUtil.sigmoid(a.get(0)), "Sigmoid");
        register("log1p", 1, 1, (a, c) -> MathUtil.log1p(a.get(0)), "Log(1+x)");
        register("expm1", 1, 1, (a, c) -> MathUtil.expm1(a.get(0)), "Exp(x)-1");
        register("hypot", 2, 2, (a, c) -> MathUtil.hypot(a.get(0), a.get(1)), "Hypotenuse");
    }

    private void registerTrig() {
        register("sin", 1, 1, (a, c) -> MathUtil.sin(a.get(0), c.getAngleMode()), "Sine");
        register("cos", 1, 1, (a, c) -> MathUtil.cos(a.get(0), c.getAngleMode()), "Cosine");
        register("tan", 1, 1, (a, c) -> MathUtil.tan(a.get(0), c.getAngleMode()), "Tangent");
        register("sec", 1, 1, (a, c) -> MathUtil.sec(a.get(0), c.getAngleMode()), "Secant");
        register("csc", 1, 1, (a, c) -> MathUtil.csc(a.get(0), c.getAngleMode()), "Cosecant");
        register("cot", 1, 1, (a, c) -> MathUtil.cot(a.get(0), c.getAngleMode()), "Cotangent");
        register("asin", 1, 1, (a, c) -> MathUtil.asin(a.get(0), c.getAngleMode()), "Arcsine");
        register("acos", 1, 1, (a, c) -> MathUtil.acos(a.get(0), c.getAngleMode()), "Arccosine");
        register("atan", 1, 1, (a, c) -> MathUtil.atan(a.get(0), c.getAngleMode()), "Arctangent");
        register("asec", 1, 1, (a, c) -> MathUtil.asec(a.get(0), c.getAngleMode()), "Arcsecant");
        register("acsc", 1, 1, (a, c) -> MathUtil.acsc(a.get(0), c.getAngleMode()), "Arccosecant");
        register("acot", 1, 1, (a, c) -> MathUtil.acot(a.get(0), c.getAngleMode()), "Arccotangent");

        registerTrigVariants("sin", (v, m) -> MathUtil.sin(v, m));
        registerTrigVariants("cos", (v, m) -> MathUtil.cos(v, m));
        registerTrigVariants("tan", (v, m) -> MathUtil.tan(v, m));
        registerTrigVariants("sec", (v, m) -> MathUtil.sec(v, m));
        registerTrigVariants("csc", (v, m) -> MathUtil.csc(v, m));
        registerTrigVariants("cot", (v, m) -> MathUtil.cot(v, m));
        registerTrigVariants("asin", (v, m) -> MathUtil.asin(v, m));
        registerTrigVariants("acos", (v, m) -> MathUtil.acos(v, m));
        registerTrigVariants("atan", (v, m) -> MathUtil.atan(v, m));
        registerTrigVariants("asec", (v, m) -> MathUtil.asec(v, m));
        registerTrigVariants("acsc", (v, m) -> MathUtil.acsc(v, m));
        registerTrigVariants("acot", (v, m) -> MathUtil.acot(v, m));

        alias("sine", "sin");
        alias("cosine", "cos");
        alias("tangent", "tan");
        alias("secant", "sec");
        alias("cosecant", "csc");
        alias("cotangent", "cot");
        alias("arcsin", "asin");
        alias("arccos", "acos");
        alias("arctan", "atan");
        alias("arcsec", "asec");
        alias("arccsc", "acsc");
        alias("arccot", "acot");
    }

    private interface TrigFunction {
        BigDecimal apply(BigDecimal value, AngleMode mode);
    }

    private void registerTrigVariants(String name, TrigFunction fn) {
        register(name + "_deg", 1, 1, (a, c) -> fn.apply(a.get(0), AngleMode.DEG), name + " in degrees");
        register(name + "_rad", 1, 1, (a, c) -> fn.apply(a.get(0), AngleMode.RAD), name + " in radians");
        register(name + "_grad", 1, 1, (a, c) -> fn.apply(a.get(0), AngleMode.GRAD), name + " in gradians");
    }

    private void registerHyperbolic() {
        register("sinh", 1, 1, (a, c) -> MathUtil.sinh(a.get(0)), "Hyperbolic sine");
        register("cosh", 1, 1, (a, c) -> MathUtil.cosh(a.get(0)), "Hyperbolic cosine");
        register("tanh", 1, 1, (a, c) -> MathUtil.tanh(a.get(0)), "Hyperbolic tangent");
        register("sech", 1, 1, (a, c) -> MathUtil.sech(a.get(0)), "Hyperbolic secant");
        register("csch", 1, 1, (a, c) -> MathUtil.csch(a.get(0)), "Hyperbolic cosecant");
        register("coth", 1, 1, (a, c) -> MathUtil.coth(a.get(0)), "Hyperbolic cotangent");
        register("asinh", 1, 1, (a, c) -> MathUtil.asinh(a.get(0)), "Inverse hyperbolic sine");
        register("acosh", 1, 1, (a, c) -> MathUtil.acosh(a.get(0)), "Inverse hyperbolic cosine");
        register("atanh", 1, 1, (a, c) -> MathUtil.atanh(a.get(0)), "Inverse hyperbolic tangent");
        register("asech", 1, 1, (a, c) -> MathUtil.asech(a.get(0)), "Inverse hyperbolic secant");
        register("acsch", 1, 1, (a, c) -> MathUtil.acsch(a.get(0)), "Inverse hyperbolic cosecant");
        register("acoth", 1, 1, (a, c) -> MathUtil.acoth(a.get(0)), "Inverse hyperbolic cotangent");
    }

    private void registerConstants() {
        register("const_pi", 0, 0, (a, c) -> MathUtil.BD_PI, "Pi constant");
        register("const_e", 0, 0, (a, c) -> MathUtil.BD_E, "Euler constant");
        register("const_tau", 0, 0, (a, c) -> MathUtil.BD_TAU, "Tau constant");
        register("const_phi", 0, 0, (a, c) -> MathUtil.BD_PHI, "Phi constant");
        register("const_ln2", 0, 0, (a, c) -> MathUtil.BD_LN2, "Ln(2) constant");
        register("const_ln10", 0, 0, (a, c) -> MathUtil.BD_LN10, "Ln(10) constant");
        register("const_sqrt2", 0, 0, (a, c) -> MathUtil.BD_SQRT2, "Sqrt(2) constant");
        register("const_sqrt3", 0, 0, (a, c) -> MathUtil.BD_SQRT3, "Sqrt(3) constant");
        register("const_catalan", 0, 0, (a, c) -> MathUtil.BD_CATALAN, "Catalan constant");
        register("const_apery", 0, 0, (a, c) -> MathUtil.BD_APERY, "Apery constant");
        register("const_khinchin", 0, 0, (a, c) -> MathUtil.BD_KHINCHIN, "Khinchin constant");
    }

    private void registerNumberTheory() {
        register("fact", 1, 1, (a, c) -> bd(factorial(requireNonNegativeInteger(a.get(0), "fact"))), "Factorial");
        alias("factorial", "fact");
        register("dfact", 1, 1, (a, c) -> bd(doubleFactorial(requireNonNegativeInteger(a.get(0), "dfact"))), "Double factorial");
        register("gamma", 1, 1, (a, c) -> MathUtil.bd(MathUtil.gamma(a.get(0).doubleValue())), "Gamma function");
        register("lngamma", 1, 1, (a, c) -> MathUtil.bd(MathUtil.logGamma(a.get(0).doubleValue())), "Log gamma");
        register("beta", 2, 2, (a, c) -> MathUtil.bd(MathUtil.beta(a.get(0).doubleValue(), a.get(1).doubleValue())), "Beta function");
        register("perm", 2, 2, (a, c) -> bd(npr(requireNonNegativeInteger(a.get(0), "perm"), requireNonNegativeInteger(a.get(1), "perm"))), "Permutations");
        register("comb", 2, 2, (a, c) -> bd(ncr(requireNonNegativeInteger(a.get(0), "comb"), requireNonNegativeInteger(a.get(1), "comb"))), "Combinations");
        register("npr", 2, 2, (a, c) -> bd(npr(requireNonNegativeInteger(a.get(0), "npr"), requireNonNegativeInteger(a.get(1), "npr"))), "Permutations");
        register("ncr", 2, 2, (a, c) -> bd(ncr(requireNonNegativeInteger(a.get(0), "ncr"), requireNonNegativeInteger(a.get(1), "ncr"))), "Combinations");
        register("gcd", 2, 2, (a, c) -> bd(requireInteger(a.get(0), "gcd").gcd(requireInteger(a.get(1), "gcd"))), "Greatest common divisor");
        register("lcm", 2, 2, (a, c) -> bd(lcm(requireInteger(a.get(0), "lcm"), requireInteger(a.get(1), "lcm"))), "Least common multiple");
        register("mod", 2, 2, (a, c) -> a.get(0).remainder(a.get(1), c.getMathContext()), "Modulo");
        register("modinv", 2, 2, (a, c) -> bd(modInverse(requireInteger(a.get(0), "modinv"), requireInteger(a.get(1), "modinv"))), "Modular inverse");
        register("isprime", 1, 1, (a, c) -> BigDecimal.valueOf(isPrime(requireNonNegativeInteger(a.get(0), "isprime")) ? 1 : 0), "Primality test");
        register("nextprime", 1, 1, (a, c) -> bd(nextPrime(requireNonNegativeInteger(a.get(0), "nextprime"))), "Next prime");
        register("prevprime", 1, 1, (a, c) -> bd(prevPrime(requireNonNegativeInteger(a.get(0), "prevprime"))), "Previous prime");
        register("primepi", 1, 1, (a, c) -> bd(primePi(requireNonNegativeInteger(a.get(0), "primepi"))), "Prime counting function");
        register("fib", 1, 1, (a, c) -> bd(fib(requireNonNegativeInteger(a.get(0), "fib"))), "Fibonacci");
        register("lucas", 1, 1, (a, c) -> bd(lucas(requireNonNegativeInteger(a.get(0), "lucas"))), "Lucas");
    }

    private void registerStatistics() {
        register("sum", 1, -1, (a, c) -> sum(a, c.getMathContext()), "Sum");
        register("product", 1, -1, (a, c) -> product(a, c.getMathContext()), "Product");
        register("mean", 1, -1, (a, c) -> mean(a), "Mean");
        alias("avg", "mean");
        register("median", 1, -1, (a, c) -> median(a), "Median");
        register("mode", 1, -1, (a, c) -> mode(a), "Mode");
        register("min", 1, -1, (a, c) -> a.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO), "Minimum");
        register("max", 1, -1, (a, c) -> a.stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO), "Maximum");
        register("range", 1, -1, (a, c) -> range(a), "Range");
        register("variance", 2, -1, (a, c) -> variance(a, true), "Sample variance");
        register("varp", 2, -1, (a, c) -> variance(a, false), "Population variance");
        register("stdev", 2, -1, (a, c) -> stdev(a, true), "Sample stdev");
        register("stdevp", 2, -1, (a, c) -> stdev(a, false), "Population stdev");
        register("mad", 1, -1, (a, c) -> mad(a), "Median absolute deviation");
        register("rms", 1, -1, (a, c) -> rms(a), "Root mean square");
        register("geomean", 1, -1, (a, c) -> geomean(a), "Geometric mean");
        register("harmean", 1, -1, (a, c) -> harmean(a), "Harmonic mean");
        register("percentile", 2, -1, (a, c) -> percentile(a), "Percentile");
        register("quantile", 2, -1, (a, c) -> quantile(a), "Quantile");
        register("cov", 4, -1, (a, c) -> covariance(a), "Covariance");
        register("corr", 4, -1, (a, c) -> correlation(a), "Correlation");
        register("skew", 2, -1, (a, c) -> skew(a), "Skewness");
        register("kurtosis", 2, -1, (a, c) -> kurtosis(a), "Kurtosis");
        register("zscore", 3, 3, (a, c) -> zscore(a), "Z-score");
    }

    private void registerBitwise() {
        register("bit_and", 2, 2, (a, c) -> bd(requireLong(a.get(0), "bit_and") & requireLong(a.get(1), "bit_and")), "Bitwise AND");
        register("bit_or", 2, 2, (a, c) -> bd(requireLong(a.get(0), "bit_or") | requireLong(a.get(1), "bit_or")), "Bitwise OR");
        register("bit_xor", 2, 2, (a, c) -> bd(requireLong(a.get(0), "bit_xor") ^ requireLong(a.get(1), "bit_xor")), "Bitwise XOR");
        register("bit_not", 1, 1, (a, c) -> bd(~requireLong(a.get(0), "bit_not")), "Bitwise NOT");
        register("shl", 2, 2, (a, c) -> bd(requireLong(a.get(0), "shl") << (int) requireLong(a.get(1), "shl")), "Shift left");
        register("shr", 2, 2, (a, c) -> bd(requireLong(a.get(0), "shr") >> (int) requireLong(a.get(1), "shr")), "Shift right");
        register("ushr", 2, 2, (a, c) -> bd(requireLong(a.get(0), "ushr") >>> (int) requireLong(a.get(1), "ushr")), "Unsigned shift right");
        register("bit_count", 1, 1, (a, c) -> bd(Long.bitCount(requireLong(a.get(0), "bit_count"))), "Bit count");
        register("bit_len", 1, 1, (a, c) -> bd(bitLength(requireLong(a.get(0), "bit_len"))), "Bit length");
        register("bit_get", 2, 2, (a, c) -> bd(bitGet(requireLong(a.get(0), "bit_get"), requireLong(a.get(1), "bit_get"))), "Get bit");
    }

    private void registerFinance() {
        register("pv", 4, 4, (a, c) -> MathUtil.bd(pv(a.get(0), a.get(1), a.get(2), a.get(3))), "Present value");
        register("fv", 4, 4, (a, c) -> MathUtil.bd(fv(a.get(0), a.get(1), a.get(2), a.get(3))), "Future value");
        register("pmt", 4, 4, (a, c) -> MathUtil.bd(pmt(a.get(0), a.get(1), a.get(2), a.get(3))), "Payment");
        register("nper", 4, 4, (a, c) -> MathUtil.bd(nper(a.get(0), a.get(1), a.get(2), a.get(3))), "Number of periods");
        register("rate", 4, 4, (a, c) -> MathUtil.bd(rate(a.get(0), a.get(1), a.get(2), a.get(3))), "Interest rate");
        register("npv", 2, -1, (a, c) -> MathUtil.bd(npv(a)), "Net present value");
        register("irr", 2, -1, (a, c) -> MathUtil.bd(irr(a)), "Internal rate of return");
        register("mirr", 3, -1, (a, c) -> MathUtil.bd(mirr(a)), "Modified internal rate of return");
        register("effect", 2, 2, (a, c) -> MathUtil.bd(effect(a.get(0), a.get(1))), "Effective rate");
        register("nominal", 2, 2, (a, c) -> MathUtil.bd(nominal(a.get(0), a.get(1))), "Nominal rate");
        register("cagr", 3, 3, (a, c) -> MathUtil.bd(cagr(a.get(0), a.get(1), a.get(2))), "CAGR");
        register("roi", 2, 2, (a, c) -> MathUtil.bd(roi(a.get(0), a.get(1))), "ROI");
    }

    private void registerGeometry() {
        register("area_circle", 1, 1, (a, c) -> MathUtil.BD_PI.multiply(a.get(0).pow(2, c.getMathContext()), c.getMathContext()), "Area of circle");
        register("circumference", 1, 1, (a, c) -> MathUtil.BD_TAU.multiply(a.get(0), c.getMathContext()), "Circumference");
        register("area_rect", 2, 2, (a, c) -> a.get(0).multiply(a.get(1), c.getMathContext()), "Area of rectangle");
        register("area_square", 1, 1, (a, c) -> a.get(0).multiply(a.get(0), c.getMathContext()), "Area of square");
        register("area_triangle", 2, 2, (a, c) -> a.get(0).multiply(a.get(1), c.getMathContext()).divide(new BigDecimal("2"), c.getMathContext()), "Area of triangle");
        register("area_trapezoid", 3, 3, (a, c) -> a.get(0).add(a.get(1), c.getMathContext()).multiply(a.get(2), c.getMathContext()).divide(new BigDecimal("2"), c.getMathContext()), "Area of trapezoid");
        register("area_ellipse", 2, 2, (a, c) -> MathUtil.BD_PI.multiply(a.get(0), c.getMathContext()).multiply(a.get(1), c.getMathContext()), "Area of ellipse");
        register("perimeter_rect", 2, 2, (a, c) -> a.get(0).add(a.get(1), c.getMathContext()).multiply(new BigDecimal("2"), c.getMathContext()), "Perimeter of rectangle");
        register("perimeter_square", 1, 1, (a, c) -> a.get(0).multiply(new BigDecimal("4"), c.getMathContext()), "Perimeter of square");
        register("perimeter_triangle", 3, 3, (a, c) -> a.get(0).add(a.get(1), c.getMathContext()).add(a.get(2), c.getMathContext()), "Perimeter of triangle");
        register("volume_sphere", 1, 1, (a, c) -> volumeSphere(a.get(0), c.getMathContext()), "Volume of sphere");
        register("volume_cube", 1, 1, (a, c) -> a.get(0).pow(3, c.getMathContext()), "Volume of cube");
        register("volume_cylinder", 2, 2, (a, c) -> MathUtil.BD_PI.multiply(a.get(0).pow(2, c.getMathContext()), c.getMathContext()).multiply(a.get(1), c.getMathContext()), "Volume of cylinder");
        register("volume_cone", 2, 2, (a, c) -> volumeCone(a.get(0), a.get(1), c.getMathContext()), "Volume of cone");
        register("volume_prism", 2, 2, (a, c) -> a.get(0).multiply(a.get(1), c.getMathContext()), "Volume of prism");
        register("surface_sphere", 1, 1, (a, c) -> surfaceSphere(a.get(0), c.getMathContext()), "Surface area of sphere");
        register("surface_cube", 1, 1, (a, c) -> a.get(0).pow(2, c.getMathContext()).multiply(new BigDecimal("6"), c.getMathContext()), "Surface area of cube");
        register("surface_cylinder", 2, 2, (a, c) -> surfaceCylinder(a.get(0), a.get(1), c.getMathContext()), "Surface area of cylinder");
        register("surface_cone", 2, 2, (a, c) -> surfaceCone(a.get(0), a.get(1), c.getMathContext()), "Surface area of cone");
    }

    private void registerRandom() {
        register("rand", 0, 0, (a, c) -> MathUtil.bd(c.getRandom().nextDouble()), "Random [0,1)");
        register("rand_range", 2, 2, (a, c) -> MathUtil.bd(randRange(c, a.get(0), a.get(1))), "Random range");
        register("rand_int", 2, 2, (a, c) -> MathUtil.bd(randInt(c, a.get(0), a.get(1))), "Random integer");
        register("randn", 2, 2, (a, c) -> MathUtil.bd(randNormal(c, a.get(0), a.get(1))), "Random normal");
        register("rand_exp", 1, 1, (a, c) -> MathUtil.bd(randExp(c, a.get(0))), "Random exponential");
        register("rand_seed", 1, 1, (a, c) -> {
            c.setRandomSeed(a.get(0).longValue());
            return a.get(0);
        }, "Set random seed");
    }

    private void registerAngleConversions() {
        register("deg_to_rad", 1, 1, (a, c) -> MathUtil.bd(Math.toRadians(a.get(0).doubleValue())), "Degrees to radians");
        register("rad_to_deg", 1, 1, (a, c) -> MathUtil.bd(Math.toDegrees(a.get(0).doubleValue())), "Radians to degrees");
        register("grad_to_rad", 1, 1, (a, c) -> MathUtil.bd(a.get(0).doubleValue() * Math.PI / 200.0), "Gradians to radians");
        register("rad_to_grad", 1, 1, (a, c) -> MathUtil.bd(a.get(0).doubleValue() * 200.0 / Math.PI), "Radians to gradians");
        register("deg_to_grad", 1, 1, (a, c) -> MathUtil.bd(a.get(0).doubleValue() * 200.0 / 180.0), "Degrees to gradians");
        register("grad_to_deg", 1, 1, (a, c) -> MathUtil.bd(a.get(0).doubleValue() * 180.0 / 200.0), "Gradians to degrees");
    }

    private void registerLengthConversions() {
        LengthUnit[] units = LengthUnit.values();
        for (LengthUnit from : units) {
            for (LengthUnit to : units) {
                if (from == to) {
                    continue;
                }
                String name = from.id + "_to_" + to.id;
                register(name, 1, 1, (a, c) -> convertLength(a.get(0), from, to), "Length conversion");
            }
        }
    }

    private BigDecimal convertLength(BigDecimal value, LengthUnit from, LengthUnit to) {
        MathContext mc = MathUtil.MC;
        BigDecimal meters = value.multiply(from.toMeters, mc);
        return meters.divide(to.toMeters, mc);
    }

    private BigDecimal sum(List<BigDecimal> values, MathContext mc) {
        BigDecimal total = BigDecimal.ZERO;
        for (BigDecimal value : values) {
            total = total.add(value, mc);
        }
        return total;
    }

    private BigDecimal product(List<BigDecimal> values, MathContext mc) {
        BigDecimal total = BigDecimal.ONE;
        for (BigDecimal value : values) {
            total = total.multiply(value, mc);
        }
        return total;
    }

    private BigDecimal mean(List<BigDecimal> values) {
        return MathUtil.bd(meanDouble(values));
    }

    private BigDecimal median(List<BigDecimal> values) {
        List<BigDecimal> sorted = new ArrayList<>(values);
        sorted.sort(BigDecimal::compareTo);
        int n = sorted.size();
        if (n % 2 == 1) {
            return sorted.get(n / 2);
        }
        BigDecimal a = sorted.get(n / 2 - 1);
        BigDecimal b = sorted.get(n / 2);
        return a.add(b, MathUtil.MC).divide(new BigDecimal("2"), MathUtil.MC);
    }

    private BigDecimal mode(List<BigDecimal> values) {
        Map<String, Integer> counts = new HashMap<>();
        BigDecimal best = values.get(0);
        int bestCount = 0;
        for (BigDecimal value : values) {
            String key = value.stripTrailingZeros().toPlainString();
            int count = counts.getOrDefault(key, 0) + 1;
            counts.put(key, count);
            if (count > bestCount) {
                bestCount = count;
                best = value;
            }
        }
        return best;
    }

    private BigDecimal range(List<BigDecimal> values) {
        BigDecimal min = values.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal max = values.stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        return max.subtract(min, MathUtil.MC);
    }

    private BigDecimal variance(List<BigDecimal> values, boolean sample) {
        double var = varianceDouble(values, sample);
        return MathUtil.bd(var);
    }

    private BigDecimal stdev(List<BigDecimal> values, boolean sample) {
        return MathUtil.bd(Math.sqrt(varianceDouble(values, sample)));
    }

    private BigDecimal mad(List<BigDecimal> values) {
        BigDecimal med = median(values);
        List<BigDecimal> deviations = new ArrayList<>();
        for (BigDecimal value : values) {
            deviations.add(value.subtract(med, MathUtil.MC).abs());
        }
        return median(deviations);
    }

    private BigDecimal rms(List<BigDecimal> values) {
        double sumSq = 0.0;
        for (BigDecimal value : values) {
            double d = value.doubleValue();
            sumSq += d * d;
        }
        return MathUtil.bd(Math.sqrt(sumSq / values.size()));
    }

    private BigDecimal geomean(List<BigDecimal> values) {
        double sumLog = 0.0;
        for (BigDecimal value : values) {
            double d = value.doubleValue();
            if (d <= 0.0) {
                throw new IllegalArgumentException("geomean requires positive values");
            }
            sumLog += Math.log(d);
        }
        return MathUtil.bd(Math.exp(sumLog / values.size()));
    }

    private BigDecimal harmean(List<BigDecimal> values) {
        double sum = 0.0;
        for (BigDecimal value : values) {
            double d = value.doubleValue();
            if (d == 0.0) {
                throw new IllegalArgumentException("harmean requires non-zero values");
            }
            sum += 1.0 / d;
        }
        return MathUtil.bd(values.size() / sum);
    }

    private BigDecimal percentile(List<BigDecimal> values) {
        double p = values.get(0).doubleValue();
        if (p < 0.0 || p > 100.0) {
            throw new IllegalArgumentException("percentile p must be in [0,100]");
        }
        List<BigDecimal> data = new ArrayList<>(values.subList(1, values.size()));
        data.sort(BigDecimal::compareTo);
        double rank = (p / 100.0) * (data.size() - 1);
        int low = (int) Math.floor(rank);
        int high = (int) Math.ceil(rank);
        if (low == high) {
            return data.get(low);
        }
        double fraction = rank - low;
        double lowVal = data.get(low).doubleValue();
        double highVal = data.get(high).doubleValue();
        return MathUtil.bd(lowVal + (highVal - lowVal) * fraction);
    }

    private BigDecimal quantile(List<BigDecimal> values) {
        double q = values.get(0).doubleValue();
        if (q < 0.0 || q > 1.0) {
            throw new IllegalArgumentException("quantile q must be in [0,1]");
        }
        List<BigDecimal> data = new ArrayList<>(values.subList(1, values.size()));
        data.sort(BigDecimal::compareTo);
        double rank = q * (data.size() - 1);
        int low = (int) Math.floor(rank);
        int high = (int) Math.ceil(rank);
        if (low == high) {
            return data.get(low);
        }
        double fraction = rank - low;
        double lowVal = data.get(low).doubleValue();
        double highVal = data.get(high).doubleValue();
        return MathUtil.bd(lowVal + (highVal - lowVal) * fraction);
    }

    private BigDecimal covariance(List<BigDecimal> values) {
        if (values.size() % 2 != 0) {
            throw new IllegalArgumentException("cov requires an even number of values");
        }
        int n = values.size() / 2;
        List<BigDecimal> x = values.subList(0, n);
        List<BigDecimal> y = values.subList(n, values.size());
        double meanX = meanDouble(x);
        double meanY = meanDouble(y);
        double sum = 0.0;
        for (int i = 0; i < n; i++) {
            sum += (x.get(i).doubleValue() - meanX) * (y.get(i).doubleValue() - meanY);
        }
        return MathUtil.bd(sum / n);
    }

    private BigDecimal correlation(List<BigDecimal> values) {
        if (values.size() % 2 != 0) {
            throw new IllegalArgumentException("corr requires an even number of values");
        }
        int n = values.size() / 2;
        List<BigDecimal> x = values.subList(0, n);
        List<BigDecimal> y = values.subList(n, values.size());
        double meanX = meanDouble(x);
        double meanY = meanDouble(y);
        double sumXY = 0.0;
        double sumXX = 0.0;
        double sumYY = 0.0;
        for (int i = 0; i < n; i++) {
            double dx = x.get(i).doubleValue() - meanX;
            double dy = y.get(i).doubleValue() - meanY;
            sumXY += dx * dy;
            sumXX += dx * dx;
            sumYY += dy * dy;
        }
        return MathUtil.bd(sumXY / Math.sqrt(sumXX * sumYY));
    }

    private BigDecimal skew(List<BigDecimal> values) {
        double mean = meanDouble(values);
        double stdev = Math.sqrt(varianceDouble(values, false));
        double sum = 0.0;
        for (BigDecimal value : values) {
            double z = (value.doubleValue() - mean) / stdev;
            sum += z * z * z;
        }
        return MathUtil.bd(sum / values.size());
    }

    private BigDecimal kurtosis(List<BigDecimal> values) {
        double mean = meanDouble(values);
        double stdev = Math.sqrt(varianceDouble(values, false));
        double sum = 0.0;
        for (BigDecimal value : values) {
            double z = (value.doubleValue() - mean) / stdev;
            sum += z * z * z * z;
        }
        return MathUtil.bd(sum / values.size() - 3.0);
    }

    private BigDecimal zscore(List<BigDecimal> values) {
        double value = values.get(0).doubleValue();
        double mean = values.get(1).doubleValue();
        double stdev = values.get(2).doubleValue();
        return MathUtil.bd((value - mean) / stdev);
    }

    private double meanDouble(List<BigDecimal> values) {
        double total = 0.0;
        for (BigDecimal value : values) {
            total += value.doubleValue();
        }
        return total / values.size();
    }

    private double varianceDouble(List<BigDecimal> values, boolean sample) {
        double mean = meanDouble(values);
        double sum = 0.0;
        for (BigDecimal value : values) {
            double diff = value.doubleValue() - mean;
            sum += diff * diff;
        }
        return sum / (values.size() - (sample ? 1 : 0));
    }

    private long requireLong(BigDecimal value, String label) {
        BigInteger bi = requireInteger(value, label);
        if (bi.compareTo(BigInteger.valueOf(Long.MIN_VALUE)) < 0 || bi.compareTo(BigInteger.valueOf(Long.MAX_VALUE)) > 0) {
            throw new IllegalArgumentException(label + " out of 64-bit range");
        }
        return bi.longValue();
    }

    private BigInteger requireInteger(BigDecimal value, String label) {
        return MathUtil.requireInteger(value, label);
    }

    private BigInteger requireNonNegativeInteger(BigDecimal value, String label) {
        BigInteger bi = MathUtil.requireInteger(value, label);
        if (bi.signum() < 0) {
            throw new IllegalArgumentException(label + " must be non-negative");
        }
        return bi;
    }

    private BigDecimal bd(BigInteger value) {
        return new BigDecimal(value);
    }

    private BigInteger factorial(BigInteger n) {
        BigInteger result = BigInteger.ONE;
        for (BigInteger i = BigInteger.ONE; i.compareTo(n) <= 0; i = i.add(BigInteger.ONE)) {
            result = result.multiply(i);
        }
        return result;
    }

    private BigInteger doubleFactorial(BigInteger n) {
        BigInteger result = BigInteger.ONE;
        for (BigInteger i = n; i.signum() > 0; i = i.subtract(BigInteger.valueOf(2))) {
            result = result.multiply(i);
        }
        return result;
    }

    private BigInteger npr(BigInteger n, BigInteger r) {
        if (r.compareTo(n) > 0) {
            return BigInteger.ZERO;
        }
        BigInteger result = BigInteger.ONE;
        for (BigInteger i = BigInteger.ZERO; i.compareTo(r) < 0; i = i.add(BigInteger.ONE)) {
            result = result.multiply(n.subtract(i));
        }
        return result;
    }

    private BigInteger ncr(BigInteger n, BigInteger r) {
        if (r.compareTo(n) > 0) {
            return BigInteger.ZERO;
        }
        BigInteger k = r.min(n.subtract(r));
        BigInteger result = BigInteger.ONE;
        for (BigInteger i = BigInteger.ONE; i.compareTo(k) <= 0; i = i.add(BigInteger.ONE)) {
            result = result.multiply(n.subtract(k).add(i)).divide(i);
        }
        return result;
    }

    private BigInteger lcm(BigInteger a, BigInteger b) {
        if (a.signum() == 0 || b.signum() == 0) {
            return BigInteger.ZERO;
        }
        return a.abs().divide(a.gcd(b)).multiply(b.abs());
    }

    private BigInteger modInverse(BigInteger a, BigInteger m) {
        return a.modInverse(m);
    }

    private boolean isPrime(BigInteger n) {
        if (n.compareTo(BigInteger.valueOf(2)) < 0) {
            return false;
        }
        if (n.bitLength() > 31) {
            return n.isProbablePrime(20);
        }
        long v = n.longValue();
        if (v % 2 == 0) {
            return v == 2;
        }
        for (long i = 3; i * i <= v; i += 2) {
            if (v % i == 0) {
                return false;
            }
        }
        return true;
    }

    private BigInteger nextPrime(BigInteger n) {
        if (n.compareTo(BigInteger.valueOf(2)) < 0) {
            return BigInteger.valueOf(2);
        }
        BigInteger candidate = n.add(BigInteger.ONE);
        while (!isPrime(candidate)) {
            candidate = candidate.add(BigInteger.ONE);
        }
        return candidate;
    }

    private BigInteger prevPrime(BigInteger n) {
        if (n.compareTo(BigInteger.valueOf(2)) <= 0) {
            return BigInteger.valueOf(2);
        }
        BigInteger candidate = n.subtract(BigInteger.ONE);
        while (candidate.compareTo(BigInteger.valueOf(2)) >= 0 && !isPrime(candidate)) {
            candidate = candidate.subtract(BigInteger.ONE);
        }
        return candidate.max(BigInteger.valueOf(2));
    }

    private BigInteger primePi(BigInteger n) {
        if (n.compareTo(BigInteger.valueOf(1_000_000L)) > 0) {
            double d = n.doubleValue();
            return BigInteger.valueOf((long) (d / Math.log(d)));
        }
        long limit = n.longValue();
        long count = 0;
        for (long i = 2; i <= limit; i++) {
            if (isPrime(BigInteger.valueOf(i))) {
                count++;
            }
        }
        return BigInteger.valueOf(count);
    }

    private BigInteger fib(BigInteger n) {
        BigInteger a = BigInteger.ZERO;
        BigInteger b = BigInteger.ONE;
        for (BigInteger i = BigInteger.ZERO; i.compareTo(n) < 0; i = i.add(BigInteger.ONE)) {
            BigInteger next = a.add(b);
            a = b;
            b = next;
        }
        return a;
    }

    private BigInteger lucas(BigInteger n) {
        BigInteger a = BigInteger.valueOf(2);
        BigInteger b = BigInteger.ONE;
        for (BigInteger i = BigInteger.ZERO; i.compareTo(n) < 0; i = i.add(BigInteger.ONE)) {
            BigInteger next = a.add(b);
            a = b;
            b = next;
        }
        return a;
    }

    private int bitLength(long value) {
        if (value <= 0) {
            return 0;
        }
        return 64 - Long.numberOfLeadingZeros(value);
    }

    private int bitGet(long value, long index) {
        if (index < 0 || index > 63) {
            throw new IllegalArgumentException("bit_get index must be in [0,63]");
        }
        return ((value >> index) & 1L) == 1L ? 1 : 0;
    }

    private double pv(BigDecimal rate, BigDecimal nper, BigDecimal pmt, BigDecimal fv) {
        double r = rate.doubleValue();
        double n = nper.doubleValue();
        double payment = pmt.doubleValue();
        double future = fv.doubleValue();
        if (r == 0.0) {
            return -(future + payment * n);
        }
        double factor = Math.pow(1.0 + r, n);
        return -(future + payment * (factor - 1.0) / r) / factor;
    }

    private double fv(BigDecimal rate, BigDecimal nper, BigDecimal pmt, BigDecimal pv) {
        double r = rate.doubleValue();
        double n = nper.doubleValue();
        double payment = pmt.doubleValue();
        double present = pv.doubleValue();
        if (r == 0.0) {
            return -(present + payment * n);
        }
        double factor = Math.pow(1.0 + r, n);
        return -(present * factor + payment * (factor - 1.0) / r);
    }

    private double pmt(BigDecimal rate, BigDecimal nper, BigDecimal pv, BigDecimal fv) {
        double r = rate.doubleValue();
        double n = nper.doubleValue();
        double present = pv.doubleValue();
        double future = fv.doubleValue();
        if (r == 0.0) {
            return -(present + future) / n;
        }
        double factor = Math.pow(1.0 + r, n);
        return -(present * factor + future) * r / (factor - 1.0);
    }

    private double nper(BigDecimal rate, BigDecimal pmt, BigDecimal pv, BigDecimal fv) {
        double r = rate.doubleValue();
        double payment = pmt.doubleValue();
        double present = pv.doubleValue();
        double future = fv.doubleValue();
        if (r == 0.0) {
            return -(present + future) / payment;
        }
        double numerator = payment - future * r;
        double denominator = payment + present * r;
        return Math.log(numerator / denominator) / Math.log(1.0 + r);
    }

    private double rate(BigDecimal nper, BigDecimal pmt, BigDecimal pv, BigDecimal fv) {
        double n = nper.doubleValue();
        double payment = pmt.doubleValue();
        double present = pv.doubleValue();
        double future = fv.doubleValue();
        double low = -0.9999;
        double high = 10.0;
        for (int i = 0; i < 100; i++) {
            double mid = (low + high) / 2.0;
            double f = rateFunction(mid, n, payment, present, future);
            if (f > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return (low + high) / 2.0;
    }

    private double rateFunction(double r, double n, double payment, double present, double future) {
        if (r == 0.0) {
            return present + payment * n + future;
        }
        double factor = Math.pow(1.0 + r, n);
        return present * factor + payment * (factor - 1.0) / r + future;
    }

    private double npv(List<BigDecimal> values) {
        double rate = values.get(0).doubleValue();
        double total = 0.0;
        for (int i = 1; i < values.size(); i++) {
            total += values.get(i).doubleValue() / Math.pow(1.0 + rate, i);
        }
        return total;
    }

    private double irr(List<BigDecimal> values) {
        double low = -0.9999;
        double high = 10.0;
        for (int i = 0; i < 100; i++) {
            double mid = (low + high) / 2.0;
            double f = irrFunction(values, mid);
            if (f > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return (low + high) / 2.0;
    }

    private double irrFunction(List<BigDecimal> values, double rate) {
        double total = 0.0;
        for (int i = 0; i < values.size(); i++) {
            total += values.get(i).doubleValue() / Math.pow(1.0 + rate, i);
        }
        return total;
    }

    private double mirr(List<BigDecimal> values) {
        double financeRate = values.get(0).doubleValue();
        double reinvestRate = values.get(1).doubleValue();
        List<BigDecimal> cashflows = values.subList(2, values.size());
        double pvNeg = 0.0;
        double fvPos = 0.0;
        int n = cashflows.size() - 1;
        for (int i = 0; i < cashflows.size(); i++) {
            double cf = cashflows.get(i).doubleValue();
            if (cf < 0.0) {
                pvNeg += cf / Math.pow(1.0 + financeRate, i);
            } else if (cf > 0.0) {
                fvPos += cf * Math.pow(1.0 + reinvestRate, n - i);
            }
        }
        return Math.pow(-fvPos / pvNeg, 1.0 / n) - 1.0;
    }

    private double effect(BigDecimal nominalRate, BigDecimal periods) {
        double r = nominalRate.doubleValue();
        double n = periods.doubleValue();
        return Math.pow(1.0 + r / n, n) - 1.0;
    }

    private double nominal(BigDecimal effectiveRate, BigDecimal periods) {
        double r = effectiveRate.doubleValue();
        double n = periods.doubleValue();
        return n * (Math.pow(1.0 + r, 1.0 / n) - 1.0);
    }

    private double cagr(BigDecimal start, BigDecimal end, BigDecimal years) {
        double s = start.doubleValue();
        double e = end.doubleValue();
        double y = years.doubleValue();
        return Math.pow(e / s, 1.0 / y) - 1.0;
    }

    private double roi(BigDecimal gain, BigDecimal cost) {
        return (gain.doubleValue() - cost.doubleValue()) / cost.doubleValue();
    }

    private double randRange(EvalContext ctx, BigDecimal min, BigDecimal max) {
        double a = min.doubleValue();
        double b = max.doubleValue();
        return a + (b - a) * ctx.getRandom().nextDouble();
    }

    private long randInt(EvalContext ctx, BigDecimal min, BigDecimal max) {
        long a = min.longValue();
        long b = max.longValue();
        if (b < a) {
            long tmp = a;
            a = b;
            b = tmp;
        }
        long range = b - a + 1;
        long candidate = (long) (ctx.getRandom().nextDouble() * range);
        return a + candidate;
    }

    private double randNormal(EvalContext ctx, BigDecimal mean, BigDecimal stdev) {
        double u = ctx.getRandom().nextDouble();
        double v = ctx.getRandom().nextDouble();
        double z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean.doubleValue() + z * stdev.doubleValue();
    }

    private double randExp(EvalContext ctx, BigDecimal lambda) {
        double u = ctx.getRandom().nextDouble();
        return -Math.log(1.0 - u) / lambda.doubleValue();
    }

    private BigDecimal volumeSphere(BigDecimal r, MathContext mc) {
        BigDecimal four = new BigDecimal("4");
        BigDecimal three = new BigDecimal("3");
        return four.multiply(MathUtil.BD_PI, mc).multiply(r.pow(3, mc), mc).divide(three, mc);
    }

    private BigDecimal volumeCone(BigDecimal r, BigDecimal h, MathContext mc) {
        BigDecimal three = new BigDecimal("3");
        return MathUtil.BD_PI.multiply(r.pow(2, mc), mc).multiply(h, mc).divide(three, mc);
    }

    private BigDecimal surfaceSphere(BigDecimal r, MathContext mc) {
        BigDecimal four = new BigDecimal("4");
        return four.multiply(MathUtil.BD_PI, mc).multiply(r.pow(2, mc), mc);
    }

    private BigDecimal surfaceCylinder(BigDecimal r, BigDecimal h, MathContext mc) {
        BigDecimal two = new BigDecimal("2");
        BigDecimal base = MathUtil.BD_PI.multiply(r.pow(2, mc), mc);
        BigDecimal lateral = MathUtil.BD_TAU.multiply(r, mc).multiply(h, mc);
        return base.multiply(two, mc).add(lateral, mc);
    }

    private BigDecimal surfaceCone(BigDecimal r, BigDecimal s, MathContext mc) {
        return MathUtil.BD_PI.multiply(r, mc).multiply(r.add(s, mc), mc);
    }

    private enum LengthUnit {
        M("m", "1"),
        KM("km", "1000"),
        CM("cm", "0.01"),
        MM("mm", "0.001"),
        UM("um", "0.000001"),
        NM("nm", "0.000000001"),
        INCH("inch", "0.0254"),
        FOOT("foot", "0.3048"),
        YARD("yard", "0.9144"),
        MILE("mile", "1609.344"),
        NMI("nmi", "1852"),
        MIL("mil", "0.0000254"),
        ANGSTROM("angstrom", "0.0000000001"),
        AU("au", "149597870700"),
        LY("ly", "9460730472580800");

        final String id;
        final BigDecimal toMeters;

        LengthUnit(String id, String toMeters) {
            this.id = id;
            this.toMeters = new BigDecimal(toMeters, MathUtil.MC);
        }
    }
}
