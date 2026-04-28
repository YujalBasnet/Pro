package calc.engine;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Random;

public final class EvalContext {
    private AngleMode angleMode = AngleMode.DEG;
    private final MathContext mathContext = MathUtil.MC;
    private final Random random = new Random();
    private final Map<String, BigDecimal> variables = new HashMap<>();
    private final Map<String, BigDecimal> constants = new HashMap<>();

    public EvalContext() {
        constants.put("pi", MathUtil.BD_PI);
        constants.put("e", MathUtil.BD_E);
        constants.put("tau", MathUtil.BD_TAU);
        constants.put("phi", MathUtil.BD_PHI);
        constants.put("sqrt2", MathUtil.BD_SQRT2);
        constants.put("sqrt3", MathUtil.BD_SQRT3);
        constants.put("ln2", MathUtil.BD_LN2);
        constants.put("ln10", MathUtil.BD_LN10);
        constants.put("catalan", MathUtil.BD_CATALAN);
        constants.put("apery", MathUtil.BD_APERY);
        constants.put("khinchin", MathUtil.BD_KHINCHIN);
        variables.put("ans", BigDecimal.ZERO);
    }

    public AngleMode getAngleMode() {
        return angleMode;
    }

    public void setAngleMode(AngleMode angleMode) {
        this.angleMode = angleMode == null ? AngleMode.DEG : angleMode;
    }

    public MathContext getMathContext() {
        return mathContext;
    }

    public Random getRandom() {
        return random;
    }

    public void setRandomSeed(long seed) {
        random.setSeed(seed);
    }

    public void setVariable(String name, BigDecimal value) {
        variables.put(normalize(name), value);
    }

    public BigDecimal getVariable(String name) {
        return variables.get(normalize(name));
    }

    public BigDecimal resolveIdentifier(String name) {
        String key = normalize(name);
        BigDecimal value = variables.get(key);
        if (value != null) {
            return value;
        }
        value = constants.get(key);
        if (value != null) {
            return value;
        }
        throw new IllegalArgumentException("Unknown identifier: " + name);
    }

    public Map<String, BigDecimal> getConstants() {
        return Collections.unmodifiableMap(constants);
    }

    private String normalize(String name) {
        return name == null ? "" : name.toLowerCase(Locale.ROOT);
    }
}
