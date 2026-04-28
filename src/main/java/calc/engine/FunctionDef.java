package calc.engine;

import java.math.BigDecimal;
import java.util.List;

public final class FunctionDef {
    @FunctionalInterface
    public interface CalcFunction {
        BigDecimal apply(List<BigDecimal> args, EvalContext context);
    }

    private final String name;
    private final int minArgs;
    private final int maxArgs;
    private final CalcFunction function;
    private final String description;

    public FunctionDef(String name, int minArgs, int maxArgs, CalcFunction function, String description) {
        this.name = name;
        this.minArgs = minArgs;
        this.maxArgs = maxArgs;
        this.function = function;
        this.description = description == null ? "" : description;
    }

    public String getName() {
        return name;
    }

    public int getMinArgs() {
        return minArgs;
    }

    public int getMaxArgs() {
        return maxArgs;
    }

    public CalcFunction getFunction() {
        return function;
    }

    public String getDescription() {
        return description;
    }

    public boolean accepts(int count) {
        if (count < minArgs) {
            return false;
        }
        if (maxArgs < 0) {
            return true;
        }
        return count <= maxArgs;
    }

    public FunctionDef withName(String newName) {
        return new FunctionDef(newName, minArgs, maxArgs, function, description);
    }
}
