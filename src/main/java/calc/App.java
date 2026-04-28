package calc;

import calc.engine.AngleMode;
import calc.engine.EvalContext;
import calc.engine.ExpressionEngine;
import calc.engine.FunctionRegistry;
import java.math.BigDecimal;
import java.util.Locale;
import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.SelectionMode;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class App extends Application {
    private final FunctionRegistry registry = FunctionRegistry.createDefault();
    private final EvalContext context = new EvalContext();
    private final ExpressionEngine engine = new ExpressionEngine(registry);

    @Override
    public void start(Stage stage) {
        TextArea resultArea = new TextArea();
        resultArea.setEditable(false);
        resultArea.setWrapText(true);
        resultArea.setPrefRowCount(6);

        TextField expressionField = new TextField();
        expressionField.setPromptText("Enter expression, e.g. sin(30) + log10(1000)");
        expressionField.setOnAction(event -> evaluate(expressionField.getText(), resultArea));

        ComboBox<AngleMode> angleModeBox = new ComboBox<>(FXCollections.observableArrayList(AngleMode.values()));
        angleModeBox.setValue(AngleMode.DEG);
        angleModeBox.valueProperty().addListener((obs, oldValue, newValue) -> context.setAngleMode(newValue));

        Button evalButton = new Button("Evaluate");
        evalButton.setOnAction(event -> evaluate(expressionField.getText(), resultArea));

        Button clearButton = new Button("Clear");
        clearButton.setOnAction(event -> expressionField.clear());

        Button backButton = new Button("Backspace");
        backButton.setOnAction(event -> backspace(expressionField));

        HBox inputRow = new HBox(8, new Label("Expression"), expressionField, evalButton, clearButton, backButton, angleModeBox);
        inputRow.setAlignment(Pos.CENTER_LEFT);
        HBox.setHgrow(expressionField, Priority.ALWAYS);

        GridPane keypad = buildKeypad(expressionField, resultArea);

        ObservableList<String> functionItems = FXCollections.observableArrayList(registry.getFunctionNames());
        FilteredList<String> filtered = new FilteredList<>(functionItems, name -> true);
        TextField searchField = new TextField();
        searchField.setPromptText("Search functions");
        searchField.textProperty().addListener((obs, oldValue, newValue) -> {
            String query = newValue == null ? "" : newValue.trim().toLowerCase(Locale.ROOT);
            filtered.setPredicate(name -> query.isEmpty() || name.contains(query));
        });

        ListView<String> functionList = new ListView<>(filtered);
        functionList.getSelectionModel().setSelectionMode(SelectionMode.SINGLE);
        functionList.setOnMouseClicked(event -> {
            if (event.getClickCount() == 2) {
                insertFunction(expressionField, functionList.getSelectionModel().getSelectedItem());
            }
        });
        functionList.setOnKeyPressed(event -> {
            if (event.getCode() == KeyCode.ENTER) {
                insertFunction(expressionField, functionList.getSelectionModel().getSelectedItem());
            }
        });

        Label functionCount = new Label("Functions: " + registry.getFunctionCount());
        VBox functionPane = new VBox(8, new Label("Functions"), searchField, functionList, functionCount);
        functionPane.setPadding(new Insets(8));
        functionPane.setPrefWidth(220);
        VBox.setVgrow(functionList, Priority.ALWAYS);

        VBox center = new VBox(10, inputRow, keypad, new Label("Results"), resultArea);
        center.setPadding(new Insets(8));
        VBox.setVgrow(resultArea, Priority.ALWAYS);

        BorderPane root = new BorderPane();
        root.setLeft(functionPane);
        root.setCenter(center);
        root.setPadding(new Insets(8));

        Scene scene = new Scene(root, 1024, 640);
        stage.setTitle("Scientific Calculator");
        stage.setScene(scene);
        stage.show();
    }

    private GridPane buildKeypad(TextField field, TextArea resultArea) {
        String[][] keys = {
            {"7", "8", "9", "/"},
            {"4", "5", "6", "*"},
            {"1", "2", "3", "-"},
            {"0", ".", "(", ")"},
            {",", "^", "%", "+"},
            {"pi", "e", "ans", "="}
        };

        GridPane grid = new GridPane();
        grid.setHgap(6);
        grid.setVgap(6);
        for (int row = 0; row < keys.length; row++) {
            for (int col = 0; col < keys[row].length; col++) {
                String label = keys[row][col];
                Button button = new Button(label);
                button.setMaxWidth(Double.MAX_VALUE);
                button.setOnAction(event -> {
                    if ("=".equals(label)) {
                        evaluate(field.getText(), resultArea);
                    } else {
                        insertText(field, label);
                    }
                });
                grid.add(button, col, row);
                GridPane.setHgrow(button, Priority.ALWAYS);
            }
        }
        return grid;
    }

    private void evaluate(String expression, TextArea output) {
        if (expression == null || expression.trim().isEmpty()) {
            return;
        }
        try {
            BigDecimal result = engine.evaluate(expression, context);
            context.setVariable("ans", result);
            output.appendText(expression + " = " + format(result) + "\n");
        } catch (RuntimeException ex) {
            output.appendText("Error: " + ex.getMessage() + "\n");
        }
    }

    private void insertFunction(TextField field, String name) {
        if (name == null || name.isEmpty()) {
            return;
        }
        insertText(field, name + "(");
    }

    private void insertText(TextField field, String text) {
        int pos = field.getCaretPosition();
        field.insertText(pos, text);
        field.positionCaret(pos + text.length());
    }

    private void backspace(TextField field) {
        int pos = field.getCaretPosition();
        if (pos > 0) {
            field.deleteText(pos - 1, pos);
        }
    }

    private String format(BigDecimal value) {
        BigDecimal stripped = value.stripTrailingZeros();
        if (stripped.scale() < 0) {
            stripped = stripped.setScale(0);
        }
        return stripped.toPlainString();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
