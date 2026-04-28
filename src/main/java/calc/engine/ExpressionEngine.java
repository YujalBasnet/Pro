package calc.engine;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public final class ExpressionEngine {
    private final FunctionRegistry registry;

    public ExpressionEngine(FunctionRegistry registry) {
        this.registry = registry;
    }

    public BigDecimal evaluate(String expression, EvalContext context) {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression is empty");
        }
        List<Token> tokens = tokenize(expression);
        List<RpnToken> rpn = toRpn(tokens);
        return evalRpn(rpn, context);
    }

    private List<Token> tokenize(String expression) {
        List<Token> tokens = new ArrayList<>();
        int i = 0;
        while (i < expression.length()) {
            char ch = expression.charAt(i);
            if (Character.isWhitespace(ch)) {
                i++;
                continue;
            }
            if (Character.isDigit(ch) || ch == '.') {
                int start = i;
                boolean sawDot = ch == '.';
                i++;
                while (i < expression.length()) {
                    char c = expression.charAt(i);
                    if (Character.isDigit(c)) {
                        i++;
                        continue;
                    }
                    if (c == '.' && !sawDot) {
                        sawDot = true;
                        i++;
                        continue;
                    }
                    if (c == 'e' || c == 'E') {
                        i++;
                        if (i < expression.length()) {
                            char sign = expression.charAt(i);
                            if (sign == '+' || sign == '-') {
                                i++;
                            }
                        }
                        while (i < expression.length() && Character.isDigit(expression.charAt(i))) {
                            i++;
                        }
                        continue;
                    }
                    break;
                }
                String text = expression.substring(start, i);
                tokens.add(Token.number(text));
                continue;
            }
            if (Character.isLetter(ch) || ch == '_') {
                int start = i;
                i++;
                while (i < expression.length()) {
                    char c = expression.charAt(i);
                    if (Character.isLetterOrDigit(c) || c == '_') {
                        i++;
                    } else {
                        break;
                    }
                }
                String text = expression.substring(start, i).toLowerCase(Locale.ROOT);
                tokens.add(Token.identifier(text));
                continue;
            }
            if (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '^' || ch == '%') {
                tokens.add(Token.operator(String.valueOf(ch)));
                i++;
                continue;
            }
            if (ch == '(') {
                tokens.add(Token.lparen());
                i++;
                continue;
            }
            if (ch == ')') {
                tokens.add(Token.rparen());
                i++;
                continue;
            }
            if (ch == ',') {
                tokens.add(Token.comma());
                i++;
                continue;
            }
            throw new IllegalArgumentException("Unexpected character: " + ch);
        }
        return tokens;
    }

    private List<RpnToken> toRpn(List<Token> tokens) {
        List<RpnToken> output = new ArrayList<>();
        Deque<StackItem> stack = new ArrayDeque<>();
        Deque<Integer> argCount = new ArrayDeque<>();
        Deque<Boolean> argHasValue = new ArrayDeque<>();
        Token prev = null;

        for (int i = 0; i < tokens.size(); i++) {
            Token token = tokens.get(i);
            switch (token.type) {
                case NUMBER:
                    output.add(RpnToken.number(token.number));
                    markValue(argHasValue);
                    break;
                case IDENTIFIER:
                    boolean isFunction = i + 1 < tokens.size() && tokens.get(i + 1).type == TokenType.LPAREN;
                    if (isFunction) {
                        stack.push(StackItem.function(token.text));
                    } else {
                        output.add(RpnToken.identifier(token.text));
                        markValue(argHasValue);
                    }
                    break;
                case OPERATOR:
                    String symbol = token.text;
                    if (isUnaryMinus(symbol, prev)) {
                        symbol = "neg";
                    }
                    Operator op1 = Operator.get(symbol);
                    if (op1 == null) {
                        throw new IllegalArgumentException("Unknown operator: " + symbol);
                    }
                    while (!stack.isEmpty() && stack.peek().type == StackType.OPERATOR) {
                        Operator op2 = Operator.get(stack.peek().symbol);
                        if (op2 == null) {
                            break;
                        }
                        if ((op1.assoc == Assoc.LEFT && op1.precedence <= op2.precedence)
                            || (op1.assoc == Assoc.RIGHT && op1.precedence < op2.precedence)) {
                            output.add(RpnToken.operator(stack.pop().symbol));
                        } else {
                            break;
                        }
                    }
                    stack.push(StackItem.operator(symbol));
                    break;
                case LPAREN:
                    stack.push(StackItem.lparen());
                    if (prev != null && prev.type == TokenType.IDENTIFIER
                        && stack.size() >= 2 && stack.toArray(new StackItem[0])[1].type == StackType.FUNCTION) {
                        argCount.push(0);
                        argHasValue.push(false);
                    }
                    break;
                case COMMA:
                    if (argHasValue.isEmpty()) {
                        throw new IllegalArgumentException("Comma outside of function");
                    }
                    if (!argHasValue.peek()) {
                        throw new IllegalArgumentException("Missing argument before comma");
                    }
                    while (!stack.isEmpty() && stack.peek().type != StackType.LPAREN) {
                        output.add(stack.pop().toRpn());
                    }
                    if (stack.isEmpty()) {
                        throw new IllegalArgumentException("Mismatched parentheses");
                    }
                    argCount.push(argCount.pop() + 1);
                    argHasValue.pop();
                    argHasValue.push(false);
                    break;
                case RPAREN:
                    while (!stack.isEmpty() && stack.peek().type != StackType.LPAREN) {
                        output.add(stack.pop().toRpn());
                    }
                    if (stack.isEmpty()) {
                        throw new IllegalArgumentException("Mismatched parentheses");
                    }
                    stack.pop();
                    if (!stack.isEmpty() && stack.peek().type == StackType.FUNCTION) {
                        StackItem function = stack.pop();
                        if (argCount.isEmpty() || argHasValue.isEmpty()) {
                            throw new IllegalArgumentException("Function argument tracking error");
                        }
                        int count = argCount.pop();
                        boolean hadValue = argHasValue.pop();
                        if (!hadValue && count > 0) {
                            throw new IllegalArgumentException("Missing function argument");
                        }
                        int finalCount = hadValue ? count + 1 : 0;
                        output.add(RpnToken.function(function.symbol, finalCount));
                        markValue(argHasValue);
                    } else {
                        markValue(argHasValue);
                    }
                    break;
                default:
                    throw new IllegalStateException("Unhandled token type");
            }
            prev = token;
        }

        while (!stack.isEmpty()) {
            StackItem item = stack.pop();
            if (item.type == StackType.LPAREN) {
                throw new IllegalArgumentException("Mismatched parentheses");
            }
            output.add(item.toRpn());
        }

        return output;
    }

    private BigDecimal evalRpn(List<RpnToken> rpn, EvalContext context) {
        Deque<BigDecimal> stack = new ArrayDeque<>();
        MathContext mc = context.getMathContext();

        for (RpnToken token : rpn) {
            switch (token.type) {
                case NUMBER:
                    stack.push(token.number);
                    break;
                case IDENTIFIER:
                    stack.push(context.resolveIdentifier(token.text));
                    break;
                case OPERATOR:
                    applyOperator(token.text, stack, mc);
                    break;
                case FUNCTION:
                    FunctionDef def = registry.get(token.text);
                    if (def == null) {
                        throw new IllegalArgumentException("Unknown function: " + token.text);
                    }
                    if (!def.accepts(token.argCount)) {
                        throw new IllegalArgumentException("Function " + token.text + " expects "
                            + def.getMinArgs() + ".." + (def.getMaxArgs() < 0 ? "*" : def.getMaxArgs())
                            + " args, got " + token.argCount);
                    }
                    List<BigDecimal> args = new ArrayList<>(token.argCount);
                    for (int i = 0; i < token.argCount; i++) {
                        if (stack.isEmpty()) {
                            throw new IllegalArgumentException("Not enough arguments for function: " + token.text);
                        }
                        args.add(0, stack.pop());
                    }
                    BigDecimal result = def.getFunction().apply(args, context);
                    stack.push(result);
                    break;
                default:
                    throw new IllegalStateException("Unhandled RPN token type");
            }
        }

        if (stack.size() != 1) {
            throw new IllegalArgumentException("Invalid expression");
        }
        return stack.pop();
    }

    private void applyOperator(String symbol, Deque<BigDecimal> stack, MathContext mc) {
        Operator op = Operator.get(symbol);
        if (op == null) {
            throw new IllegalArgumentException("Unknown operator: " + symbol);
        }
        if (op.arity == 1) {
            if (stack.isEmpty()) {
                throw new IllegalArgumentException("Missing operand for operator: " + symbol);
            }
            BigDecimal value = stack.pop();
            if ("neg".equals(symbol)) {
                stack.push(value.negate(mc));
                return;
            }
            throw new IllegalArgumentException("Unhandled unary operator: " + symbol);
        }
        if (stack.size() < 2) {
            throw new IllegalArgumentException("Missing operand for operator: " + symbol);
        }
        BigDecimal b = stack.pop();
        BigDecimal a = stack.pop();
        switch (symbol) {
            case "+":
                stack.push(a.add(b, mc));
                break;
            case "-":
                stack.push(a.subtract(b, mc));
                break;
            case "*":
                stack.push(a.multiply(b, mc));
                break;
            case "/":
                stack.push(a.divide(b, mc));
                break;
            case "%":
                stack.push(a.remainder(b, mc));
                break;
            case "^":
                stack.push(MathUtil.pow(a, b, mc));
                break;
            default:
                throw new IllegalArgumentException("Unhandled operator: " + symbol);
        }
    }

    private boolean isUnaryMinus(String symbol, Token prev) {
        if (!"-".equals(symbol)) {
            return false;
        }
        if (prev == null) {
            return true;
        }
        return prev.type == TokenType.OPERATOR || prev.type == TokenType.LPAREN || prev.type == TokenType.COMMA;
    }

    private void markValue(Deque<Boolean> argHasValue) {
        if (!argHasValue.isEmpty()) {
            argHasValue.pop();
            argHasValue.push(true);
        }
    }

    private enum TokenType {
        NUMBER,
        IDENTIFIER,
        OPERATOR,
        LPAREN,
        RPAREN,
        COMMA
    }

    private enum StackType {
        OPERATOR,
        FUNCTION,
        LPAREN
    }

    private enum Assoc {
        LEFT,
        RIGHT
    }

    private static final class Operator {
        private static final Map<String, Operator> OPERATORS = new HashMap<>();

        static {
            OPERATORS.put("+", new Operator(2, Assoc.LEFT, 2));
            OPERATORS.put("-", new Operator(2, Assoc.LEFT, 2));
            OPERATORS.put("*", new Operator(3, Assoc.LEFT, 2));
            OPERATORS.put("/", new Operator(3, Assoc.LEFT, 2));
            OPERATORS.put("%", new Operator(3, Assoc.LEFT, 2));
            OPERATORS.put("^", new Operator(4, Assoc.RIGHT, 2));
            OPERATORS.put("neg", new Operator(5, Assoc.RIGHT, 1));
        }

        final int precedence;
        final Assoc assoc;
        final int arity;

        private Operator(int precedence, Assoc assoc, int arity) {
            this.precedence = precedence;
            this.assoc = assoc;
            this.arity = arity;
        }

        static Operator get(String symbol) {
            return OPERATORS.get(symbol);
        }
    }

    private static final class Token {
        final TokenType type;
        final String text;
        final BigDecimal number;

        private Token(TokenType type, String text, BigDecimal number) {
            this.type = type;
            this.text = text;
            this.number = number;
        }

        static Token number(String text) {
            return new Token(TokenType.NUMBER, text, new BigDecimal(text, MathUtil.MC));
        }

        static Token identifier(String text) {
            return new Token(TokenType.IDENTIFIER, text, null);
        }

        static Token operator(String text) {
            return new Token(TokenType.OPERATOR, text, null);
        }

        static Token lparen() {
            return new Token(TokenType.LPAREN, "(", null);
        }

        static Token rparen() {
            return new Token(TokenType.RPAREN, ")", null);
        }

        static Token comma() {
            return new Token(TokenType.COMMA, ",", null);
        }
    }

    private static final class RpnToken {
        final RpnType type;
        final String text;
        final BigDecimal number;
        final int argCount;

        private RpnToken(RpnType type, String text, BigDecimal number, int argCount) {
            this.type = type;
            this.text = text;
            this.number = number;
            this.argCount = argCount;
        }

        static RpnToken number(BigDecimal number) {
            return new RpnToken(RpnType.NUMBER, null, number, 0);
        }

        static RpnToken identifier(String text) {
            return new RpnToken(RpnType.IDENTIFIER, text, null, 0);
        }

        static RpnToken operator(String text) {
            return new RpnToken(RpnType.OPERATOR, text, null, 0);
        }

        static RpnToken function(String text, int argCount) {
            return new RpnToken(RpnType.FUNCTION, text, null, argCount);
        }
    }

    private enum RpnType {
        NUMBER,
        IDENTIFIER,
        OPERATOR,
        FUNCTION
    }

    private static final class StackItem {
        final StackType type;
        final String symbol;

        private StackItem(StackType type, String symbol) {
            this.type = type;
            this.symbol = symbol;
        }

        static StackItem operator(String symbol) {
            return new StackItem(StackType.OPERATOR, symbol);
        }

        static StackItem function(String symbol) {
            return new StackItem(StackType.FUNCTION, symbol);
        }

        static StackItem lparen() {
            return new StackItem(StackType.LPAREN, "(");
        }

        RpnToken toRpn() {
            if (type == StackType.OPERATOR) {
                return RpnToken.operator(symbol);
            }
            if (type == StackType.FUNCTION) {
                return RpnToken.function(symbol, 0);
            }
            throw new IllegalStateException("Cannot convert stack item to RPN: " + type);
        }
    }
}
