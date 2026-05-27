package com.stdmngmt.ui;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class InputReader {
    private final BufferedReader reader;

    public InputReader() {
        this.reader = new BufferedReader(new InputStreamReader(System.in));
    }

    public String readLine(String prompt) {
        System.out.print(prompt);
        return readLineInternal();
    }

    public String readRequired(String prompt) {
        while (true) {
            String value = readLine(prompt).trim();
            if (!value.isEmpty()) {
                return value;
            }
            System.out.println("Please enter a value.");
        }
    }

    public String readOptional(String prompt) {
        String value = readLine(prompt).trim();
        return value.isEmpty() ? null : value;
    }

    public long readLong(String prompt) {
        while (true) {
            String raw = readRequired(prompt);
            try {
                return Long.parseLong(raw);
            } catch (NumberFormatException ex) {
                System.out.println("Enter a valid number.");
            }
        }
    }

    public int readInt(String prompt) {
        while (true) {
            String raw = readRequired(prompt);
            try {
                return Integer.parseInt(raw);
            } catch (NumberFormatException ex) {
                System.out.println("Enter a valid number.");
            }
        }
    }

    public LocalDate readDateOptional(String prompt) {
        while (true) {
            String raw = readOptional(prompt + " (yyyy-MM-dd, blank to skip): ");
            if (raw == null) {
                return null;
            }
            try {
                return LocalDate.parse(raw);
            } catch (DateTimeParseException ex) {
                System.out.println("Enter a valid date in yyyy-MM-dd.");
            }
        }
    }

    private String readLineInternal() {
        try {
            String line = reader.readLine();
            return line == null ? "" : line;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read input", ex);
        }
    }
}
