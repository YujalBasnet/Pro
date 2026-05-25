package com.stdmngmt.ui;

import com.stdmngmt.model.Student;
import com.stdmngmt.model.StudentStatus;
import com.stdmngmt.service.StudentNotFoundException;
import com.stdmngmt.service.StudentService;

import java.time.LocalDate;
import java.util.List;

public class ConsoleMenu {
    private final InputReader input;
    private final StudentService service;

    public ConsoleMenu(InputReader input, StudentService service) {
        this.input = input;
        this.service = service;
    }

    public void run() {
        System.out.println("Student Management System");
        boolean running = true;
        while (running) {
            printMenu();
            String choice = input.readRequired("Select option: ");
            switch (choice) {
                case "1":
                    listStudents();
                    break;
                case "2":
                    addStudent();
                    break;
                case "3":
                    viewStudent();
                    break;
                case "4":
                    updateStudent();
                    break;
                case "5":
                    deleteStudent();
                    break;
                case "6":
                    searchStudents();
                    break;
                case "0":
                    running = false;
                    break;
                default:
                    System.out.println("Unknown option.");
            }
        }
        System.out.println("Goodbye.");
    }

    private void printMenu() {
        System.out.println();
        System.out.println("1) List students");
        System.out.println("2) Add student");
        System.out.println("3) View student");
        System.out.println("4) Update student");
        System.out.println("5) Delete student");
        System.out.println("6) Search by name");
        System.out.println("0) Exit");
    }

    private void listStudents() {
        List<Student> students = service.listStudents();
        if (students.isEmpty()) {
            System.out.println("No students found.");
            return;
        }
        printStudentTable(students);
    }

    private void addStudent() {
        try {
            String firstName = input.readRequired("First name: ");
            String lastName = input.readRequired("Last name: ");
            String email = input.readRequired("Email: ");
            String phone = input.readOptional("Phone (optional): ");
            LocalDate dateOfBirth = input.readDateOptional("Date of birth");

            Student created = service.createStudent(firstName, lastName, email, phone, dateOfBirth);
            System.out.println("Created student with ID: " + created.getId());
        } catch (IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void viewStudent() {
        long id = input.readLong("Student ID: ");
        try {
            Student student = service.getStudent(id);
            printStudentDetail(student);
        } catch (StudentNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void updateStudent() {
        long id = input.readLong("Student ID: ");
        try {
            Student existing = service.getStudent(id);

            String firstName = readWithDefault("First name", existing.getFirstName());
            String lastName = readWithDefault("Last name", existing.getLastName());
            String email = readWithDefault("Email", existing.getEmail());
            String phone = readWithDefaultAllowClear("Phone", existing.getPhone());
            LocalDate dob = readDateWithDefaultAllowClear("Date of birth", existing.getDateOfBirth());
            StudentStatus status = readStatusWithDefault(existing.getStatus());

            Student updated = service.updateStudent(id, firstName, lastName, email, phone, dob, status);
            System.out.println("Updated student: " + updated.getId());
        } catch (StudentNotFoundException | IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void deleteStudent() {
        long id = input.readLong("Student ID: ");
        try {
            service.deleteStudent(id);
            System.out.println("Student deleted.");
        } catch (StudentNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void searchStudents() {
        String query = input.readRequired("Search name: ");
        try {
            List<Student> results = service.searchStudents(query);
            if (results.isEmpty()) {
                System.out.println("No matches found.");
                return;
            }
            printStudentTable(results);
        } catch (IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private String readWithDefault(String label, String current) {
        String value = input.readOptional(label + " [" + current + "]: ");
        return value == null ? current : value;
    }

    private String readWithDefaultAllowClear(String label, String current) {
        String prompt = label + " [" + (current == null ? "none" : current) + "] (blank to keep, '-' to clear): ";
        String value = input.readOptional(prompt);
        if (value == null) {
            return current;
        }
        if ("-".equals(value)) {
            return null;
        }
        return value;
    }

    private LocalDate readDateWithDefaultAllowClear(String label, LocalDate current) {
        String currentText = current == null ? "none" : current.toString();
        while (true) {
            String raw = input.readOptional(label + " [" + currentText + "] (yyyy-MM-dd, blank to keep, '-' to clear): ");
            if (raw == null) {
                return current;
            }
            if ("-".equals(raw)) {
                return null;
            }
            try {
                return LocalDate.parse(raw);
            } catch (Exception ex) {
                System.out.println("Enter a valid date in yyyy-MM-dd.");
            }
        }
    }

    private StudentStatus readStatusWithDefault(StudentStatus current) {
        while (true) {
            String raw = input.readOptional("Status [" + current + "] (ACTIVE/INACTIVE): ");
            if (raw == null) {
                return current;
            }
            try {
                return StudentStatus.valueOf(raw.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                System.out.println("Enter ACTIVE or INACTIVE.");
            }
        }
    }

    private void printStudentTable(List<Student> students) {
        String header = String.format("%-6s %-22s %-28s %-16s %-10s", "ID", "Name", "Email", "Phone", "Status");
        System.out.println(header);
        System.out.println("-".repeat(header.length()));
        for (Student student : students) {
            String name = student.getFullName();
            String phone = student.getPhone() == null ? "" : student.getPhone();
            String row = String.format("%-6d %-22s %-28s %-16s %-10s",
                student.getId(), name, student.getEmail(), phone, student.getStatus());
            System.out.println(row);
        }
    }

    private void printStudentDetail(Student student) {
        System.out.println("ID: " + student.getId());
        System.out.println("Name: " + student.getFullName());
        System.out.println("Email: " + student.getEmail());
        System.out.println("Phone: " + (student.getPhone() == null ? "" : student.getPhone()));
        System.out.println("Date of birth: " + (student.getDateOfBirth() == null ? "" : student.getDateOfBirth()));
        System.out.println("Status: " + student.getStatus());
    }
}
