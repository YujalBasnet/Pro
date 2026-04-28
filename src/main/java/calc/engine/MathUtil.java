package calc.engine;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;

public final class MathUtil {
    public static final MathContext MC = new MathContext(34, RoundingMode.HALF_UP);
    public static final BigDecimal BD_PI = new BigDecimal("3.14159265358979323846264338327950288", MC);
    public static final BigDecimal BD_E = new BigDecimal("2.71828182845904523536028747135266250", MC);
    public static final BigDecimal BD_TAU = BD_PI.multiply(new BigDecimal("2"), MC);
    public static final BigDecimal BD_PHI = new BigDecimal("1.61803398874989484820458683436563811", MC);
    public static final BigDecimal BD_LN2 = new BigDecimal("0.69314718055994530941723212145817657", MC);
    public static final BigDecimal BD_LN10 = new BigDecimal("2.30258509299404568401799145468436421", MC);
    public static final BigDecimal BD_SQRT2 = new BigDecimal("1.41421356237309504880168872420969808", MC);
    public static final BigDecimal BD_SQRT3 = new BigDecimal("1.73205080756887729352744634150587236", MC);
    public static final BigDecimal BD_CATALAN = new BigDecimal("0.91596559417721901505460351493238411", MC);
    public static final BigDecimal BD_APERY = new BigDecimal("1.20205690315959428539973816151144999", MC);
    public static final BigDecimal BD_KHINCHIN = new BigDecimal("2.68545200106530644530971483548179569", MC);

    private MathUtil() {
    }

