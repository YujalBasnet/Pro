# Scientific Calculator (JavaFX)

This is a JavaFX scientific calculator with an expression parser and a 417-function catalog.

## Run

1. Install JDK 17+ and Maven.
2. From the project root:

```
mvn javafx:run
```

## Usage

- Type expressions like `sin(30) + log10(1000)`.
- Use the angle mode selector (DEG/RAD/GRAD).
- Double-click a function name to insert it into the expression.
- Constants: `pi`, `e`, `tau`, `phi`, `sqrt2`, `sqrt3`, `ln2`, `ln10`.
- Last answer is stored in `ans`.
