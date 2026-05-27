package com.stdmngmt.util;

import java.time.LocalDate;

public final class Validators {
    private Validators() {
    }

    public static String requireNonBlank(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    public static String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }
        String trimmed = phone.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public static String normalizeCourseCode(String code) {
        return code == null ? null : code.trim().toUpperCase();
    }

    public static void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        int at = email.indexOf('@');
        int dot = email.lastIndexOf('.');
        if (at <= 0 || dot <= at + 1 || dot >= email.length() - 1) {
            throw new IllegalArgumentException("Email format is invalid.");
        }
    }

    public static void validatePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return;
        }
        String digits = phone.replaceAll("[^0-9]", "");
        if (digits.length() < 7 || digits.length() > 15) {
            throw new IllegalArgumentException("Phone must have 7 to 15 digits.");
        }
    }

    public static void validateCourseCode(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Course code is required.");
        }
        if (!code.matches("[A-Z0-9-]{2,12}")) {
            throw new IllegalArgumentException("Course code must be 2-12 chars (A-Z, 0-9, -).");
        }
    }

    public static void validateCredits(int credits) {
        if (credits < 1 || credits > 10) {
            throw new IllegalArgumentException("Credits must be between 1 and 10.");
        }
    }

    public static void validateDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return;
        }
        if (dateOfBirth.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Date of birth cannot be in the future.");
        }
    }
}