    public static BigDecimal bd(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) {
            throw new IllegalArgumentException("Non-finite result");
        }
        return new BigDecimal(Double.toString(value), MC);
    }

    public static boolean isInteger(BigDecimal value) {
        return value.stripTrailingZeros().scale() <= 0;
    }

    public static BigInteger requireInteger(BigDecimal value, String label) {
        BigDecimal stripped = value.stripTrailingZeros();
        if (stripped.scale() > 0) {
            throw new IllegalArgumentException(label + " must be an integer");
        }
        return stripped.toBigIntegerExact();
    }

    public static BigDecimal pow(BigDecimal base, BigDecimal exponent, MathContext mc) {
        if (isInteger(exponent)) {
            BigInteger exp = exponent.toBigIntegerExact();
            if (exp.signum() >= 0 && exp.compareTo(BigInteger.valueOf(Integer.MAX_VALUE)) <= 0) {
                return base.pow(exp.intValueExact(), mc);
            }
        }
        return bd(Math.pow(base.doubleValue(), exponent.doubleValue()));
    }

    public static BigDecimal root(BigDecimal value, BigDecimal n, MathContext mc) {
        if (isInteger(n)) {
            BigInteger exp = n.toBigIntegerExact();
            if (exp.signum() == 0) {
                throw new IllegalArgumentException("Root degree cannot be zero");
            }
            return bd(Math.pow(value.doubleValue(), 1.0 / exp.doubleValue()));
        }
        return bd(Math.pow(value.doubleValue(), 1.0 / n.doubleValue()));
    }

    public static double toRadians(BigDecimal value, AngleMode mode) {
        double v = value.doubleValue();
        if (mode == AngleMode.DEG) {
            return Math.toRadians(v);
        }
        if (mode == AngleMode.GRAD) {
            return v * Math.PI / 200.0;
        }
        return v;
    }

    public static BigDecimal fromRadians(double radians, AngleMode mode) {
        if (mode == AngleMode.DEG) {
            return bd(Math.toDegrees(radians));
        }
        if (mode == AngleMode.GRAD) {
            return bd(radians * 200.0 / Math.PI);
        }
        return bd(radians);
    }

    public static BigDecimal sin(BigDecimal value, AngleMode mode) {
        return bd(Math.sin(toRadians(value, mode)));
    }

    public static BigDecimal cos(BigDecimal value, AngleMode mode) {
        return bd(Math.cos(toRadians(value, mode)));
    }

    public static BigDecimal tan(BigDecimal value, AngleMode mode) {
        return bd(Math.tan(toRadians(value, mode)));
    }

    public static BigDecimal sec(BigDecimal value, AngleMode mode) {
        return bd(1.0 / Math.cos(toRadians(value, mode)));
    }

    public static BigDecimal csc(BigDecimal value, AngleMode mode) {
        return bd(1.0 / Math.sin(toRadians(value, mode)));
    }

    public static BigDecimal cot(BigDecimal value, AngleMode mode) {
        return bd(1.0 / Math.tan(toRadians(value, mode)));
    }

    public static BigDecimal asin(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.asin(value.doubleValue()), mode);
    }

    public static BigDecimal acos(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.acos(value.doubleValue()), mode);
    }

    public static BigDecimal atan(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.atan(value.doubleValue()), mode);
    }

    public static BigDecimal asec(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.acos(1.0 / value.doubleValue()), mode);
    }

    public static BigDecimal acsc(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.asin(1.0 / value.doubleValue()), mode);
    }

    public static BigDecimal acot(BigDecimal value, AngleMode mode) {
        return fromRadians(Math.atan(1.0 / value.doubleValue()), mode);
    }

    public static BigDecimal sinh(BigDecimal value) {
        return bd(Math.sinh(value.doubleValue()));
    }

    public static BigDecimal cosh(BigDecimal value) {
        return bd(Math.cosh(value.doubleValue()));
    }

    public static BigDecimal tanh(BigDecimal value) {
        return bd(Math.tanh(value.doubleValue()));
    }

    public static BigDecimal sech(BigDecimal value) {
        return bd(1.0 / Math.cosh(value.doubleValue()));
    }

    public static BigDecimal csch(BigDecimal value) {
        return bd(1.0 / Math.sinh(value.doubleValue()));
    }

    public static BigDecimal coth(BigDecimal value) {
        return bd(Math.cosh(value.doubleValue()) / Math.sinh(value.doubleValue()));
    }

    public static BigDecimal asinh(BigDecimal value) {
        double x = value.doubleValue();
        return bd(Math.log(x + Math.sqrt(x * x + 1.0)));
    }

    public static BigDecimal acosh(BigDecimal value) {
        double x = value.doubleValue();
        return bd(Math.log(x + Math.sqrt(x - 1.0) * Math.sqrt(x + 1.0)));
    }

    public static BigDecimal atanh(BigDecimal value) {
        double x = value.doubleValue();
        return bd(0.5 * Math.log((1.0 + x) / (1.0 - x)));
    }

    public static BigDecimal asech(BigDecimal value) {
        double x = value.doubleValue();
        return bd(Math.log(1.0 / x + Math.sqrt(1.0 / (x * x) - 1.0)));
    }

    public static BigDecimal acsch(BigDecimal value) {
        double x = value.doubleValue();
        return bd(Math.log(1.0 / x + Math.sqrt(1.0 / (x * x) + 1.0)));
    }

    public static BigDecimal acoth(BigDecimal value) {
        double x = value.doubleValue();
        return bd(0.5 * Math.log((x + 1.0) / (x - 1.0)));
    }

    public static BigDecimal erf(BigDecimal value) {
        double x = value.doubleValue();
        double t = 1.0 / (1.0 + 0.5 * Math.abs(x));
        double tau = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196
            + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398
            + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
        double erf = 1.0 - tau;
        if (x < 0.0) {
            erf = -erf;
        }
        return bd(erf);
    }

    public static BigDecimal erfc(BigDecimal value) {
        return bd(1.0 - erf(value).doubleValue());
    }

    public static BigDecimal erfi(BigDecimal value) {
        double x = value.doubleValue();
        double ax = Math.abs(x);
        if (ax > 3.0) {
            double approx = Math.exp(x * x) / (Math.sqrt(Math.PI) * ax);
            return bd(Math.signum(x) * approx);
        }
        double term = x;
        double sum = x;
        for (int n = 1; n <= 20; n++) {
            term *= (x * x) / n;
            sum += term / (2 * n + 1);
        }
        return bd(2.0 / Math.sqrt(Math.PI) * sum);
    }

    public static BigDecimal sigmoid(BigDecimal value) {
        double x = value.doubleValue();
        return bd(1.0 / (1.0 + Math.exp(-x)));
    }

    public static BigDecimal log1p(BigDecimal value) {
        return bd(Math.log1p(value.doubleValue()));
    }

    public static BigDecimal expm1(BigDecimal value) {
        return bd(Math.expm1(value.doubleValue()));
    }

    public static BigDecimal hypot(BigDecimal a, BigDecimal b) {
        return bd(Math.hypot(a.doubleValue(), b.doubleValue()));
    }

    public static double logGamma(double x) {
        double[] p = {
            676.5203681218851,
            -1259.1392167224028,
            771.32342877765313,
            -176.61502916214059,
            12.507343278686905,
            -0.13857109526572012,
            9.9843695780195716e-6,
            1.5056327351493116e-7
        };
        if (x < 0.5) {
            return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x);
        }
        x -= 1.0;
        double a = 0.99999999999980993;
        for (int i = 0; i < p.length; i++) {
            a += p[i] / (x + i + 1.0);
        }
        double t = x + p.length - 0.5;
        return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
    }

    public static double gamma(double x) {
        return Math.exp(logGamma(x));
    }

    public static double beta(double a, double b) {
        return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
    }
}
